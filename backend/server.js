const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Connect frontend pages
app.use(express.static(path.join(__dirname, "../frontend")));

// Home API
app.get("/api", (req, res) => {
    res.send("Blood Donation System Backend Running!");
});

// Get all donors
app.get("/api/donors", (req, res) => {
    db.query("SELECT * FROM donors", (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});

// Donor Registration
app.post("/api/donors", (req, res) => {

    const {
        name, age, gender,
        blood_group, phone, city
    } = req.body;

    if (!name || !age || !blood_group || !phone || !city) {
        return res.status(400).json({
            message: "Please fill all required fields"
        });
    }

    if (Number(age) < 18 || Number(age) > 65) {
        return res.status(400).json({
            message: "Age must be between 18 and 65"
        });
    }

    const sql = `INSERT INTO donors
    (name, age, gender, blood_group, phone, city)
    VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
        name, age, gender,
        blood_group, phone, city
    ], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(201).json({
            message: "Donor registered successfully",
            id: result.insertId
        });
    });
});

// Blood Request
app.post("/api/requests", (req, res) => {

    const {
        patient_name, blood_group, units,
        hospital, city, phone, emergency
    } = req.body;

    if (!patient_name || !blood_group ||
        !units || !city || !phone) {

        return res.status(400).json({
            message: "Please fill all required fields"
        });
    }

    const sql = `INSERT INTO blood_requests
    (patient_name, blood_group, units,
    hospital, city, phone, emergency)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
        patient_name, blood_group, units,
        hospital, city, phone, emergency ? 1 : 0
    ], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(201).json({
            message: "Blood request submitted successfully",
            id: result.insertId
        });
    });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});