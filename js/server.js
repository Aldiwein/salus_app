const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User', userSchema);

const app = express();

app.use(express.json());  // JSON-Daten aus POST-Anfragen verarbeiten

app.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(400).send({ message: 'E-Mail oder Passwort ist falsch' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
        return res.status(400).send({ message: 'E-Mail oder Passwort ist falsch' });
    }

    const token = jwt.sign({ _id: user._id }, 'secretkey');  // Ersetzen Sie 'secretkey' durch Ihren eigenen geheimen Schlüssel

    res.send({ token });
});

app.post('/register', async (req, res) => {
    // Überprüfen Sie, ob ein Benutzer mit der gleichen E-Mail-Adresse bereits existiert
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send({ message: 'Ein Benutzer mit dieser E-Mail-Adresse existiert bereits' });
    }

    // Hashen Sie das Passwort, bevor Sie es in der Datenbank speichern
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });

    await user.save();
    res.send({ message: 'Registrierung erfolgreich! Sie können sich jetzt anmelden.' });
});

mongoose.connect('mongodb://localhost/salus', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});


app.listen(3000, () => console.log('Server läuft auf Port 3000'));
