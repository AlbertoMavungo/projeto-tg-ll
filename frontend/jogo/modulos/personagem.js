let global = {}; 

global.canvas = document.querySelector("#myCanvas");
global.ctx = global.canvas.getContext("2d");
global.canvas.width = 870;
global.canvas.height = 380;

function desenharCode(recorteXInicial, recorteYInicial, recorteXFinal, recorteYFinal, x, y) {
  let codeImage = new Image();
  codeImage.src = "imagens/codeSprints.png";

  let proporcao = 0.6;
  let novaLargura = recorteXFinal * proporcao;
  let novaAltura = recorteYFinal * proporcao;

  global.ctx.drawImage(codeImage, recorteXInicial, recorteYInicial, recorteXFinal, recorteYFinal, x, y, novaLargura, novaAltura);
}

function desenharBug(recorteXInicial, recorteYInicial, recorteXFinal, recorteYFinal, x, y) {
  let bugImage = new Image();
  bugImage.src = "imagens/bugSprints.png";

  let proporcao = 0.7;
  let novaLargura = recorteXFinal * proporcao;
  let novaAltura = recorteYFinal * proporcao;

  global.ctx.drawImage(bugImage, recorteXInicial, recorteYInicial, recorteXFinal, recorteYFinal, x, y, novaLargura, novaAltura);
}

export function atualizarCode(teclaPressionada, x, y) {
  switch (teclaPressionada) {
    default:
      desenharCode(310, 10, 140, 150, x, y);
      break;
  }
}

export function atualizarBug(direcao, x, y) {
    switch(direcao){
      case 'esquerda':
          desenharBug(275, 20, 70, 166, x, y);
        break;
      case 'direita':
          desenharBug(437, 18, 507, 169, x, y);
        break;
    }
  }










