const express = require("express");
const cors = require("cors");
const connectDB = require("../MongoDb/db_connection");
const Patient = require("../Models/Patient");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

app.post("/verify", async (req, res) => {
  try {
    const { idNumber } = req.body;
    

    if (!idNumber) {
      return res
        .status(200)
        .json({ success: false, message: "Missing ID Number" });
    }

    const patient = await Patient.findOne({id_number: idNumber});

    if (!patient) {
      return res
        .status(200)
        .json({ success:false, message: "Patient not found" });
    }

    res.status(200).json({ success: true, message:"Patient found", patient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(8005, () => console.log("Server running on port 8005"));
