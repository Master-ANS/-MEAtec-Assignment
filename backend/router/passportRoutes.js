const express = require('express');
const passportRoutes = express.Router();
const authController = require('../controller/userAuth'); 
const isAuth = require("../middleware/isAuth");
const restrictTo = require("../middleware/restriction")
const passportController = require('../controller/passportController');

// Admin only
passportRoutes.post('/', isAuth, restrictTo('admin'), passportController.createPassport);
passportRoutes.put('/:id', isAuth, restrictTo('admin'), passportController.updatePassport);
passportRoutes.delete('/:id', isAuth, restrictTo('admin'), passportController.deletePassport);

// Admin or client
passportRoutes.get('/:id', isAuth, restrictTo('admin', 'client'), passportController.getPassport);

module.exports = passportRoutes;
