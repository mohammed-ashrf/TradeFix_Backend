const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users', authController.getUsers);
router.get('/user', authController.checkToken, (req, res) => {
    // Return user data
    res.json({ user: req.user });
});
router.get('/user/:id', authController.getUserById);
router.put('/user/:id', authController.updateUser);
router.delete('/user/:id', authController.deleteUser);
  

module.exports = router;