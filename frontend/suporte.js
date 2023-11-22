import { mostrarNotificacao } from './jogo/modulos/popUps.js';

document.getElementById('btnEnviar').addEventListener('click', async () => {
  let email = document.getElementById('email').value;
  let mensagem = document.getElementById('mensagem').value;

  if (mensagem == ''){
    mostrarNotificacao('Escreva a sua dúvida ou sugestão.');
  }else if (!/^[^\s@]{6,50}@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)){
    mostrarNotificacao('E-mail inválido! Dica: o e-mail deve ter entre 6 e 50 caracteres antes do "@".');
  }else{
    document.querySelector('#btnEnviar').innerHTML = 'Carregando...';
    document.querySelector('#btnEnviar').disabled = true;
    try {
      let response = await fetch('http://localhost:10000/suporte', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          mensagem: mensagem,
        }),
      });
  
      if (response.ok) {
        mostrarNotificacao('Solicitação enviada com sucesso!');
      } else {
        mostrarNotificacao('Erro ao enviar a solicitação de suporte.');
      }
    } catch (error) {
      console.error('Erro ao enviar a solicitação:', error);
      mostrarNotificacao('Erro ao enviar a solicitação de suporte.');
    } finally {
      document.querySelector('#btnEnviar').disabled = false;
      document.querySelector('#btnEnviar').innerHTML = 'Enviar';
    }  
  }
});
