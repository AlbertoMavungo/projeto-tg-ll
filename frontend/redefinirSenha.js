import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';
import { getAuth, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js';
import { mostrarNotificacao } from './jogo/modulos/popUps.js';


let firebaseApp, auth; 

async function initializeFirebase() {
  try {
    let response = await fetch('http://localhost:10000/firebaseConfig');
    let firebaseConfig = await response.json();

    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth();

  } catch (error) {
    console.error('Erro ao obter configuração do Firebase:', error);
  }
}
initializeFirebase();

document.querySelector('#btnRedefinirSenha').addEventListener('click', function () {
     
    let email = document.querySelector('#btnEmail').value;
    
    sendPasswordResetEmail(auth, email)
      .then(() => {
        mostrarNotificacao('E-mail enviado com sucesso!');
      })
      .catch(() => {
        mostrarNotificacao('E-mail não cadastrado!');
      });
});