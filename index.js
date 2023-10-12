import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const db = mysql.createConnection({
    host: 'app-db.cpinycsnk7ay.eu-central-1.rds.amazonaws.com',
    user: 'admin',
    port: '3306',
    password: 'soloma210596',
    database: 'AppData'
});

app.use(express.json());
app.use(cors());



// Ändern des MySQL-Benutzerpassworts
// Dies sollte einmal ausgeführt werden, um das Passwort zu ändern.
//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456789'

db.connect((err) => {
    if(err){
        console.log(err);
    }
    console.log('Mysql connected');
});

app.get('/', (req, res) => {
    res.json('Hello World');
});

app.post('/api/login', (req, res) => {
    const { uname, pass } = req.body;

    // Überprüfen, ob der Benutzer in der Datenbank existiert
    const userQuery = 'SELECT * FROM user WHERE uname = ? AND pass = ?';
    db.query(userQuery, [uname, pass], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else {
            if (results.length === 1) {
                // Der Benutzer existiert, daher können wir den Token signieren und senden
                const user = { uname, pass };

                jwt.sign({ user }, 'secret_key', { expiresIn: '1h' }, (err, token) => {
                    if (err) {
                        res.status(500).json({ error: 'Failed to generate token' });
                    } else {
                        // Senden des JWT als Antwort
                        res.json({ token });
                    }
                });
            } else {
                // Der Benutzer existiert nicht
                res.status(401).json({ error: 'Invalid credentials' });
            }
        }
    });
});

app.get('/api/user', (req, res) => {
    const q = 'SELECT * FROM user';
    db.query(q, (err, result) => {
        if(err) return res.json(err);
        return res.json(result);
    });
});
app.get('/api/user:id', (req, res) => {
    const q = 'SELECT * FROM user WHERE id = ?';
    db.query(q, [req.params['id']], (err, result) => {
        if(err) return res.json(err);
        return res.json(result);
    });
});
app.get('/api/user:username', (req, res) => {
    const q = 'SELECT * FROM user WHERE email = ? AND password = ?';
    db.query(q, [req.params['email'], req.params['pass']], (err, result) => {
        if(err) return res.json(err);
        return res.json(result);
    });
});
app.get('/api/item', (req, res) => {
    const q = 'SELECT * FROM item';
    db.query(q, (err, result) => {
        if(err) return res.json(err);
        return res.json(result);
    });
});
app.get('/api/item:id', (req, res) => {
    const q = 'SELECT * FROM item WHERE id = ?';
    db.query(q, [req.params['id']], (err, result) => {
        if(err) return res.json(err);
        return res.json(result);
    });
});
app.get('/api/box', (req, res) => {
    const q = 'SELECT * FROM box';
    db.query(q, (err, result) => {
        if(err) return res.json(err);
        return res.json(result);
    });
});
app.get('/api/box:id', (req, res) => {
    const q = 'SELECT * FROM box WHERE id = ?';
    db.query(q, [req.params['id']], (err, result) => {
        if(err) return res.json(err);
        return res.json(result);
    });
});

app.get('/api/box_has_item', (req,res) => {
    const q = 'SELECT * FROM box_has_item';
    db.query(q,(err, result) => {
        if(err) return res.json(err);
        return res.json(result);
    });
});

app.get('/api/timestamps', (req , res) => {
    const q = 'SELECT * FROM timestamps';
    db.query(q,(err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
});

app.post('/api/user', (req, res) => {
    const q = 'INSERT INTO user (lastname, firstname, birthdate, uname, pass, email) VALUES (?)';
    const values = [
        req.body.lastname,
        req.body.firstname,
        req.body.birthdate,
        req.body.uname,
        req.body.pass,
        req.body.email];
    db.query(q, [values], (err, result) => {
        if(err) return res.json(err);
        return res.json("User added succesfully.");
    });

});
app.post('/api/item', (req, res) => {
    const q = 'INSERT INTO item (id, props) VALUES (?)';
    const values = [
        req.body.id,
        req.body.props];
    db.query(q, [values], (err, result) => {
        if(err) return res.json(err);
        return res.json("Item added succesfully.");
    });

});

app.post('/api/box', (req, res) => {
    const q = 'INSERT INTO box (id, name, user_id) VALUES (?)';
    const values = [
        req.body.id,
        req.body.name,
        req.body.user_id];
    db.query(q, [values], (err, result) => {
        if(err) return res.json(err);
        return res.json("Box added succesfully.");
    });
});

app.post('/api/box_has_item', (req, res) => {
    const q = 'INSERT INTO box_has_item (box_id, box_user_id, item_item_id) VALUES (?)';
    const values = [
        req.body.box_id,
        rq.body.box_user_id,
        req.body.item_item_id];
    db.query(q, [values], (err, result) => {
        if(err) return res.json(err);
        return res.json("Box_has_item added succesfully.");
    });
});
app.post('/api/timestamps', (req,res) => {
    const q = 'INSERT INTO timestamps (user_id) VALUES (?)';
    const values = [
        req.body.user_id];
});

app.listen(5000, () =>{
    console.log('Server running on port 5000');
});