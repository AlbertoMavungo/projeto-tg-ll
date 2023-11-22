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

  global.ordemDosDesafios = sortearNumerosSemRepeticao(9);
  global.partidaAtual = 0;
  global.tempoAcabou = false;
  global.btnGanhouConfirmado = false;
  global.fraseDigitada = false;
  global.cenarioStatus = 'inicio';
  global.auxPartida = null;
  global.comecarFase = false;
}

function sortearNumerosSemRepeticao(quantidade) {
  let numerosSorteados = [];

  while (numerosSorteados.length < quantidade) {
    let numeroAleatorio = Math.floor(Math.random() * quantidade);

    if (!numerosSorteados.includes(numeroAleatorio)) {
      numerosSorteados.push(numeroAleatorio);
    }
  }

  return numerosSorteados;
}

document.addEventListener("DOMContentLoaded", function () {
  desenharCenario();
});


function desenharCenario(status = 'inicio') {
  let cenarioImage = new Image(); 

  if(status == 'acertou'){
    cenarioImage.src = "imagens/cenarioFaseTresRespostaCerta.jpeg"; 
  }else if(status == 'errou'){
    cenarioImage.src = "imagens/cenarioFaseTresRespostaErrada.jpeg"; 
  }else{
    cenarioImage.src = "imagens/cenarioFaseTres.jpeg"; 
  }
                     
  let novaLargura = global.canvas.width;
  let novaAltura = global.canvas.height;
  let x = 0; 
  let y = 0; 
                              
  global.ctx.drawImage(cenarioImage, 0, 0, cenarioImage.width, cenarioImage.height, x, y, novaLargura, novaAltura); 
}

let desafioAtual = [
  {
    pergunta: 'Como declarar uma variável?',
    opcoes: ['a) idade <- 0',
             'b) idade = 0',
             'c) inteiro: idade']
  },
  {
    pergunta: "Como representar com operadores de comparação a expressão: '12 maior é que 6' ?",
    opcoes: ['a) 12 < 6',
             'b) 12 > 6',
             'c) 12 = 6']
  },
  {
    pergunta: 'Você quer jogar no parque hoje, mas para isso, precisa que o clima esteja bom e seu amigo esteja livre. Qual expressão está correta?',
    opcoes: ['a) clima bom || amigo livre ',
             'b) clima bom && amigo livre',
             'c) clima bom ! amigo livre']
  },
  {
    pergunta: 'Você entrará na festa se levar refrigerante ou comida. Qual operador lógico representa a situação?',
    opcoes: ['a) refrigerante || comida',
             'b) refrigerante ! comida',
             'c) refrigerante && comida']
  },
  {
    pergunta: "Como representar com operadores de comparação a expressão: '20 menor ou igual a 30?'",
    opcoes: ['a) 20 <= 30',
             'b) 20 == 6',
             'c) 20 => 30']
  },
  {
    pergunta: 'Qual operador de comparação indica se o número 5 é maior que 3?',
    opcoes: ['a) 5 = 3',
             'b) 5 <= 3',
             'c) 5 > 3']
  },
  {
    pergunta: 'Qual operador de comparação indica que "gato" não é igual à "cachorro"?',
    opcoes: ['a)  gato == cachorro',
             'b)  gato <  cachorro',
             'c)  gato != cachorro']
  },
  {
    pergunta: 'Qual operador de comparação é usado para indicar que um valor é igual a outro?',
    opcoes: ['a) valor > valor',
             'b) valor = valor ',
             'c) valor != valor']
  },
  {
      pergunta: 'Imagine que você só vá ao cinema se tiver dinheiro suficiente ou se estiver passando um filme interessante. Qual operador lógico representa essa situação?',
      opcoes: ['a) filme interessante || ter dinheiro',
               'b) filme interessante && ter dinheiro',
               'c) filme interessante != ter dinheiro']
    }
];

function exibirDesafio() {
  if (!document.querySelector('#textoDesafio')) {
    let textoDesafio = document.createElement('div');
    textoDesafio.id = 'textoDesafio';
    textoDesafio.style.position = 'absolute';
    textoDesafio.style.top = '28%';
    textoDesafio.style.left = '23%';
    textoDesafio.style.marginRight = '45%';
    textoDesafio.style.fontSize = '20px';
    textoDesafio.style.fontWeight = 'bold';
    textoDesafio.style.color = 'green';
    textoDesafio.style.fontFamily = 'Arial, sans-serif';
    textoDesafio.style.whiteSpace = 'pre-line';
    global.canvas.parentNode.appendChild(textoDesafio);
    global.textoDesafio = textoDesafio; 
  }

  if (global.partidaAtual != global.auxPartida && global.comecarFase == true && global.cenarioStatus == 'inicio') {
    global.textoDesafio.innerText = '';
    clearTimeout(global.escreverTempo);
    let desafio = desafioAtual[global.ordemDosDesafios[global.partidaAtual]];
    let pergunta = desafio.pergunta;
    let opcoes = desafio.opcoes;
  
    let textoCompleto = pergunta + '\n\nOpções:\n' + opcoes.join('\n');

    let i = 0;

    function escrevendo() {
      if (i < textoCompleto.length && global.cenarioStatus == 'inicio') {
        global.textoDesafio.textContent += textoCompleto.charAt(i);
        i++;
        global.escreverTempo = setTimeout(escrevendo, 60);
      }
    }

    escrevendo();
    global.auxPartida = global.partidaAtual;
  }
}




