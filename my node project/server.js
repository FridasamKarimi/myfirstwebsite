const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Create a database connection
const db = new sqlite3.Database('mydatabase.db');

// Create a table (if it doesn't exist)
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)');
});

// Handle root URL - Serve the 'index.html' file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/submit', express.urlencoded({ extended: true }), (req, res) => {
    const { name, email } = req.body;
    db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(`New user added: ${name}, ${email}`);
        res.redirect('/');
    });
});
// Route to display database content
app.get('/database', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            return res.status(500).send('Error retrieving data');
        }
        // Render a template (e.g., 'database.ejs') passing the data to display
        res.send(`
            <h1>Database Content</h1>
            <ul>
                ${rows.map(row => `<li>${row.name} - ${row.email}</li>`).join('')}
            </ul>
        `);
    });
});

// ... (rest of your code)

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

