import { mostrarNotificacao } from './jogo/modulos/popUps.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js';
import { getFirestore  } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js'

let firebaseApp, db, auth; 

async function initializeFirebase() {
  try {
    let response = await fetch('https://projeto-tg-ll-vu9k.vercel.app/firebaseConfig');
    let firebaseConfig = await response.json();

    firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp);
    auth = getAuth();

  } catch (error) {
    console.error('Erro ao obter configuração do Firebase:', error);
  }
}
initializeFirebase();

document.querySelector('#btnEntrar').addEventListener('click', function () {
  let btnEmail = document.querySelector('#btnEmail').value;
  let btnSenha = document.querySelector('#btnSenha').value;

  if (btnEmail == '' || btnSenha == '') {
    mostrarNotificacao('Insira o seu e-mail/senha OU entre com o Google.');
  } else {
    signInWithEmailAndPassword(auth, btnEmail, btnSenha)
      .then(async () => {
        let user = auth.currentUser;
        if (user) {
          return user.getIdToken();
        } else {
          mostrarNotificacao('Falha na autenticação');
        }
      })
      .then(idToken => {
        if (idToken) {
          fetch('https://projeto-tg-ll-vu9k.vercel.app', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
          })
            .then(response => response.json())
            .then(dado => {
              if (dado.auth) {
                if(dado.verificarAdmin == true){
                  window.location.href = "./controleAdmin.html";
                }else{
                  window.location.href = "./selecionarEtapa.html";
                }
              } else {
                mostrarNotificacao('Falha na autenticação');
              }
            })
            .catch(error => {
              mensagemErro(error.code);
            });
        }
      })
      .catch(error => {
        mensagemErro(error.code);
      });
  }
});

function mensagemErro(error){
  if (error == "auth/user-not-found") {
    mostrarNotificacao('Usuario não encontrado.');
  } else if (error == "auth/wrong-password") {
    mostrarNotificacao('Senha incorreta.');
  } else if (error == "auth/invalid-email") {
    mostrarNotificacao('E-mail inválido.');
  }else{
    mostrarNotificacao('Falha na autenticação.');
  }
}


document.querySelector("#olhoIcon").addEventListener("click", function () {
  let btnSenha = document.querySelector("#btnSenha");
  let icon = document.querySelector("#olhoIcon");

  if (btnSenha.type === "password") {
    btnSenha.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    btnSenha.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
});


document.querySelector('#btnLoginGoogle').addEventListener('click', function () {
  let provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then(async (result) => {
      let user = result.user;
      let idToken = await user.getIdToken();
      
      fetch('https://projeto-tg-ll-vu9k.vercel.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          idToken,
          nome: user.displayName, 
          email: user.email
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.auth) {
          if (data.verificarAdmin) {
            window.location.href = "./controleAdmin.html";
          } else {
            window.location.href = "./selecionarEtapa.html";
          }
        } else {
          mostrarNotificacao('Falha na autenticação com o Google');
        }
      })
      .catch(error => {
        console.error(error);
        mostrarNotificacao('Erro ao autenticar com o Google');
      });
    })
    .catch(error => {
      console.error(error);
      mostrarNotificacao('Erro ao autenticar com o Google');
    });
});

document.addEventListener('DOMContentLoaded', function(){
  let urLAtual = window.location.href;
  if (urLAtual.includes('frontend/login.html?exclusao=sim')){
    setTimeout(function() {
     mostrarNotificacao ('Cadastro excluido com sucesso.');
    },3000)
  }
});

