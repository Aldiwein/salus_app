const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb+srv://aldiwein:2DhHAkvVgXPnLiMf@salus.l4oqyyw.mongodb.net/salus', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

const app = express();
app.use(express.json());

app.post('/register', async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send({ message: 'Ein Benutzer mit dieser E-Mail-Adresse existiert bereits.' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });

    await user.save();
    res.send({ message: 'Registrierung erfolgreich! Sie können sich jetzt anmelden.' });
});

app.post('/login', async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send({ message: 'Die E-Mail-Adresse oder das Passwort ist falsch.' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send({ message: 'Die E-Mail-Adresse oder das Passwort ist falsch.' });
    }

    res.send({ message: 'Anmeldung erfolgreich!' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
