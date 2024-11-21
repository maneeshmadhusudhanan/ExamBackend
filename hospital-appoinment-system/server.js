
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Appointment = require('./models/Appointment');

dotenv.config();
const app = express();
const PORT = 8000;
const uri = process.env.mongodb_uri; 
mongoose.connect(uri);

app.use(bodyParser.json());

const database = mongoose.connection;
database.on("error", (error) => {
    console.log(error);
});

database.once("connected", () => {
    console.log("Database connected");
});


app.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST appointment

app.post('/appointments', async (req, res) => {
    const appointment = new Appointment(req.body);
    try {
        const newAppointment = await appointment.save();
        res.status(201).json(newAppointment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//  (update) an appointment

app.put('/appointments/:id', async (req, res) => {
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedAppointment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE an appointment

app.delete('/appointments/:id', async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Appointment deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET appointments by doctor name

app.get('/appointments/doctor/:doctorName', async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctorName: req.params.doctorName });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//  display all token details for a particular doctor

app.get('/appointments/token-details/:doctorName', async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctorName: req.params.doctorName });
        if (appointments.length === 0) {
            return res.status(404).json({ message: 'No appointments found for this doctor.' });
        }
        const tokenDetails = appointments.map(appointment => ({
            tokenId: appointment.tokenId,
            patientName: appointment.patientName,
            appointmentDate: appointment.appointmentDate,
            appointmentTime: appointment.appointmentTime
        }));
        res.json(tokenDetails);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});