const express = require('express');
const multer = require('multer');
const isAuth = require("../middleware/isAuth");
const restrictTo = require("../middleware/restriction");
const documentController = require('../controller/documentController');

const upload = multer();

const router = express.Router();

router.post('/upload', isAuth, restrictTo('admin', 'client'), upload.single('file'), documentController.uploadDocument);
router.put('/:docId', isAuth, restrictTo('admin'), documentController.updateDocument);
router.delete('/:docId', isAuth, restrictTo('admin'), documentController.deleteDocument);
router.get('/:docId', isAuth, restrictTo('admin', 'client'), documentController.getDocument);

module.exports = router;
