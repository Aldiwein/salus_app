document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.token) {
        localStorage.setItem('token', data.token);  // Speichern Sie den Token
        alert('Sie sind jetzt angemeldet!');
    } else {
        alert(data.message);
    }
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
