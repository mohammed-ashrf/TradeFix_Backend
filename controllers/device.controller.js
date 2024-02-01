const Device = require('../models/device.model');
const DeliveredDevice = require('../models/deliveredDevices.model');
exports.getDevices = async function (req, res) {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (error) {
    console.error('Failed to get devices:', error.message);
    res.status(500).json({ message: 'Failed to get devices' });
  }
};

exports.getDevicesByPage = async function (req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from the query parameters
    const pageSize = parseInt(req.query.pageSize) || 10; // Get the page size from the query parameters

    const devices = await Device.find()
      .skip((page - 1) * pageSize) // Skip devices based on the page number and page size
      .limit(pageSize); // Limit the number of devices per page

    res.json(devices);
  } catch (error) {
    console.error('Failed to get devices:', error.message);
    res.status(500).json({ message: 'Failed to get devices' });
  }
};

exports.getDeviceById = async function (req, res) {
  try {
    const device = await Device.findById(req.params.id);
    res.json(device);
  } catch (error) {
    console.error('Failed to get device:', error.message);
    res.status(500).json({ message: 'Failed to get device' });
  }
};

exports.updateDeviceById = async function (req, res) {
  try {
    const device = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(device);
  } catch (error) {
    console.error('Failed to update device:', error.message);
    res.status(500).json({ message: 'Failed to update device' });
  }
};

exports.deleteDeviceById = async function (req, res) {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Failed to delete device:', error.message);
    res.status(500).json({ message: 'Failed to delete device' });
  }
};

exports.createDevice = async function (req, res) {
  try {
    const { clientName, telnum,deviceType,section,engineer,priority,clientSelection,complain,repair, products,notes,productsMoney,fees,discount,total,cash,owing,finished, receivingDate,toDeliverDate, repaired, paidAdmissionFees, delivered, returned, reciever, currentEngineer } = req.body;

    if (!clientName) {
      return res.status(400).json({ message: 'Name is required required' });
    }
    
    const device = new Device({ clientName, telnum,deviceType,section,engineer,priority,clientSelection,complain,repair, products,notes,productsMoney,fees,discount,total,cash,owing,finished,receivingDate, toDeliverDate,repaired, paidAdmissionFees, delivered, returned, reciever,currentEngineer});
    const savedDevice = await device.save();
    res.status(201).json(savedDevice);
  } catch (error) {
    console.error('Failed to create device:', error.message);
    res.status(500).json({ message: 'Failed to create device' });
  }
};

exports.getLastDevice = async function (req, res) {
  try {
    const lastDevice = await Device.findOne().sort({ _id: -1 });
    res.json(lastDevice);
  } catch (error) {
    console.error('Failed to get last device:', error.message);
    res.status(500).json({ message: 'Failed to get last device' });
  }
};

