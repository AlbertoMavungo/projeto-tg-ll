let global = {}; 

global.canvas = document.querySelector("#myCanvas");
global.ctx = global.canvas.getContext("2d");
global.canvas.width = 860; 

global.guardarMinutos = 0;
global.guardarSegundos = 0;
global.timeoutId = null;

export function cronometro(minutos = 0, segundos = 30, callback) {

  if (global.timeoutId !== null) { 
    clearTimeout(global.timeoutId); 
  }
  
  if (segundos === 0 && minutos === 0) {
    callback(); 
    return;
  }else if(segundos == 0 && minutos > 0){
    minutos--;
    segundos = 59;
  }else if(segundos > 0){
    segundos--;
  }

  global.guardarMinutos = minutos;
  global.guardarSegundos = segundos;

  global.timeoutId = setTimeout(cronometro, 1000, minutos, segundos, callback); 
}

function formatTime(time) {
  return time < 10 ? "0" + time : time;
}

export function desenharCronometro(x, y) {
  global.ctx.fillStyle = "white";
  global.ctx.font = "bold 30px Arial";

  global.ctx.strokeStyle = "black";
  global.ctx.lineWidth = 2;
  global.ctx.strokeText(formatTime(global.guardarMinutos) + ":" + formatTime(global.guardarSegundos), x, y);

  global.ctx.fillText(formatTime(global.guardarMinutos) + ":" + formatTime(global.guardarSegundos), x, y);
}
