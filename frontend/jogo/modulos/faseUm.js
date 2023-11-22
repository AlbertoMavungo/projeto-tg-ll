import { cronometro, desenharCronometro } from './cronometro.js';
import { atualizarVida } from './vida.js';
import { mostrarPopUp } from './popUpsDois.js';
import { faseAtual } from './../main.js'

let global = {}; 
let personagemCode = {};

global.canvas = document.querySelector("#myCanvas");
global.ctx = global.canvas.getContext("2d");
global.canvas.width = 860; 
global.canvas.height = 380; 

function resetar(){
  personagemCode.vidaStatus = 3;

  global.ordemDosItens = sortearNumerosSemRepeticao(9);
  global.partidaAtual = 0;
  global.tempoAcabou = false;
  global.itemX = 400;
  global.itemY = 300;
  global.novaLarguraItem, global.novaAlturaItem;
  global.arrastandoItem = false;
  global.offsetItemX = 0;
  global.offsetItemY = 0;

  global.bauStatus = 0;
  global.bauUmX = 100;
  global.bauDoisX = 250;
  global.bauTresX = 400;
  global.bauQuatroX = 550;
  global.bauCincoX = 700;
  global.bauY = 200;
  global.bauWidth = 50;
  global.bauHeight = 50;
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
function desenharBau(recorteXInicial, recorteYInicial, recorteXFinal, recorteYFinal, x, y) {
  let bauImage = new Image();
  bauImage.src = "imagens/bau.png";

  let proporcao = 0.7; 
  let novaLargura = recorteXFinal * proporcao; 
  let novaAltura = recorteYFinal * proporcao;

  global.ctx.drawImage(bauImage, recorteXInicial, recorteYInicial, recorteXFinal, recorteYFinal, x, y, novaLargura, novaAltura);
}
function desenharCenario() {
  let cenarioImage = new Image(); 
  cenarioImage.src = "imagens/cenarioFaseUm.jpg"; 
                              
  let proporcao = cenarioImage.width / cenarioImage.height; 
  let novaLargura = global.canvas.width;
  let novaAltura = novaLargura / proporcao;
  let x = 0; 
  let y = (global.canvas.height - novaAltura) / 2; 
                              
  global.ctx.drawImage(cenarioImage, 0, 0, cenarioImage.width, cenarioImage.height, x, y, novaLargura, novaAltura); 
}
function desenharItem(recorteXInicial, recorteYInicial, recorteXFinal, recorteYFinal, x, y) {
  let itemImage = new Image();
  itemImage.src = "imagens/tiposPrimitivos.png";

  let proporcao = 1.3; 
  global.novaLarguraItem = recorteXFinal * proporcao;
  global.novaAlturaItem = recorteYFinal * proporcao;

  global.ctx.drawImage(itemImage, recorteXInicial, recorteYInicial, recorteXFinal, recorteYFinal, x, y, global.novaLarguraItem, global.novaAlturaItem);
}

export function atualizaFaseUm() {
  if (personagemCode.vidaStatus > 0 && global.tempoAcabou == false && global.partidaAtual < 9) {
    desenha();
    abreEfechaBau();
  } else if ((personagemCode.vidaStatus == 0 || global.tempoAcabou == true) && global.partidaAtual != 9) {
    mostrarPopUp("Você perdeu!");
    resetar();
  } else if (personagemCode.vidaStatus > 0 && global.tempoAcabou == false && global.partidaAtual == 9 && global.btnGanhouConfirmado == false) {
    mostrarPopUp("Você ganhou!");
  }else if(global.btnGanhouConfirmado == true){
    return 2;
  }
  return 1;
}

function desenha() {
  global.ctx.clearRect(0, 0, global.canvas.width, global.canvas.height); 
  desenharCenario();
  desenharCronometro(760, 28);


  atualizarVida(personagemCode.vidaStatus);

  //desenharBau(recorteXInicial, recorteYInicial, recorteXFinal, recorteYFinal, LOCALx, LOCALy);
  switch(global.bauStatus){
    case 0:
      desenharBau( 0,   13, 142, 130, global.bauUmX, global.bauY);
      desenharBau(294,  13, 142, 130, global.bauDoisX, global.bauY);
      desenharBau(584,  13, 142, 130, global.bauTresX, global.bauY);
      desenharBau(880,  13, 142, 130, global.bauQuatroX, global.bauY);
      desenharBau(1173, 13, 142, 130, global.bauCincoX, global.bauY);
      break;
    case 1:
      desenharBau(144, 13, 150, 230, global.bauUmX, global.bauY);
      desenharBau(294,  13, 142, 130, global.bauDoisX, global.bauY);
      desenharBau(584,  13, 142, 130, global.bauTresX, global.bauY);
      desenharBau(880,  13, 142, 130, global.bauQuatroX, global.bauY);
      desenharBau(1173, 13, 142, 130, global.bauCincoX, global.bauY);
      break;
    case 2:
      desenharBau( 0,   13, 142, 130, global.bauUmX, global.bauY);
      desenharBau(435,  13, 142, 130, global.bauDoisX, global.bauY);
      desenharBau(584,  13, 142, 130, global.bauTresX, global.bauY);
      desenharBau(880,  13, 142, 130, global.bauQuatroX, global.bauY);
      desenharBau(1173, 13, 142, 130, global.bauCincoX, global.bauY);
      break;
    case 3:
      desenharBau( 0,   13, 142, 130, global.bauUmX, global.bauY);
      desenharBau(294,  13, 142, 130, global.bauDoisX, global.bauY);
      desenharBau(730,  13, 142, 130, global.bauTresX, global.bauY);
      desenharBau(880,  13, 142, 130, global.bauQuatroX, global.bauY);
      desenharBau(1173, 13, 142, 130, global.bauCincoX, global.bauY);
      break;
    case 4:
      desenharBau( 0,    13, 142, 130, global.bauUmX,  global.bauY);
      desenharBau(294,   13, 142, 130, global.bauDoisX,  global.bauY);
      desenharBau(584,   13, 142, 130, global.bauTresX,  global.bauY);
      desenharBau(1020,  13, 142, 130, global.bauQuatroX,  global.bauY);
      desenharBau(1173,  13, 142, 130, global.bauCincoX,  global.bauY);
      break;
    case 5:
      desenharBau( 0,   13, 142, 130, global.bauUmX,  global.bauY);
      desenharBau(294,  13, 142, 130, global.bauDoisX,  global.bauY);
      desenharBau(584,  13, 142, 130, global.bauTresX,  global.bauY);
      desenharBau(880,  13, 142, 130, global.bauQuatroX,  global.bauY);
      desenharBau(1320, 13, 142, 130, global.bauCincoX,  global.bauY);
      break;
  }


  switch (global.ordemDosItens[global.partidaAtual]) {
      //desenharItem(recorteXInicial, recorteYInicial, recorteXFinal, recorteYFinal, LOCALx, LOCALy);
    case 1:
      desenharItem(170, 0, 80, 23, global.itemX, global.itemY);
      break;
    case 2:
      desenharItem(270, 0, 80, 23, global.itemX, global.itemY);
      break;
    case 3:
      desenharItem(370, 0, 100, 43, global.itemX, global.itemY);
      break;
    case 4:
      desenharItem(493, 0, 40, 23, global.itemX, global.itemY);
      break;
    case 5:
      desenharItem(558, 0, 40, 23, global.itemX, global.itemY);
      break;
    case 6:
      desenharItem(625, 0, 40, 23, global.itemX, global.itemY);
      break;
    case 7:
      desenharItem(675, 0, 20, 23, global.itemX, global.itemY);
      break;
    case 8:
      desenharItem(708, 0, 58, 23, global.itemX, global.itemY);
      break;
    case 9:
      desenharItem(776, 0, 58, 23, global.itemX, global.itemY);
      break;
  }
}


global.canvas.addEventListener("mousedown", iniciarArraste);
global.canvas.addEventListener("mousemove", arrastarItem);
global.canvas.addEventListener("mouseup", pararArraste);

function iniciarArraste(event) {
  let mousePos = posicaoMouseCanvas(event);
  let mouseX = mousePos.x;
  let mouseY = mousePos.y;

  if (
    mouseX > global.itemX &&
    mouseX < global.itemX + global.novaLarguraItem &&
    mouseY > global.itemY &&
    mouseY < global.itemY + global.novaAlturaItem
  ) {
    global.arrastandoItem = true;
    global.offsetItemX = mouseX - global.itemX;
    global.offsetItemY = mouseY - global.itemY;
  }
}

function arrastarItem(event) {
  if (global.arrastandoItem) {
    let mousePos = posicaoMouseCanvas(event);
    let mouseX = mousePos.x;
    let mouseY = mousePos.y;
    global.itemX = mouseX - global.offsetItemX;
    global.itemY = mouseY - global.offsetItemY;
  }
}

function pararArraste() {
  global.arrastandoItem = false;
}

function posicaoMouseCanvas(event) {
  let rect = global.canvas.getBoundingClientRect();
  let scaleX = global.canvas.width / rect.width;
  let scaleY = global.canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}




function identificarBau() {

  if (
    global.itemX >= global.bauUmX &&
    global.itemX <= global.bauUmX + global.bauWidth &&
    global.itemY >= global.bauY &&
    global.itemY <= global.bauY + global.bauHeight
  ) {
    //console.log('Item solto em cima do retângulo "int"');
    if (global.ordemDosItens[global.partidaAtual] != 6 && global.ordemDosItens[global.partidaAtual] != 7) {
      personagemCode.vidaStatus -= 1;
    }
    global.partidaAtual += 1;
    global.itemX = 400;
    global.itemY = 300;
    global.bauStatus = 0;
  } else if (
    global.itemX >= global.bauDoisX &&
    global.itemX <= global.bauDoisX + global.bauWidth &&
    global.itemY >= global.bauY &&
    global.itemY <= global.bauY + global.bauHeight
  ) {
    //console.log('Item solto em cima do retângulo "real"');
    if (global.ordemDosItens[global.partidaAtual] != 8 && global.ordemDosItens[global.partidaAtual] != 9) {
      personagemCode.vidaStatus -= 1;
    }
    global.partidaAtual += 1;
    global.itemX = 400;
    global.itemY = 300;
    global.bauStatus = 0;
  } else if (
    global.itemX >= global.bauTresX &&
    global.itemX <= global.bauTresX + global.bauWidth &&
    global.itemY >= global.bauY &&
    global.itemY <= global.bauY + global.bauHeight
  ) {
    //console.log('Item solto em cima do retângulo "char"');
    if (global.ordemDosItens[global.partidaAtual] != 4 && global.ordemDosItens[global.partidaAtual] != 5) {
      personagemCode.vidaStatus -= 1;
    }
    global.partidaAtual += 1;
    global.itemX = 400;
    global.itemY = 300;
    global.bauStatus = 0;
  } else if (
    global.itemX >= global.bauQuatroX &&
    global.itemX <= global.bauQuatroX + global.bauWidth &&
    global.itemY >= global.bauY &&
    global.itemY <= global.bauY + global.bauHeight
  ) {
    //console.log('Item solto em cima do retângulo "literal"');
    if (global.ordemDosItens[global.partidaAtual] != 2 && global.ordemDosItens[global.partidaAtual] != 3) {
      personagemCode.vidaStatus -= 1;
    }
    global.partidaAtual += 1;
    global.itemX = 400;
    global.itemY = 300;
    global.bauStatus = 0;
  } else if (
    global.itemX >= global.bauCincoX &&
    global.itemX <= global.bauCincoX + global.bauWidth &&
    global.itemY >= global.bauY &&
    global.itemY <= global.bauY + global.bauHeight
  ) {
    //console.log('Item solto em cima do retângulo "logico"');
    if (global.ordemDosItens[global.partidaAtual] != 1) {
      personagemCode.vidaStatus -= 1;
    }
    global.partidaAtual += 1;
    global.itemX = 400;
    global.itemY = 300;
    global.bauStatus = 0;
  }
}

global.canvas.addEventListener("mouseup", function () {
  identificarBau();
});

function abreEfechaBau(){

  if (
    global.itemX >= global.bauUmX &&
    global.itemX <= global.bauUmX + global.bauWidth &&
    global.itemY >= global.bauY &&
    global.itemY <= global.bauY + global.bauHeight
  ) {
    //console.log('Item solto em cima do retângulo "int"');
    global.bauStatus = 1;
  } else if (
    global.itemX >= global.bauDoisX &&
    global.itemX <= global.bauDoisX + global.bauWidth &&
    global.itemY >= global.bauY &&
    global.itemY <= global.bauY + global.bauHeight
  ) {
    //console.log('Item solto em cima do retângulo "real"');
    global.bauStatus = 2;
  } else if (
    global.itemX >= global.bauTresX &&
    global.itemX <= global.bauTresX + global.bauWidth &&
    global.itemY >= global.bauY &&
    global.itemY <= global.bauY + global.bauHeight
  ) {
    //console.log('Item solto em cima do retângulo "char"');
    global.bauStatus = 3;
  } else if (
    global.itemX >= global.bauQuatroX &&
    global.itemX <= global.bauQuatroX + global.bauWidth &&
    global.itemY >= global.bauY &&
    global.itemY <= global.bauY + global.bauHeight
  ) {
    //console.log('Item solto em cima do retângulo "literal"');
    global.bauStatus = 4;
  } else if (
    global.itemX >= global.bauCincoX &&
    global.itemX <= global.bauCincoX + global.bauWidth &&
    global.itemY >= global.bauY &&
    global.itemY <= global.bauY + global.bauHeight
  ) {
    //console.log('Item solto em cima do retângulo "logico"');
    global.bauStatus = 5;
  }else{
    global.bauStatus = 0;
  }
};

document.querySelector("#btnConfirmarPopUp").addEventListener('click', () => {  
  if(document.querySelector("#btnConfirmarPopUp").textContent  == "Começar" && faseAtual == 1){
    resetar();
    $('#popUp').modal('hide');
    cronometro(0, 31, () => {
      global.tempoAcabou = true; 
    });
  }else if(document.querySelector("#btnConfirmarPopUp").textContent  == "Ir para a próxima fase" && faseAtual == 1){
    global.btnGanhouConfirmado = true;
  }else if(document.querySelector("#btnConfirmarPopUp").textContent  == "Refazer" && faseAtual == 1){
    resetar();
    $('#popUp').modal('hide');
    cronometro(0, 31, () => {
      global.tempoAcabou = true; 
    });
  }
});

resetar();