const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config');
const axios = require('axios');

exports.register = async function (req, res) {
  try {
    const { username, email, password, role, access } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    if (role === 'admin') {
      return res.status(409).json({ message: 'Admin already specified :)' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, email, password: hashedPassword, role, access });
    const savedUser = await user.save();

    const token = jwt.sign({ id: savedUser._id }, config.jwtSecret, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    console.error('Failed to register user:', error.message);
    res.status(500).json({ message: 'Failed to register user' });
  }
};

exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!password) {
      return res.status(400).json({ message: 'password is required' });
    }

    if (email === process.env.AdminUsername && password === process.env.AdminPassword) {
      const adminUser = await User.findOne({ role: 'admin' });
      if (!adminUser) {
        // Create a default admin user with provided credentials
        const salt = await bcrypt.genSalt(10);
        const username = 'Admin';
        const email = process.env.AdminUsername;
        const hashedPassword = await bcrypt.hash(process.env.AdminPassword, salt);
        const user = new User({ username, email, password: hashedPassword, role: 'admin' });
        const savedUser = await user.save();
  
        const token = jwt.sign({ id: savedUser._id }, config.jwtSecret, { expiresIn: '1h' });
  
        return res.status(201).json({ token });
      }
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // axios.get(`${process.env.VERIFYURL}/${process.env.CID}/${process.env.DID}`)
    // .then(function (response) {
    //   if(response.data.isRegistered === true) {
    //     const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });
    //     res.json({ token });
    //   }else(
    //     res.status(400).json({message: 'Not Authrized contact the responsible engineer to solve it'})
    //   );
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Failed to login user:', error.message);
    res.status(500).json({ message: 'Failed to login user' });
  }
};

exports.getUsers = async function(req, res) { 
  try { 
    const users = await User.find(); 
    res.status(200).json(users); 
  } catch (error) { 
    console.error('Failed to get users:', error.message); 
    res.status(500).json({ message: 'Failed to get users' }); 
  }
}

exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.checkToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

exports.getUserById = async function(req, res) { 
  try { 
    const user = await User.findById(req.params.id); 
    res.status(200).json(user); 
  } catch (error) { 
    console.error('Failed to get user by ID:', error.message); 
    res.status(500).json({ message: 'Failed to get user by ID' }); 
  }
};

exports.updateUser = async function(req, res) {
  try {
    const { username, email, password, role, access } = req.body;
    console.log(req.params.id);
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) {
      user.username = username;
    }

    if (email) {
      user.email = email;
    }

    if (password) {
      if (password !== "") {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
      }
    }

    if (role) {
      user.role = role;
    }

    if (access) {
      user.access = access;
    }

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Failed to update user:', error.message);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

exports.deleteUser = async function(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'ID is required' });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    console.error('Failed to delete user:', error.message);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

async function verifyCompany(verificationKey, location, macAddress, ipAddress) {
  try {
    const response = await axios.post(process.env.VERIFYURL, {
      verificationKey,
      location,
      macAddress,
      ipAddress
    });

    return response.data;
  } catch (error) {
    console.error('Error occurred during company verification:', error);
    throw error;
  }
}