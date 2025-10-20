const express = require('express');
const cors = require('cors');
const conn = require('../MongoDb/db_connection');

// Models
const Allergies = require('../Models/Allergies');
const LabResults = require('../Models/LabResults');
const MedicalHistory = require('../Models/MedicalHistory');  
const Medication = require('../Models/Medication');
const Patient = require('../Models/Patient');
const Prescriptions = require('../Models/Prescriptions');
const ReasonVisit = require('../Models/ReasonVisits');
const VitalSign = require('../Models/VitalSigns');

conn();
const app = express();
app.use(express.json());
app.use(cors());

app.post("/registerpatient", async (req, res) => {
    const { patient: patientData, visit, vitalSigns, medications, medicalHistory, allergies, labResults, prescriptions } = req.body;
    console.log("Reques Body",req.body)
    try {
        //Create patient
        const newPatient = await Patient.create({ ...patientData });
        const patientId = newPatient._id;

        //Create reason for visit
        if (visit) {
            await ReasonVisit.create({ ...visit, patientId });
        }

        //Create vital signs
       if (vitalSigns) {
            await VitalSign.create({ ...vitalSigns, patientId });
        }


        //Create medications
        if (medications && medications.length) {
            const medsWithPatientId = medications.map(m => ({ ...m, patientId }));
            await Medication.insertMany(medsWithPatientId);
        }

        //Create medical history
        if (medicalHistory && medicalHistory.length) {
            const historyWithPatientId = medicalHistory.map(h => ({ ...h, patientId }));
            await MedicalHistory.insertMany(historyWithPatientId);
        }

        //Create allergies
        if (allergies && allergies.length) {
            const allergiesWithPatientId = allergies.map(a => ({ ...a, patientId }));
            await Allergies.insertMany(allergiesWithPatientId);
        }

        //Create lab results
        if (labResults && labResults.length) {
            const labWithPatientId = labResults.map(l => ({ ...l, patientId }));
            await LabResults.insertMany(labWithPatientId);
        }

        //Create prescriptions
        if (prescriptions && prescriptions.length) {
            const prescriptionsWithPatientId = prescriptions.map(p => ({ ...p, patientId }));
            await Prescriptions.insertMany(prescriptionsWithPatientId);
        }

        res.status(200).json({ success: true, message: "Patient registered successfully", patientId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.listen(8080, () => console.log("Server is running on port 8080"));
