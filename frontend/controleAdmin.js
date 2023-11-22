import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';
import { mostrarNotificacao } from './jogo/modulos/popUps.js';
import { getAuth, signOut, onAuthStateChanged  } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js';

let firebaseApp, db, auth, userid;

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
            userid = user.uid;
        } else {
            userid = null; 
        }
    });
    consultarUsers();
    consultarSolicitacoes();
});

document.querySelector('#btnGerenciar').addEventListener('click', function () {
    document.querySelector('#containerGerenciar').style.display = "flex";
    document.querySelector('#containerSuporte').style.display = "none";
});

document.querySelector('#btnSuporte').addEventListener('click', function () {
    document.querySelector('#containerGerenciar').style.display = "none";
    document.querySelector('#containerSuporte').style.display = "block";
});

window.excluirUser = async function(userId) {
    let db = getFirestore(firebaseApp);
    let usuarioRef = doc(db, 'users', userId);

    await fetch('http://localhost:10000/excluirUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: userId, 
        }),
    })
    .then((response) => {
        if (response.ok) {
            mostrarNotificacao('Cadastro excluído!');
        } else {
            mostrarNotificacao(`Erro ao excluir o cadastro do usuário.`);
        }
    });

        tabelaUsers.innerHTML = '';
        consultarUsers(); 
        
    setTimeout(function() {
        window.location.href = "./controleAdmin.html";
      }, 2000);       
}

window.alterarUser = async function(userId, alterarButton) {
    let divRow = alterarButton.closest('.row');

    if (divRow) {
        let inputFields = divRow.querySelectorAll('input');

        if (alterarButton.src.includes('jogo/imagens/alterar.png')) {
            inputFields.forEach(input => {
                input.removeAttribute('readonly');
            });

            alterarButton.src = 'jogo/imagens/botaoConfirmar.png';
        } else if (alterarButton.src.includes('jogo/imagens/botaoConfirmar.png')) {
            let valoresDigitados = Array.from(inputFields).map(input => input.value);
            
            await fetch('http://localhost:10000/alterarUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    nome: valoresDigitados[0],
                    dataNascimento: valoresDigitados[1],
                    email: valoresDigitados[2],
                    guardarFase: valoresDigitados[3],
                    admin: valoresDigitados[4]
                }),
            })
            .then((response) => {
                if (response.ok) {
                    mostrarNotificacao('Cadastro atualizado!');
                } else {
                    mostrarNotificacao(`O e-mail informado já existe. Tente um outro.`);
                }
            })

            setTimeout(function() {
              window.location.href = "./controleAdmin.html";
            }, 2000);
        }
    }
}

async function consultarUsers(filtro = null, termo = '') {
    let db = getFirestore(firebaseApp);
    let tabelaUsers = document.querySelector('#tabelaUsers');

    try {
        let usersRef = collection(db, 'users');
        let querySnapshot = await getDocs(usersRef);

        tabelaUsers.innerHTML = '';

        let cabecalhoRow = document.createElement('div');
        cabecalhoRow.classList.add('row', 'table-header-row');
        cabecalhoRow.innerHTML = `
            <div class="col table-header" style="margin-left: 1.7vh;"> Nome</div>
            <div class="col table-header">Data de Nascimento</div>
            <div class="col table-header">E-mail</div>
            <div class="col table-header">Fase</div>
            <div class="col table-header">Admin</div>
            <div class="col table-header">Ações</div>
        `;
        tabelaUsers.appendChild(cabecalhoRow);

        querySnapshot.forEach((doc) => {
            let user = doc.data();
            let valorCampo = filtro ? (typeof user[filtro] === 'string' ? user[filtro].toLowerCase() : '') : '';

            if (termo === '' || valorCampo.includes(termo.toLowerCase())) {
                let divRow = document.createElement('div');
                divRow.classList.add('row');
                divRow.innerHTML = `
                    <div class="col"><input type="text" value="${user.nome.length > 30 ? user.nome.substring(0, 30) + '...' : user.nome}" class="table-input" readonly></div>
                    <div class="col"><input type="text" value="${user.dataNascimento || ' '}" class="table-input" readonly></div>
                    <div class="col"><input type="text" value="${user.email.length > 30 ? user.email.substring(0, 30) + '...' : user.email}" class="table-input" readonly></div>
                    <div class="col"><input type="text" value="${user.guardarFase}" class="table-input" readonly></div>
                    <div class="col"><input type="text" value="${user.admin}" class="table-input" readonly></div>
                    <div class="col">
                        <img src="jogo/imagens/alterar.png" id="btnAlterar-${doc.id}" class="btnAlterar" onclick="alterarUser('${doc.id}', this)" style="width: 20px; height: 20px;">
                        <img src="jogo/imagens/lixeira.png" class="btnExcluir" onclick="excluirUser('${doc.id}')" style="width: 20px; height: 20px;">
                    </div>
                `;

                tabelaUsers.appendChild(divRow);
            }
        });
    } catch (error) {
        mostrarNotificacao(error);
    }
}


