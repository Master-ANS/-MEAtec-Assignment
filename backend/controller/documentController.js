const Document = require('../Model/documentModel');
const { uploadFile, deleteFile, getFileUrl } = require('../helper/s3Service');
const { v4: uuidv4 } = require('uuid');

// Upload File
const uploadDocument = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ success: false, msg: "File is required" });
        }

        const key = `documents/${uuidv4()}-${file.originalname}`;
        const s3Result = await uploadFile(key, file.buffer, file.mimetype);

        const document = new Document({
            fileName: file.originalname,
            s3Key: s3Result.Key,
            bucket: s3Result.Bucket,
            location: s3Result.Location,
            size: file.size,
            contentType: file.mimetype
        });

        await document.save();

        res.status(201).json({
            docId: document._id,
            fileName: document.fileName,
            createdAt: document.createdAt
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Update File Metadata
const updateDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.docId);
        if (!document) {
            return res.status(404).json({ success: false, msg: 'Document not found' });
        }

        const { fileName } = req.body;
        if (fileName) {
            document.fileName = fileName;
        }

        await document.save();

        res.json({ success: true, msg: 'Document metadata updated' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Delete File
const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.docId);
        if (!document) {
            return res.status(404).json({ success: false, msg: 'Document not found' });
        }

        await deleteFile(document.s3Key);
        await document.remove();

        res.json({ success: true, msg: 'Document deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Get Downloadable Link
const getDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.docId);
        if (!document) {
            return res.status(404).json({ success: false, msg: 'Document not found' });
        }

        const url = getFileUrl(document.s3Key);

        res.json({
            success: true,
            url
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

module.exports = {
    uploadDocument,
    updateDocument,
    deleteDocument,
    getDocument
};
