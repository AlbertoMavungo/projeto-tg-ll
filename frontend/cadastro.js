import { mostrarNotificacao } from './jogo/modulos/popUps.js';

document.querySelector('#btnCriarConta').addEventListener('click', async function () {
    let btnEmail = document.querySelector('#btnEmail').value;
    let btnSenha = document.querySelector('#btnSenha').value;
    let btnDataNascimento = document.querySelector('#btnDataNascimento').value;
    let btnNome = document.querySelector('#btnNome').value;

    let dataAtual = new Date();
    let anoMaxNascimento = dataAtual.getFullYear();
    let anoNascimento = new Date(btnDataNascimento).getFullYear();
    let anoMinNascimento = anoMaxNascimento-103;


if (btnEmail == '' || btnSenha == '' || btnNome == '' || btnDataNascimento == '') {
  mostrarNotificacao('Preencha todos os campos para cadastrar.');
}else if (!/^[^\s@]{6,50}@[^\s@]+\.[a-zA-Z]{2,}$/.test(btnEmail)) {
  mostrarNotificacao('E-mail inválido! Dica: o e-mail deve ter entre 6 e 50 caracteres antes do "@".');
} else if (btnSenha.length < 6) {
  mostrarNotificacao('A senha deve ter no mínimo 6 caracteres.');
}else if(anoNascimento < anoMinNascimento || anoNascimento > anoMaxNascimento){
  mostrarNotificacao('O ano de nascimento deve estar entre ' + anoMinNascimento + ' e ' + anoMaxNascimento + '.');
}else if (!/[a-z]/.test(btnSenha) || !/[A-Z]/.test(btnSenha) || !/[0-9]/.test(btnSenha) || !/[!@#$%^&*]/.test(btnSenha)) {
  mostrarNotificacao('A senha deve conter pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial (!@#$%^&*).');
  } else { 
    try {
      document.querySelector('#btnCriarConta').innerHTML = 'Carregando...';
      document.querySelector('#btnCriarConta').disabled = true;

      let resposta = await fetch('http://localhost:10000/cadastrarUsuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: btnEmail, 
          senha: btnSenha, 
          nome: btnNome,   
          dataNascimento: btnDataNascimento, 
        }),
      });
      
      resposta = await resposta.json();
      mostrarNotificacao(resposta.message);

      if(resposta.message == 'Cadastro efetuado!'){
        setTimeout(function() {
          window.location.href = "./login.html";
        }, 2000);
      }
    } catch (error) {
      mostrarNotificacao('Ocorreu um erro ao cadastrar o usuário.');
    }  finally {
      document.querySelector('#btnCriarConta').disabled = false;
      document.querySelector('#btnCriarConta').innerHTML = 'Criar uma conta';
    }  
  }
});

document.querySelector("#olhoIcon").addEventListener("click", function () {
  let btnSenha = document.querySelector("#btnSenha");
  let icon = document.querySelector("#olhoIcon");

  if (btnSenha.type == "password") {
    btnSenha.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    btnSenha.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
});








  
