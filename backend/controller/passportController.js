const { passportModel } = require('../Model/passportModel');
const { sendEvent } = require('../kafka/kafkaProducer');

// Create Battery Passport
const createPassport = async (req, res) => {
    try {
        const passport = new passportModel(req.body.data);
        await passport.save();

        // Emit Kafka event
        await sendEvent('passport.created', passport);

        res.status(201).json({ success: true, passport });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Get Passport
const getPassport = async (req, res) => {
    try {
        const passport = await passportModel.findById(req.params.id);
        if (!passport) return res.status(404).json({ success: false, msg: 'Passport not found' });
        res.json({ success: true, passport });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Update Passport
const updatePassport = async (req, res) => {
    try {
        const passport = await passportModel.findByIdAndUpdate(req.params.id, req.body.data, { new: true });
        if (!passport) return res.status(404).json({ success: false, msg: 'Passport not found' });

        await sendEvent('passport.updated', passport);
        res.json({ success: true, passport });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Delete Passport
const deletePassport = async (req, res) => {
    try {
        const passport = await passportModel.findByIdAndDelete(req.params.id);
        if (!passport) return res.status(404).json({ success: false, msg: 'Passport not found' });

        await sendEvent('passport.deleted', { id: req.params.id });
        res.json({ success: true, msg: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

module.exports = { createPassport, getPassport, updatePassport, deletePassport };
