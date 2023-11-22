export function playMusica (){
    let audioPlayer = document.querySelector("#audioPlayer");
    if (audioPlayer) {
      audioPlayer.play().catch(function(error) {
      });
    }
};
function ajustarVolume(acao) {
    let audioPlayer = document.querySelector("#audioPlayer");
    let volumeIcon = document.querySelector("#volumeIcon");
  
    if (audioPlayer) {
      if (acao === '+') {
          //Aumenta o volume em 0.1 (10%)
          audioPlayer.volume = audioPlayer.volume < 1 ? (audioPlayer.volume * 10 + 1) / 10 : audioPlayer.volume;
          volumeIcon.className = "fas fa-volume-up";
      } else if (acao === '-') {
          // Diminui o volume em 0.1 (10%)
          audioPlayer.volume = audioPlayer.volume > 0 ? (audioPlayer.volume * 10 - 1) / 10 : audioPlayer.volume;
          volumeIcon.className = "fas fa-volume-down";
      }
    }
}

let global = {}; //Objeto com escopo global

global.btnVolumeAumentar = document.querySelector("#btnVolumeAumentar");
global.btnVolumeDiminuir = document.querySelector("#btnVolumeDiminuir");

global.btnVolumeAumentar.addEventListener("click", function () {
  ajustarVolume('+');
});

global.btnVolumeDiminuir.addEventListener("click", function () {
  ajustarVolume('-');
});


