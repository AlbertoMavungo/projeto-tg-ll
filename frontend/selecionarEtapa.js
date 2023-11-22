import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';
import { getAuth, signOut, onAuthStateChanged  } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js';
import { getFirestore, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';
import { mostrarNotificacao } from './jogo/modulos/popUps.js';

let global = {}; 
let firebaseApp, db, auth, userId;

async function initializeFirebase() {
  try {
    let response = await fetch('http://localhost:10000/firebaseConfig');
    let firebaseConfig = await response.json();

    firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp);
    auth = getAuth();

  } catch (error) {
    console.error('Erro ao obter configuração do Firebase:', error);
  }
}

initializeFirebase().then(() => {  
    onAuthStateChanged(auth, (user) => {
        if (user) {
            userId = user.uid;
        } else {
            userId = null; 
        }
    });
});

global.opIniciante = document.querySelector("#opIniciante");
global.opIntermediario = document.querySelector("#opIntermediario");
global.opAvancado = document.querySelector("#opAvancado");

global.opIniciante.addEventListener("click", function() {
    guardandoFase(1, userId);
});
global.opIntermediario.addEventListener("click", function() {
    guardandoFase(3, userId);
});
global.opAvancado.addEventListener("click", function() {
    guardandoFase(4, userId);
});


async function guardandoFase(numeroFase, userId){
    let userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      guardarFase: numeroFase
    });
    window.location.href = "./jogo/jogo.html";
}


document.querySelector('#btnSair').addEventListener('click', function () {
    signOut(auth).then(() => {
        window.location.href = "./login.html";
    }).catch(() => {
        mostrarNotificacao('Erro ao fazer logout');
    })
});

let popupexcluirConta = document.getElementById("popupexcluirConta");
let btnSim = document.getElementById("btnSim");
let btnNao = document.getElementById("btnNao");
let btnExcluirConta = document.getElementById("btnExcluirConta");

function showPopup() {
  popupexcluirConta.style.display = "flex";
}

function hidePopup() {
  popupexcluirConta.style.display = "none";
}

btnNao.addEventListener("click", hidePopup);

btnExcluirConta.addEventListener("click", showPopup);

btnSim.addEventListener("click", async function() {        
    try {
        let db = getFirestore(firebaseApp);
        let user = auth.currentUser;         
        let userDocRef = doc(db, 'users', user.uid);
        await deleteDoc(userDocRef);

        await user.delete() 
        window.location.href = "./login.html?exclusao=sim"; 

    } catch(error){
        if (error.code === "auth/requires-recent-login"){
            mostrarNotificacao('Devido a questões de segurança, você será redirecionado para a tela de login. Faça o login novamente para concluir esta ação.');
            setTimeout(function() {
                signOut(auth);
            }, 5000);
        }else{
            mostrarNotificacao('Erro ao excluir a conta: ' + error.code);
        }
    }  
    hidePopup(); 
});

