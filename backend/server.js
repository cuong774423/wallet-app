import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'game_scores',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Đã kết nối với database');
});

app.post('/create-account', (req, res) => {
    const { wallet_address } = req.body;

    if (!wallet_address) {
        return res.status(400).send('Wallet address is required');
    }

    const checkQuery = `SELECT * FROM score WHERE wallet_address = ?`;
    db.query(checkQuery, [wallet_address], (err, results) => {
        if (err) return res.status(500).send('Database error');

        if (results.length === 0) {
            const insertQuery = `INSERT INTO score (wallet_address, total_score) VALUES (?, 0)`;
            db.query(insertQuery, [wallet_address], (err) => {
                if (err) return res.status(500).send('Database error');
                res.status(201).send('Account created successfully');
            });
        } else {
            res.status(200).send({ message: 'Account already exists', user: results[0] });
        }
    });
});

app.post('/update-score', (req, res) => {
    const { wallet_address, score } = req.body;

    if (!wallet_address || score === undefined) {
        return res.status(400).send('Wallet address and score are required');
    }

    const checkQuery = `SELECT * FROM score WHERE wallet_address = ?`;
    db.query(checkQuery, [wallet_address], (err, results) => {
        if (err) return res.status(500).send('Database error');

        if (results.length > 0) {
            const currentScore = results[0].total_score;
            const newScore = currentScore + score; 
            const updateQuery = `
                UPDATE score 
                SET total_score = ? 
                WHERE wallet_address = ?;
            `;
            db.query(updateQuery, [newScore, wallet_address], (err) => {
                if (err) return res.status(500).send('Database error');
                res.send('Score updated successfully');
            });
        } else {
            const insertQuery = `
                INSERT INTO score (wallet_address, total_score) 
                VALUES (?, ?);
            `;
            db.query(insertQuery, [wallet_address, score], (err) => {
                if (err) return res.status(500).send('Database error');
                res.send('Account created and score added');
            });
        }
    });
});

app.get('/get-score/:wallet_address', (req, res) => {
    const { wallet_address } = req.params;

    const query = `SELECT total_score FROM score WHERE wallet_address = ?`;
    db.query(query, [wallet_address], (err, results) => {
        if (err) return res.status(500).send('Database error');
        if (results.length === 0) return res.status(404).send('No score found');
        res.json({ total_score: results[0].total_score });
    });
});


app.post('/reset-score', (req, res) => {
    const { wallet_address } = req.body;

    if (!wallet_address) {
        return res.status(400).send('Wallet address is required');
    }

    const resetQuery = `UPDATE score SET total_score = 0 WHERE wallet_address = ?`;
    db.query(resetQuery, [wallet_address], (err) => {
        if (err) return res.status(500).send('Database error');
        res.send('Score reset successfully');
    });
});


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
