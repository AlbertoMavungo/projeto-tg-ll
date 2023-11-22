let global = {}; 

global.canvas = document.querySelector("#myCanvas");
global.ctx = global.canvas.getContext("2d");
global.canvas.width = 860; 
global.canvas.height = 380; 

function desenharVida(recorteXInicial, recorteYInicial, recorteXFinal, recorteYFinal, x, y, novaLargura, novaAltura) {
    let vidaImage = new Image();
    vidaImage.src = "imagens/vida.png";
  
    let proporcao = 0.3; 
    novaLargura = recorteXFinal * proporcao; 
    novaAltura = recorteYFinal * proporcao; 
  
    global.ctx.drawImage(vidaImage, recorteXInicial, recorteYInicial, recorteXFinal, recorteYFinal, x, y, novaLargura, novaAltura);
};

export function atualizarVida(vidaStatus){
    switch (vidaStatus) {
        case 3:
          desenharVida(10, 73, 126, 100, 1, 4);
          desenharVida(10, 73, 126, 100, 29, 4);
          desenharVida(10, 73, 126, 100, 57, 4);
          break;
        case 2:
          desenharVida(10, 73, 126, 100, 1, 4);
          desenharVida(10, 73, 126, 100, 29, 4);
          desenharVida(640, 73, 926, 100, 65, 4);
          break;
        case 1:
          desenharVida(10, 73, 126, 100, 1, 4);
          desenharVida(640, 73, 326, 100, 36.3, 4);
          desenharVida(640, 73, 926, 100, 65, 4);
          break;
    }
};