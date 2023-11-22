import { atualizarVida } from './vida.js';
import { atualizarCode } from './personagem.js';
import { mostrarPopUp } from './popUpsDois.js';
import { faseAtual } from './../main.js'

let global = {}; 
let personagemCode = {};

global.canvas = document.querySelector("#myCanvas");
global.ctx = global.canvas.getContext("2d");
global.canvas.width = 860; 
global.canvas.height = 380; 

function resetar(){
  global.partidaAtual = 0;
  global.ordemDosItens = sortearNumerosSemRepeticao(9);
  global.partidaAtual = 0;
  global.itemX = 860;
  global.itemY = 335;

  personagemCode.vidaStatus = 3;
  personagemCode.x = 50;
  personagemCode.y = 280;
  personagemCode.ativarAcoes = false;
  personagemCode.status = 'cima';
  personagemCode.pulando = false;
  personagemCode.alturaPulo = 100;
  personagemCode.duracaoPulo = 1000; 

  global.btnGanhouConfirmado = false;
}
function sortearNumerosSemRepeticao(quantidade) {
  let numerosSorteados = [];

  while (numerosSorteados.length < quantidade) {
    let numeroAleatorio = Math.floor(Math.random() * quantidade) + 1;

    if (!numerosSorteados.includes(numeroAleatorio)) {
      numerosSorteados.push(numeroAleatorio);
    }
  }

  return numerosSorteados;
}
function desenharItem(recorteXInicial, recorteYInicial, recorteXFinal, recorteYFinal, x, y) {
  global.novaLarguraItem, global.novaAlturaItem;

  let itemImage = new Image();
  itemImage.src = "imagens/letras.png";

  let proporcao = 0.7; 
  global.novaLarguraItem = recorteXFinal * proporcao;
  global.novaAlturaItem = recorteYFinal * proporcao;

  global.ctx.drawImage(itemImage, recorteXInicial, recorteYInicial, recorteXFinal, recorteYFinal, x, y, global.novaLarguraItem, global.novaAlturaItem);
}


global.cenarioX = 0;
global.numCopiasCenario = 3;

function desenharCenario() {
  let cenarioImage = new Image();
  cenarioImage.src = "imagens/cenarioFaseDois.png";

  let proporcao = 2.5;
  let novaLargura = global.canvas.width + 100;
  let novaAltura = novaLargura / proporcao;

  if (personagemCode.ativarAcoes == true) {
    global.cenarioX -= 0.02;

    if (global.cenarioX <= -novaLargura) {
      global.cenarioX = 0;
    }
  }

  global.ctx.clearRect(0, 0, global.canvas.width, global.canvas.height);

  for (let i = 0; i < global.numCopiasCenario; i++) {
    global.ctx.drawImage(cenarioImage, 0, 0, cenarioImage.width, cenarioImage.height, 
      global.cenarioX + i * novaLargura, (global.canvas.height - novaAltura) / 2, 
      novaLargura, novaAltura);
  }
  requestAnimationFrame(desenharCenario);
}


export function atualizaFaseDois() {
  if (personagemCode.vidaStatus > 0 &&  global.partidaAtual < 10) {
    desenha();
  } else if (personagemCode.vidaStatus == 0 && global.partidaAtual != 10) {
    mostrarPopUp("Você perdeu!");
    resetar();
  } else if (personagemCode.vidaStatus > 0 &&  global.partidaAtual == 10 && global.btnGanhouConfirmado == false) {
    mostrarPopUp("Você ganhou!");
  }else if(global.btnGanhouConfirmado == true){
    return 3;
  }
  return 2;
}

function desenha() {
  global.ctx.clearRect(0, 0, global.canvas.width, global.canvas.height); 
  desenharCenario();
  atualizarVida(personagemCode.vidaStatus);
  
  function atualizarItem(identificador) {
      switch (identificador) {
          case 1:
              desenharItem(25, 35, 83, 99, global.itemX, global.itemY);
              break;
          case 2:
              desenharItem(106, 35, 40, 99, global.itemX, global.itemY);
              break;
          case 3:
              desenharItem(124, 403, 37, 462, global.itemX, global.itemY);
              break;
          case 4:
              desenharItem(425, 403, 469, 462, global.itemX, global.itemY);
              break;
          case 5:
              desenharItem(112, 319, 40, 99, global.itemX, global.itemY);
              break;
          case 6:
              desenharItem(379, 404, 37, 436, global.itemX, global.itemY);
              break;
          case 7:
              desenharItem(216, 402, 37, 436, global.itemX, global.itemY);
              break;
          case 8:
              desenharItem(295, 39, 40, 99, global.itemX, global.itemY);
              break;
          case 9:
              desenharItem(270, 223, 40, 99, global.itemX, global.itemY);
              break;
      }
  }

  if (global.ordemDosItens[global.partidaAtual]%2 == 0) {
      let identificador = global.ordemDosItens[global.partidaAtual]; 
      atualizarItem(identificador)
  } else {
      let identificador = Math.floor(Math.random() * 9) + 1;
      setInterval(atualizarItem(identificador), 4000); 
  }


  if(personagemCode.ativarAcoes == true){
    global.moverItem = requestAnimationFrame(() => global.itemX -= 10)
      
    if(global.itemX < -40){
      global.itemX = 860;
      global.partidaAtual += 1;
    }else if( (90 <= global.itemX && global.itemX <= 115 && personagemCode.pulando == false && global.ordemDosItens[global.partidaAtual]%2 != 0)
    || (90 <= global.itemX && global.itemX <= 115 && personagemCode.pulando == true && global.ordemDosItens[global.partidaAtual]%2 == 0)){
      personagemCode.vidaStatus -= 1;
      global.itemX = 860;
      global.partidaAtual += 1;
    }
  }else if(personagemCode.ativarAcoes == false){
    cancelAnimationFrame(global.moverItem);
  }

  atualizarCode(personagemCode.status, personagemCode.x, personagemCode.y);
}



document.addEventListener('keydown', function(event) {
  if (event.key == " " && !personagemCode.pulando) {
    personagemCode.pulando = true;
    global.personagemComecoPulo = performance.now();
    let posicaoInicialPersonagem = personagemCode.y;

    function pulo() {
      let tempoAtual = performance.now();
      let duracao = tempoAtual - global.personagemComecoPulo;
      if (duracao < personagemCode.duracaoPulo) {
        let progressoPulo = duracao / personagemCode.duracaoPulo;
        let puloY = posicaoInicialPersonagem - Math.sin(progressoPulo * Math.PI) * personagemCode.alturaPulo;
        personagemCode.y = puloY;
        requestAnimationFrame(pulo);
      } else {
        personagemCode.pulando = false;
        personagemCode.y = posicaoInicialPersonagem; 
      }
    }
    requestAnimationFrame(pulo);
  }
});

document.querySelector("#btnConfirmarPopUp").addEventListener('click', () => {  
  if(document.querySelector("#btnConfirmarPopUp").textContent  == "Começar" && faseAtual == 2){
    resetar();
    $('#popUp').modal('hide');
    personagemCode.ativarAcoes = true;
  }else if(document.querySelector("#btnConfirmarPopUp").textContent  == "Ir para a próxima fase" && faseAtual == 2){
    global.btnGanhouConfirmado = true;
  }else if(document.querySelector("#btnConfirmarPopUp").textContent  == "Refazer" && faseAtual == 2){
    resetar();
    $('#popUp').modal('hide');
    personagemCode.ativarAcoes = true;
  }
});

resetar();