async function consultarSolicitacoes(filtroStatus = 'Todos') {
    let containerFeed = document.querySelector('#containerFeed');
    try {
        
        let response = await fetch(`http://localhost:10000/suporte?status=${filtroStatus}`);

        if (response.ok) {
            let data = await response.json();
            let solicitacoes = data.solicitacoes || [];

            containerFeed.innerHTML = '';

            solicitacoes.forEach(solicitacao => {
                let divSolicitacao = document.createElement('div');
                divSolicitacao.classList.add('solicitacao');

                let colunaEsquerda = document.createElement('div');
                colunaEsquerda.classList.add('coluna', 'colunaEsquerda');
                colunaEsquerda.innerHTML = `
                    <div class="data">${solicitacao.data}</div>
                    <div class="status"><strong>Status:</strong> ${solicitacao.status}</div>
                `;
                divSolicitacao.appendChild(colunaEsquerda);

                let colunaMeio = document.createElement('div');
                colunaMeio.classList.add('coluna', 'colunaMeio');
                colunaMeio.innerHTML = `
                    <div class="email"><strong>E-mail:</strong> ${solicitacao.email.length > 25 ? solicitacao.email.substring(0, 25) + '...' : solicitacao.email}</div>
                    <div class="mensagem"><strong>Mensagem:</strong> ${solicitacao.mensagem.length > 25 ? ' ' + solicitacao.mensagem.substring(0, 25) + '...' : ' ' + solicitacao.mensagem}</div>
                `;
                divSolicitacao.appendChild(colunaMeio);

                let colunaDireita = document.createElement('div');
                colunaDireita.classList.add('coluna', 'colunaDireita');
                colunaDireita.innerHTML = `
                    <div class="botoes">
                        <img src="jogo/imagens/botaoAbrir.png" id="btnAbrir-${solicitacao.id}" class="btnAbrir" onclick="abrirSolic('${solicitacao.id}', this)" style="width: 20px; height: 20px;">
                        <img src="jogo/imagens/lixeira.png" class="btnExcluir" onclick="excluirSolic('${solicitacao.id}')" style="width: 20px; height: 20px;">
                    </div>
                `;
                divSolicitacao.appendChild(colunaDireita);

                containerFeed.appendChild(divSolicitacao);
            });
        } else {
            console.error('Erro ao obter solicitações de suporte:', response.statusText);
            mostrarNotificacao('Erro ao obter solicitações de suporte.');
        }
    } catch (error) {
        console.error('Erro ao obter solicitações de suporte:', error);
        mostrarNotificacao('Erro ao obter solicitações de suporte.');
    }
}

window.excluirSolic = async function(id) {
    try {
        let response = await fetch('http://localhost:10000/excluirSolicitacao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
            }),
        });

        if (response.ok) {
            mostrarNotificacao('Solicitação excluída com sucesso.');
            consultarSolicitacoes();
        } else {
            console.error('Erro ao excluir solicitação:', response.statusText);
            mostrarNotificacao('Erro ao excluir solicitação.');
        }
    } catch (error) {
        console.error('Erro ao excluir solicitação:', error);
        mostrarNotificacao('Erro ao excluir solicitação.');
    }
}