exports.moveDeviceToDelivered = async (req, res) => {
  const deviceId = req.params.id;

  try {
    // Find the device in the "devices" collection
    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    // Update the "delivered" property to true
    device.delivered = true;

    // Save the updated device in the "devices" collection
    await device.save();
    // Create a new DeliveredDevice object using the device's data
    const deliveredDevice = new DeliveredDevice({
      _id: device._id, // Assign the same _id as the original device
      clientName: device.clientName,
      telnum: device.telnum,
      deviceType: device.deviceType,
      section: device.section,
      engineer: device.engineer,
      priority: device.priority,
      clientSelection: device.clientSelection,
      complain: device.complain,
      repair: device.repair,
      products: device.products,
      notes: device.notes,
      productsMoney: device.productsMoney,
      fees: device.fees,
      discount: device.discount,
      total: device.total,
      cash: device.cash,
      owing: device.owing,
      finished: device.finished,
      receivingDate: device.receivingDate,
      deliveredDate: new Date(),
      repairDate: device.repairDate,
      repaired: device.repaired,
      paidAdmissionFees: device.paidAdmissionFees,
      delivered: device.delivered,
      returned: device.returned,
      reciever: device.reciever,
      currentEngineer: device.currentEngineer,
    });

    // Save the deliveredDevice in the "delivered devices" collection
    await deliveredDevice.save();

    // Remove the device from the "devices" collection
    await Device.findByIdAndRemove(deviceId);

    res.json({ message: 'Device moved to delivered devices' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all delivered devices
exports.getAllDeliveredDevices = async (req, res) => {
  try {
    const deliveredDevices = await DeliveredDevice.find();
    res.json(deliveredDevices);
  } catch (error) {
    console.error('Failed to get devices:', error.message);
    res.status(500).json({ message: 'Failed to get devices' });
  }
};
exports.getDeliveredDevicesByPage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from the query parameters
    const pageSize = parseInt(req.query.pageSize) || 10; // Get the page size from the query parameters

    const deliveredDevices = await DeliveredDevice.find()
      .skip((page - 1) * pageSize) // Skip delivered devices based on the page number and page size
      .limit(pageSize); // Limit the number of delivered devices per page

    res.json(deliveredDevices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getDeliveredDeviceById = async function (req, res) {
  try {
    const device = await DeliveredDevice.findById(req.params.id);
    res.json(device);
  } catch (error) {
    console.error('Failed to get Delivered device:', error.message);
    res.status(500).json({ message: 'Failed to get Delivered device' });
  }
};

// Delete a specific delivered device
exports.deleteDeliveredDevice = async (req, res) => {
  const deviceId = req.params.id;

  try {
    await DeliveredDevice.findByIdAndRemove(deviceId);
    res.json({ message: 'Delivered device deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a delivered device
exports.updateDeliveredDevice = async (req, res) => {
  const deviceId = req.params.id;
  const updates = req.body;

  try {
    const updatedDevice = await DeliveredDevice.findByIdAndUpdate(deviceId, updates, {
      new: true,
    });
    res.json(updatedDevice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Return a delivered device to the "devices" collection
exports.returnDeviceToDevices = async (req, res) => {
  const deviceId = req.params.id;

  try {
    // Find the device in the "delivered devices" collection
    const deliveredDevice = await DeliveredDevice.findById(deviceId);
    if (!deliveredDevice) {
      return res.status(404).json({ error: 'Device not found' });
    }

    // Update the "delivered" and "returned" properties to false
    deliveredDevice.delivered = false;
    deliveredDevice.returned = true;
    deliveredDevice.repaired = false;

    await deliveredDevice.save();

    // Save the updated device in the "devices" collection
    const returnedDevice = new Device({
      _id: deliveredDevice._id, // Assign the same _id as the original device
      clientName: deliveredDevice.clientName,
      telnum: deliveredDevice.telnum,
      deviceType: deliveredDevice.deviceType,
      section: deliveredDevice.section,
      engineer: deliveredDevice.engineer,
      priority: deliveredDevice.priority,
      clientSelection: deliveredDevice.clientSelection,
      complain: deliveredDevice.complain,
      repair: deliveredDevice.repair,
      products: deliveredDevice.products,
      notes: deliveredDevice.notes,
      productsMoney: deliveredDevice.productsMoney,
      fees: deliveredDevice.fees,
      discount: deliveredDevice.discount,
      total: deliveredDevice.total,
      cash: deliveredDevice.cash,
      owing: deliveredDevice.owing,
      finished: deliveredDevice.finished,
      receivingDate: deliveredDevice.receivingDate,
      toDeliverDate: deliveredDevice.deliveredDate,
      repairDate: deliveredDevice.repairDate,
      repaired: deliveredDevice.repaired,
      paidAdmissionFees: deliveredDevice.paidAdmissionFees,
      delivered: deliveredDevice.delivered,
      returned: deliveredDevice.returned,
      reciever: deliveredDevice.reciever,
      currentEngineer: deliveredDevice.currentEngineer,
    });

    // Insert the same document into the "devices" collection
    // const returnedDevice = new Device(device);
    await returnedDevice.save();

    // Remove the device from the "delivered devices" collection
    await DeliveredDevice.findByIdAndRemove(deviceId);

    res.json({ message: 'Device returned to devices' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};