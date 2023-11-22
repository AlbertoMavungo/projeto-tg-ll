let global = {}; 

global.idInterval = null;

export function mostrarNotificacao(mensagem = ''){
    let progressBar = document.querySelector('#progress-bar');
    let progress = 0;
  
    document.querySelector("#textoToast").innerHTML = mensagem;
    if (global.idInterval) {
      clearInterval(global.idInterval);
    }

    global.idInterval = setInterval(() => {
      progress += 10;
      if (progress <= 100) {
        progressBar.style.width = progress + '%';
      } else {
        clearTimeout(global.idInterval);
        $('.toast').toast('hide');
        progressBar.style.width = '0%';
      }
    }, 500);
  
    $('.toast').toast('show');
}

export function exibirBalao(texto, x, y, posicaoSeta) {
  let balao = document.createElement('div');
  balao.className = 'balaoContainer';
  balao.style.position = 'absolute';
  balao.style.left = `${x}px`;
  balao.style.top = `${y}px`;

  let fecharBotao = document.createElement('div');
  fecharBotao.className = 'btnFecharBalao';
  fecharBotao.textContent = 'x';
  fecharBotao.addEventListener('click', () => {
    balao.style.display = 'none';
  });

  let paragrafo = document.createElement('p');
  paragrafo.textContent = texto;

  balao.appendChild(fecharBotao);
  balao.appendChild(document.createElement('br'));
  balao.appendChild(paragrafo);

  if (posicaoSeta) {
    let balaoSeta = document.createElement('div');
    balaoSeta.className = `balaoSeta${posicaoSeta}`;
    balao.appendChild(balaoSeta);
  }

  document.body.appendChild(balao);
}

