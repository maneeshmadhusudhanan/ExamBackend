
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    tokenId: { type: String, required: true },
    patientName: { type: String, required: true },
    doctorName: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true }, 
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;