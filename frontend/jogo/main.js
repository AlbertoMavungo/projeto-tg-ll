import { atualizaFaseUm } from './modulos/faseUm.js';
import { atualizaFaseDois } from './modulos/faseDois.js';
import { atualizaFaseTres } from './modulos/faseTres.js';
import { atualizaFaseQuatro } from './modulos/faseQuatro.js';
import { playMusica } from './modulos/playMusica.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';
import { getAuth, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js';
import { mostrarNotificacao, exibirBalao } from './modulos/popUps.js';
import { mostrarPopUp } from './modulos/popUpsDois.js';
import { getFirestore, doc, updateDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';

let popUpApareceu = false;
let firebaseApp, db, auth; 
let userId, ultimaFaseSalva;
export let faseAtual;

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
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            userId = user.uid;
            faseAtual = await consultarFase(userId);
        } else {
            userId = null;
        }
    });
});

function escolhaFase() {
    if(userId != null){
        if (ultimaFaseSalva != faseAtual && faseAtual != null && faseAtual != undefined) {
            guardandoFase(faseAtual, userId);
            ultimaFaseSalva = faseAtual;

            mostrarPopUp('Inicio');
            
            document.querySelector("#textarea").value = 'Escreva suas respostas aqui...';
            document.querySelector("#textarea").style.color = '#525252'
        }
        
        switch(faseAtual){
            case 1:
                faseAtual = atualizaFaseUm();
                break;
            case 2:
                faseAtual = atualizaFaseDois();
                break;
            case 3:
                faseAtual = atualizaFaseTres();
                break;
            case 4:
                faseAtual = atualizaFaseQuatro();
                break;
            case 'Certificado':
                atualizaCertificado();
                break;
        }
    }
}

async function guardandoFase(numeroFase, userId) {
    let userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
        guardarFase: numeroFase
    });
}


async function consultarFase(userId) {
    let userDocRef = doc(db, 'users', userId);
    let userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
        let userData = userDocSnap.data();
        if (userData && userData.guardarFase !== undefined) {
            return userData.guardarFase;
        } 
    } 
}

let fundoPlayerRect = document.querySelector('#fundoPlayer').getBoundingClientRect();
let xBPlayer = fundoPlayerRect.left;
let yBPlayer = fundoPlayerRect.top;

exibirBalao('Ajuste o volume aqui', xBPlayer, yBPlayer+50, 'top');

let btnSairRect = document.querySelector('#btnSair').getBoundingClientRect();
let xBSaida = btnSairRect.left;
let yBSaida = btnSairRect.top;

exibirBalao('Botão para sair', xBSaida-20, yBSaida-70, 'bottom');


function limparTextarea() {
    document.querySelector("#textarea").value = '';
    document.querySelector("#textarea").style.color = 'black';
    document.querySelector("#textarea").removeEventListener("click", limparTextarea);
}

document.querySelector("#textarea").addEventListener("click", limparTextarea);


function loop() {
    escolhaFase();
    window.requestAnimationFrame(loop);
}


document.querySelector('#btnSair').addEventListener('click', function () {
    let auth = getAuth();
    signOut(auth).then(() => {
        window.location.href = "./../login.html";
    }).catch(() => {
        mostrarNotificacao('Erro ao fazer logout');
    })
});

async function obterCertificado(){
    await fetch('http://localhost:10000/obterCertificado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({
            userId: userId
        }),
    })
    .then((response) => {
        if (response.ok) {
            mostrarNotificacao('Certificado baixado com sucesso.');
        } else {
            mostrarNotificacao(`Erro ao baixar certificado.`);
        }
    });
}

function atualizaCertificado(){
    if(popUpApareceu == false){
        document.querySelector("#myCanvas").style.display = 'none';
        document.querySelector("#boxCode").style.display = 'none';
        document.querySelector("#btnVoltarInicio").style.display = 'block';

        mostrarPopUp('Certificado');
        popUpApareceu = true;
    }
}

document.querySelector("#btnConfirmarPopUp").addEventListener('click', () => {
    playMusica();

    if(faseAtual == 'Certificado'){
        obterCertificado();
    }
});

loop();