window.abrirSolic = async function(id, button) {
    let containerSolicitacao = document.querySelector('#containerSolicitacao');
    
    try {
        let response = await fetch(`http://localhost:10000/suporte/${id}`);
        
        if (response.ok) {
            let solicitacao = await response.json();
            
            containerSolicitacao.innerHTML = `
                <div class="detalhesSolicitacao">
                    <div class="detalheData"><strong>Data:</strong> ${solicitacao.data}</div>
                    <div class="detalheStatus"><strong>Status:</strong> ${solicitacao.status}</div>
                    <div class="detalheEmail"><strong>E-mail:</strong> ${solicitacao.email}</div>
                    <div class="detalheMensagem"><strong>Mensagem:</strong> ${solicitacao.mensagem}</div>
                    <div class="detalheMensagem"><strong>Resposta ADM:</strong> ${solicitacao.respostaAdmin}</div>

                    <div style="display: flex; align-items: center; margin-top: 30px;">
                        <textarea id="respSolicitacao" placeholder="Escreva aqui" style="width: 390px; height: 80px; font-size: 15px"></textarea>
                        <img src="jogo/imagens/botaoAbrir.png" id="btnEnviar" class="btnAbrir" onclick="enviarResposta('${solicitacao.id}', '${solicitacao.email}')" style="width: 20px; height: 20px;">
                    </div>
                </div>
            `;
            
            document.querySelectorAll('.solicitacao').forEach(item => {
                item.classList.remove('selected');
            });
            
            let divSolicitacao = button.closest('.solicitacao');
            divSolicitacao.classList.add('selected');
        } else {
            console.error('Erro ao obter detalhes da solicitação:', response.statusText);
            mostrarNotificacao('Erro ao obter detalhes da solicitação.');
        }
    } catch (error) {
        console.error('Erro ao obter detalhes da solicitação:', error);
        mostrarNotificacao('Erro ao obter detalhes da solicitação.');
    }
}

window.enviarResposta = async function(id, email) {
    let respSolicitacao = document.querySelector('#respSolicitacao').value;

    try {
        let response = await fetch('http://localhost:10000/responderSolicitacao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                respostaAdmin: respSolicitacao,
                email: email
            }),
        });

        if (response.ok) {
            mostrarNotificacao('Resposta enviada com sucesso.');
            consultarSolicitacoes();
            document.querySelector('#respSolicitacao').value = '';
        } else {
            mostrarNotificacao('Erro ao enviar resposta.');
        }
    } catch (error) {
        console.error('Erro ao enviar resposta:', error);
        mostrarNotificacao('Erro ao enviar resposta.');
    }
};


document.querySelector('#btnBuscarSuporte').addEventListener('click', function () {
    let filtroStatus = document.querySelector('#selectFiltroSuporte').value;
    consultarSolicitacoes(filtroStatus);
});
  

let selectFiltroGerenciar = document.querySelector('#selectFiltroGerenciar');
let inputBusca = document.querySelector('#inputBusca');

document.querySelector('#btnBuscarGerenciar').addEventListener('click', function () {
    let filtroSelecionado = selectFiltroGerenciar.value;
    let termoBusca = inputBusca.value;

    consultarUsers(filtroSelecionado, termoBusca, selectFiltroGerenciar, inputBusca);
});

document.querySelector('#btnSair').addEventListener('click', function () {
    signOut(auth).then(() => {
        window.location.href = "./login.html";
    }).catch(() => {
        mostrarNotificacao('Erro ao fazer logout');
    })
});

async function guardandoFase(numeroFase, userId){
    let userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      guardarFase: numeroFase
    });

    window.open("./jogo/jogo.html", '_blank');
}

document.querySelector('#btnConfirmar').addEventListener('click', function () {
    let select = document.querySelector('#selectFases');
    let valorOp = select.options[select.selectedIndex].value;

    if (valorOp == '1') {
        guardandoFase(1, userid);
    }else if (valorOp == '2') {
        guardandoFase(2, userid);
    }else if (valorOp == '3') {
        guardandoFase(3, userid);
    }else if (valorOp == '4') {
        guardandoFase(4, userid);
    }else if (valorOp == 'certificado') {
        obterCertificado();
    }else{
        mostrarNotificacao('Escolha uma opção valida!');
    }
});

async function obterCertificado(){
    await fetch('http://localhost:10000/obterCertificado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({
            userId: userid
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


