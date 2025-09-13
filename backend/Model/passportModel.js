const mongoose = require('mongoose');

const manufacturerSchema = new mongoose.Schema({
    manufacturerName: { type: String, required: true },
    manufacturerIdentifier: { type: String, required: true }
}, { _id: false });

const batteryModelSchema = new mongoose.Schema({
    id: { type: String, required: true },
    modelName: { type: String, required: true }
}, { _id: false });

const hazardousSubstanceSchema = new mongoose.Schema({
    substanceName: { type: String, required: true },
    chemicalFormula: { type: String, required: true },
    casNumber: { type: String, required: true }
}, { _id: false });

const batteryPassportSchema = new mongoose.Schema({
    generalInformation: {
        batteryIdentifier: { type: String, required: true },
        batteryModel: { type: batteryModelSchema, required: true },
        batteryMass: { type: Number, required: true },
        batteryCategory: { type: String, required: true },
        batteryStatus: { type: String, required: true },
        manufacturingDate: { type: Date, required: true },
        manufacturingPlace: { type: String, required: true },
        warrantyPeriod: { type: String, required: true },
        manufacturerInformation: { type: manufacturerSchema, required: true }
    },
    materialComposition: {
        batteryChemistry: { type: String, required: true },
        criticalRawMaterials: [{ type: String, required: true }],
        hazardousSubstances: [hazardousSubstanceSchema]
    },
    carbonFootprint: {
        totalCarbonFootprint: { type: Number, required: true },
        measurementUnit: { type: String, required: true },
        methodology: { type: String, required: true }
    }
}, { timestamps: true });

const passportModel = mongoose.model('BatteryPassport', batteryPassportSchema);

module.exports = { passportModel };
