import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js';
import { getFirestore, doc, getDoc  } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js'

let firebaseApp, db, auth; 

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

      let urLAtual = window.location.href;

      if(!user) {
          if (urLAtual.includes('frontend/jogo/jogo.html')) {
              window.location.href = "./../login.html"; 
          } else if (urLAtual.includes('frontend/selecionarEtapa.html')) {
              window.location.href = "./login.html"; 
          } else if(urLAtual.includes('frontend/controleAdmin.html')) {
              window.location.href = "./login.html"; 
          }
      
      } else if (user) {
          let verificarAdm = await consultarUser();

          if(urLAtual.includes('frontend/controleAdmin.html') && verificarAdm == false){
              window.location.href = "./login.html"; 
          }

      } 
  });
});

async function consultarUser() {
    let simAdmin = false;
  
    try {
      let user = auth.currentUser;
  
      if (user) {
        let userDocRef = doc(db, 'users', user.uid);
  
        let userSnapshot = await getDoc(userDocRef);
  
        if (userSnapshot.exists() && userSnapshot.data().admin == true) {
          simAdmin = true;
        }
      }
    } catch (error) {
      console.log("Erro ao consultar o usuário:", error);
    }
    return simAdmin;
  }