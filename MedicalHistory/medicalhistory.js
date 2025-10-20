const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const conn = require('../MongoDb/db_connection')
const MedicalHistory = require('../Models/MedicalHistory');  

const app = express()

conn()
app.use(express.json())
app.use(cors())

app.get("/medicalhistory/patients/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    console.log("Received patientId:", patientId);


    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID format",
      });
    }

    const histories = await MedicalHistory.find({
      patientId: new mongoose.Types.ObjectId(patientId),
    })

    if (histories.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No medical history",
      });
    }

    res.status(200).json({ success: true, data: histories });
  } catch (error) {
    console.error("Error fetching medical histories:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});




app.listen(5000,()=>{
    console.log("Server is running to port 5000")
})