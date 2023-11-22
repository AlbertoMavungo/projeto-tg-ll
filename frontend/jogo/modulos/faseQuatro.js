import { cronometro, desenharCronometro } from './cronometro.js';
import { atualizarVida } from './vida.js';
import { atualizarCode, atualizarBug} from './personagem.js';
import { mostrarPopUp } from './popUpsDois.js';
import { faseAtual } from './../main.js';
import { mostrarNotificacao } from './popUps.js';

let global = {};
let personagemCode = {};
let personagemBug = {};

global.canvas = document.querySelector("#myCanvas");
global.ctx = global.canvas.getContext("2d");
global.canvas.width = 860;
global.canvas.height = 380;

function resetar() {
  global.itemX = 860;
  global.itemY = 335;
  global.tempoAcabou = false;
  personagemCode.vidaStatus = 3;
  personagemCode.x = 50;
  personagemCode.y = 200;
  personagemCode.ativarAcoes = false;
  personagemCode.andando = false; 

  personagemBug.x = 600;
  personagemBug.y = 100;
  personagemBug.andando = false;
  personagemBug.direcao = 'esquerda'; 
  personagemBug.velocidade = 1.3;

  global.btnGanhouConfirmado = false;
}

function desenharCenario() {
  let cenarioImage = new Image();
  cenarioImage.src = "imagens/cenarioFaseQuatro.png";

  let proporcao = 2.2;
  let novaLargura = global.canvas.width;
  let novaAltura = novaLargura / proporcao;

  global.ctx.drawImage(cenarioImage, 0, 0, novaLargura, novaAltura);
}


export function atualizaFaseQuatro() {
  if (personagemCode.vidaStatus > 0 && global.btnGanhouConfirmado == false && 
    global.tempoAcabou == false && personagemBug.andando == true &&
    (personagemCode.x >= 114 && personagemCode.y >= 11) &&
    (personagemCode.x <= 160 && personagemCode.y <= 20)) {
    mostrarPopUp("Você ganhou!");
    personagemCode.andando = false;
  }else if (global.btnGanhouConfirmado == true) {
    return 'Certificado';
  }else if (personagemCode.vidaStatus > 0 && global.tempoAcabou == false) {
    desenha();
  }else if (personagemCode.vidaStatus == 0 || global.tempoAcabou == true) {
    mostrarPopUp("Você perdeu!");
    resetar();
  }

  return 4;
}

function desenha() {
  document.querySelector('#boxCode').style.display = "block";
  global.ctx.clearRect(0, 0, global.canvas.width, global.canvas.height);
  desenharCenario();
  desenharCronometro(760, 28);
  atualizarVida(personagemCode.vidaStatus);
  atualizarCode(personagemCode.status, personagemCode.x, personagemCode.y);

  if (personagemBug.andando == true) {
    atualizarBug(personagemBug.direcao, personagemBug.x, personagemBug.y);
    if (personagemBug.direcao == 'esquerda') {
      personagemBug.x -= personagemBug.velocidade;
      if (personagemBug.x <= 100) {
        personagemBug.direcao = 'direita';
      }
    } else {
      personagemBug.x += personagemBug.velocidade;
      if (personagemBug.x >= 650) {
        personagemBug.direcao = 'esquerda';
      }
    }

    if(personagemCode.x >= personagemBug.x-75 && personagemCode.y >= personagemBug.y-5 &&
      personagemCode.x <= personagemBug.x+1 && personagemCode.y <= personagemBug.y+25){
        mostrarNotificacao("O personagem Bug encostou em você! Perca uma vida.");
        personagemCode.x = 530;
        personagemCode.y = 200;
        personagemCode.vidaStatus -= 1;
    }
  }

  if ((personagemBug.andando == false) &&
    (personagemCode.x >= 530 && personagemCode.y >= 200) && 
    (personagemCode.x <= 570 && personagemCode.y <= 220)){
    mostrarPopUp("Continuar");
    personagemBug.andando = true; 
    personagemCode.andando = false;
  }else if ((personagemBug.andando == false) && (personagemCode.x >= 114 && personagemCode.y >= 11) &&
  (personagemCode.x <= 160 && personagemCode.y <= 20)){
    mostrarNotificacao("Chegue na bandeira amarela primeiro!");
    personagemCode.y = 21;
  }
}


document.querySelector("#btnPlay").addEventListener("click", function () {  
  if (faseAtual == 4) {
    let textoBoxCode = document.querySelector("#textarea").value;

    let regex = /enquanto\s*\((\w+)\s*<\s*(\d+)\)\s*faca\s*(\w+)\s*\+\+/;
    let match = textoBoxCode.match(regex);
  
    if (match) {
      let direcao = match[1];
      let quantidade = parseInt(match[2]);
   
      if (direcao == 'esquerda' || direcao == 'direita' || direcao == 'cima' || direcao == 'baixo') {
        if (personagemCode.x >= 13 && personagemCode.x <= 735 && personagemCode.y >= 10 && personagemCode.y <= 255) {
          moverPersonagemCode(direcao, quantidade);  
        } else {
          personagemCode.andando = false;
          if(personagemCode.x <= 13){
            personagemCode.x = 14;
          }else if(personagemCode.x >= 735){
            personagemCode.x = 734;
          }else if(personagemCode.y <= 10){
            personagemCode.y = 11;
          }else if(personagemCode.y >= 255){
            personagemCode.y = 254;
          }
        }
      }
    } else {
      personagemCode.vidaStatus -=1;
    }
  }
});

async function moverPersonagemCode(direcao, quantidade) {
  personagemCode.andando = true;
  let passosDados = 0;

  async function moverPassoPersonagemCode() {
    while (personagemCode.andando == true && passosDados < quantidade) {
      if (personagemCode.x >= 13 && personagemCode.x <= 735 && personagemCode.y >= 10 && personagemCode.y <= 255) {
        if (direcao == 'esquerda') {
          personagemCode.x -= quantidade;
        } else if (direcao == 'direita') {
          personagemCode.x += quantidade; 
        } else if (direcao == 'cima') {
          personagemCode.y -= quantidade;
        } else if (direcao == 'baixo') {
          personagemCode.y += quantidade;
        }
        
        passosDados++;
        await delay(200);
      }else{
        personagemCode.andando = false;
      }
    }
    personagemCode.andando = false;
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  moverPassoPersonagemCode();
}


document.querySelector("#btnConfirmarPopUp").addEventListener('click', () => {
  if (document.querySelector("#btnConfirmarPopUp").textContent == "Começar" && faseAtual == 4) {
    resetar();
    global.comecarFase = true;
    $('#popUp').modal('hide');
    cronometro(7, 1, () => {
      global.tempoAcabou = true;
    });
  } else if (document.querySelector("#btnConfirmarPopUp").textContent == "Ir para a próxima fase" && faseAtual == 4) {
    global.btnGanhouConfirmado = true;
  } else if (document.querySelector("#btnConfirmarPopUp").textContent == "Refazer" && faseAtual == 4) {
    resetar();
    global.comecarFase = true;
    $('#popUp').modal('hide');
    cronometro(7, 1, () => {
      global.tempoAcabou = true;
    });
  }else if (document.querySelector("#btnConfirmarPopUp").textContent == "Continuar" && faseAtual == 4){
    $('#popUp').modal('hide');
    $('.modal-backdrop').remove();
  }
});

resetar();
