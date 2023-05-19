// Wählen Sie zunächst das Formular und den Button aus
const registerForm = document.querySelector('#registerForm');
const registerButton = document.querySelector('#registerButton');

registerButton.addEventListener('click', (event) => {
  // Verhindern Sie die standardmäßige Formularübermittlung
  event.preventDefault();

  // Sammeln Sie die Benutzereingaben aus dem Formular
  const email = registerForm.email.value;
  const password = registerForm.password.value;
  const name = registerForm.name.value;

  // Senden Sie die Benutzereingaben an den Server
  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, name }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Registrierung erfolgreich! Sie können sich jetzt anmelden.') {
        // Weiterleitung zum Login bei erfolgreicher Registrierung
        window.location.href = "../content/login.html";
      } else {
        // Anzeige einer Fehlermeldung bei einem Fehler
        alert(data.message);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});
