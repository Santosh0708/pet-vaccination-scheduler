const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "santosh"
});

// Test database connection
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.stack);
        return;
    }
    console.log("Connected to MySQL database.");
});

// GET all pets
app.get('/', (req, res) => {
    const sql = "SELECT * FROM pets";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Database Error: ", err);
            return res.status(500).json({ message: "Error retrieving pets", error: err });
        }
        return res.json(data);
    });
});

// CREATE a new pet
app.post('/create', (req, res) => {
    const sql = "INSERT INTO pets (name, species, breed, owner) VALUES (?)";
    const values = [
        req.body.name,
        req.body.species,
        req.body.breed,
        req.body.owner
    ];
    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error("Database Error: ", err);
            return res.status(500).json({ message: "Failed to create pet record", error: err });
        }
        return res.status(201).json({ message: "Pet created successfully", id: data.insertId });
    });
});
app.put('/update/:id', (req, res) => {
    const sql = "UPDATE pets set `name`= ?, `species`=?,`breed`=?,`owner`=?";
    const id = req.params.id;
    const values = [
        req.body.name,
        req.body.species,
        req.body.breed,
        req.body.owner
    ];
    db.query(sql, [...values, id], (err, data) => {
        if (err) {
            console.error("Database Error: ", err);
            return res.status(500).json({ message: "Failed to create pet record", error: err });
        }
        return res.status(201).json({ message: "update successfully", id: data.insertId });
    });
});

app.delete('/delete/:id', (req, res) => {
    const sql = "DELETE FROM pets WHERE id =?";
    const id = req.params.id;
   
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error("Database Error: ", err);
            return res.status(500).json({ message: "Failed to create pet record", error: err });
        }
        return res.status(201).json({ message: "delete successfully", id: data.insertId });
    });
});


// Start the server
app.listen(8081, () => {
    console.log("Server listening on port 8081...");
});