export function atualizaFaseTres() {
  if (personagemCode.vidaStatus > 0 && global.tempoAcabou == false && global.partidaAtual < 9) {
    desenha();
  } else if ((personagemCode.vidaStatus == 0 || global.tempoAcabou == true) && global.partidaAtual != 9) {
    mostrarPopUp("Você perdeu!");
    resetar();
  } else if (personagemCode.vidaStatus > 0 && global.tempoAcabou == false && global.partidaAtual == 9 && global.btnGanhouConfirmado == false) {
    mostrarPopUp("Você ganhou!");
  } else if(global.btnGanhouConfirmado == true){
    return 4;
  }
  return 3;
}

function desenha() {
  document.querySelector('#boxCode').style.display = "block";
  global.ctx.clearRect(0, 0, global.canvas.width, global.canvas.height); 
  desenharCenario(global.cenarioStatus);
  desenharCronometro(760, 28);

  atualizarVida(personagemCode.vidaStatus);

  exibirDesafio();  
}



document.querySelector("#btnPlay").addEventListener("click", function() {
  if(faseAtual == 3){
    document.querySelector('#textoDesafio').style.display = 'none';
    let textoBoxCode = document.querySelector("#textarea").value;
  
    if(faseAtual == 3 && global.partidaAtual < 9){
      switch(global.ordemDosDesafios[global.partidaAtual]){
        case 0:
            if (!/^[abc)]*\s*inteiro:\s*idade\s*$/i.test(textoBoxCode)){
                personagemCode.vidaStatus -= 1;
                global.cenarioStatus = 'errou';
            } else {
                global.cenarioStatus = 'acertou';
            }
            break;
        case 1:
            if (!/^[abc)]*\s*12\s*>\s*6\s*$/i.test(textoBoxCode)){
                personagemCode.vidaStatus -= 1;
                global.cenarioStatus = 'errou';
            } else {
                global.cenarioStatus = 'acertou';
            }
            break;
        case 2:
            if (!/^[abc)]*\s*clima\s*bom\s*&&\s*amigo\s*livre\s*$/i.test(textoBoxCode)){
                personagemCode.vidaStatus -= 1;
                global.cenarioStatus = 'errou';
            } else {
                global.cenarioStatus = 'acertou';
            }
            break;
        case 3:
            if (!/^[abc)]*\s*refrigerante\s*\|\|\s*comida\s*$/i.test(textoBoxCode)){
                personagemCode.vidaStatus -= 1;
                global.cenarioStatus = 'errou';
            } else {
                global.cenarioStatus = 'acertou';
            }
            break;
        case 4:
            if (!/^[abc)]*\s*20\s*<=\s*30\s*$/i.test(textoBoxCode)){
                personagemCode.vidaStatus -= 1;
                global.cenarioStatus = 'errou';
            } else {
                global.cenarioStatus = 'acertou';
            }
            break;
        case 5:
            if (!/^[abc)]*\s*5\s*>\s*3\s*$/i.test(textoBoxCode)){
                personagemCode.vidaStatus -= 1;
                global.cenarioStatus = 'errou';
            } else {
                global.cenarioStatus = 'acertou';
            }
            break;
        case 6:
            if (!/^[abc)]*\s*gato\s*!=\s*cachorro\s*$/i.test(textoBoxCode)){
                personagemCode.vidaStatus -= 1;
                global.cenarioStatus = 'errou';
            } else {
                global.cenarioStatus = 'acertou';
            }
            break;
        case 7:
            if (!/^[abc)]*\s*valor\s*=\s*valor\s*$/i.test(textoBoxCode)){
                personagemCode.vidaStatus -= 1;
                global.cenarioStatus = 'errou';
            } else {
                global.cenarioStatus = 'acertou';
            }
            break;
        case 8:
            if (!/^[abc)]*\s*filme\s*interessante\s*\|\|\s*ter\s*dinheiro\s*$/i.test(textoBoxCode)){
                personagemCode.vidaStatus -= 1;
                global.cenarioStatus = 'errou';
            } else {
                global.cenarioStatus = 'acertou';
            }
            break;
      }
  
      setTimeout(() => {
        global.cenarioStatus = 'inicio';
        document.querySelector('#textoDesafio').style.display = 'block';
      }, 3000); 

      global.partidaAtual += 1;
      document.querySelector("#textarea").value = '';
    }
  }
});

document.querySelector("#btnConfirmarPopUp").addEventListener('click', () => {  
  if(document.querySelector("#btnConfirmarPopUp").textContent  == "Começar" && faseAtual == 3){
    resetar();
    global.comecarFase = true;
    $('#popUp').modal('hide');
    cronometro(5, 1, () => {
      global.tempoAcabou = true; 
    });
  }else if(document.querySelector("#btnConfirmarPopUp").textContent  == "Ir para a próxima fase" && faseAtual == 3){
    global.btnGanhouConfirmado = true;
  }else if(document.querySelector("#btnConfirmarPopUp").textContent  == "Refazer" && faseAtual == 3){
    resetar();
    global.comecarFase = true;
    $('#popUp').modal('hide');
    cronometro(5, 1, () => {
      global.tempoAcabou = true; 
    });
  }
});

resetar();