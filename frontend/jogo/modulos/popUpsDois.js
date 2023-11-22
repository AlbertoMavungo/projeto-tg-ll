import { faseAtual } from './../main.js'

let global = {}; 

global.botoesPopUp = document.querySelectorAll(".btnLado");

export function mostrarPopUp(mensagem = 'Inicio') {  

  if(mensagem == 'Inicio'){
    carregarExplicacao(faseAtual);
    document.body.style.backgroundColor = "rgb(222, 234, 247)";
    document.querySelector("#btnConfirmarPopUp").style.backgroundColor = "green";
    document.querySelector("#btnConfirmarPopUp").textContent  = "Começar";
    document.querySelector("#frase").style.fontSize = "18px";


    global.botoesPopUp.forEach((botao, index) => {
      botao.style.display = "block";
      botao.style.position = "absolute";
      botao.style.zIndex = "-1";
      botao.style.top = "50%"
    
      if (index % 2 === 0) {
        botao.style.left = "-77px";
      } else {
        botao.style.right = "-77px";
      }
    });
    
  }else if(mensagem == 'Você perdeu!'){
    document.querySelector("#frase").innerHTML = "\n\n" + mensagem +
    '\n\n Clique nos botões ao lado para ver as instruções novamente.';
    document.querySelector("#frase").style.fontSize = "18px";

    document.querySelector("#btnConfirmarPopUp").style.backgroundColor = "red";
    document.querySelector("#btnConfirmarPopUp").textContent  = "Refazer";
  }else if(mensagem == 'Você ganhou!'){
        document.querySelector("#frase").innerHTML = "\n\n" + mensagem;
        document.querySelector("#frase").style.fontSize = "24px";

        global.botoesPopUp.forEach(botao => {
          botao.style.display = "none";
        });

        document.querySelector("#btnConfirmarPopUp").style.backgroundColor = "green";
        document.querySelector("#btnConfirmarPopUp").textContent  = "Ir para a próxima fase";

    }else if (mensagem == "Continuar") {
      document.querySelector("#frase").innerHTML = "\n\nParabéns! \n\nVocê chegou na bandeira amarela, agora tente chegar na bandeira vermelha utilizando as direções 'cima' e 'esquerda'. Você consegue!\n\n Cuidado com o vilão Bug! Se encostar nele perderá uma vida.";
      document.querySelector("#frase").style.fontSize = "18px";
    
      global.botoesPopUp.forEach(botao => {
        botao.style.display = "none";
      });
    
      document.querySelector("#btnConfirmarPopUp").style.backgroundColor = "green";
      document.querySelector("#btnConfirmarPopUp").textContent = "Continuar";
    }else if (mensagem == "Certificado"){
      document.querySelector("#frase").innerHTML = `\n\nParabéns! Você concluiu o jogo. 
      \nAgora, pode baixar o certificado de conclusão das fases ou retornar ao início.`
      document.querySelector("#btnConfirmarPopUp").style.backgroundColor = "green";
      document.querySelector("#btnConfirmarPopUp").textContent = "Baixar Certificado";

      global.botoesPopUp.forEach(botao => {
        botao.style.display = "none";
      });


    }
  $('#popUp').modal({ backdrop: 'static', keyboard: false });
}


let explicacao = [
  [
    "FASE 1\n\nObjetivo: Arraste o item que está no meio da tela e coloque-o no baú correspondente.",
    "PONTO FLUTUANTE\n\nEm programação, um ponto flutuante é um tipo de dado que representa números com casas decimais. Os pontos flutuantes permitem representar valores fracionados.\n\nEx. 1.75 - 2.0 - 68.45 - 40.712 - 500.000",
    "CARACTER\n\nEm programação, um caracter é um tipo de dado que representa um único caractere. Ele é usado para armazenar letras, números, símbolos ou qualquer outro caractere individual.\n\nObservação: Para ser um caracter precisa estar entre aspas simples.\n\n Ex. 'A' - 'b' - 'C' - 'j' - 'o' - 'K'",
    "LÓGICO\n\nEm programação, um operador lógico retorna um valor que pode ser Verdadeiro (V) ou Falso (F), dependendo das condições envolvidas.",
    "INTEIRO\n\nNa programação, um inteiro é um tipo de dado que representa números inteiros, ou seja, números que não possuem casas decimais.\n\nEx. 1 - 20 - 45 - 500 - 100 - 1000",
    "SEQUÊNCIA DE CARACTERES\n\nEm programação, um sequência de caracteres é um tipo de dado que representa texto. Ela é usada para armazenar e manipular sequências de caracteres, como palavras, frases, nomes, endereços, entre outros.\n\nObservação: Para ser um caracter precisa estar entre aspas simples.\n\nEx. '2.0' - '5.5' -  'programar' - 'aluno'"
  ],
  [
    "FASE 2\n\nObjetivo:   Neste jogo, você vai aprender a diferenciar variáveis e letantes. \n Quando encontrar uma variável, pressione a barra de espaço para pular. \n Quando encontrar uma letante, deixe ela se aproximar, mas não pressione nada. \n Se pular sobre uma letante ou deixar uma variável tocar o personagem, você perderá uma vida.",
    "VARIÁVEIS\n\nVariáveis em programação são como caixas onde você guarda informações, como idade ou texto. Cada variável tem um nome, um tipo de dado e um valor, podendo ser atualizado. Elas são usadas para armazenar e manipular dados em programas de computador.",
    "letANTES\n\nletantes, ao contrário das variáveis, têm valores que não podem ser alterados após serem definidos."
  ],
  [
    "FASE 3\n\nObjetivo: Nessa fase serão exibidas perguntas com apenas três alternativas. Você terá que escrever a alternativa certa no BoxCode (está ao lado da tela do jogo). Se acertar, vai para a próxima questão e se errar perde uma vida.\n\nClique na setinha ao lado para ver o conteúdo das questões. Boa Sorte!",
    "Declaração de Variáveis\n\n É como dar um nome a uma caixa onde você pode colocar coisas. Por exemplo, criar uma caixa chamada 'idade' significa que você vai colocar números inteiros nela, como a sua idade.\n\nExemplo: inteiro: idade \n\nNesse exemplo, estamos declarando uma váriavel com o nome 'idade' do tipo 'inteiro'.\n\n Para atribuir o valor 10 na idade use a setinha: \n\n Exemplo: idade <- 10",
    "Operadores Lógicos\n\n Operadores lógicos ajudam a combinar números ou letras e fazer perguntas. E (&&) é como perguntar se algo é verdadeiro e outra coisa também é verdadeira. Ou (||) é como perguntar se pelo menos uma coisa é verdadeira. E não (!) é como dizer o oposto do que você pensa.\n\n Exemplo: Voce quer sorvete E (&&) bolo? ",
    "Operadores de Comparação\n\n Operadores de comparação ajudam a comparar coisas, como números. Eles podem dizer se algo é maior (>), menor (<) ou igual (=) a outra coisa.\n Também existe O operador menor ou igual (<=) que é utilizado para verificar se o valor à esquerda é menor ou igual ao valor à direita e o maior ou igual (>=) funciona de maneira semelhante, mas em sentido oposto.\n\n Exemplo: 5 < 7 (5 é menor que 7)"
  ],
  [
    "FASE 4\n\nObjetivo: Nesta fase nós vamos utilizar estrutura de repetição para ajudar o Code a superar os obstaculos e fugir do vilão.",
    "ESTRUTURA DE REPETIÇÃO\n\n A instrução:\n'enquanto (direcao < 10) faca'\n\n indica que o código dentro desse bloco será repetido enquanto o valor de 'direcao' for menor que 10.",
    "INCREMENTO \n\n Dentro desse bloco, você encontrará:\n 'direcao++' \n\n Que significa incrementar (adicionar) o valor de 'direcao' em 1 a cada repetição.",
    "EXEMPLO ESTRUTURA \n\n  Por exemplo, para fazer o personagem andar para direita e repetir passos 10 vezes, siga o codigo: \n\n enquanto (direita < 10) faca \n direita++ \n\n a direção pode ser: direita, esquerda, cima ou embaixo."
  ]
];

let fraseElement = document.querySelector("#frase");
let indiceInstrucaoAtual = 0; 

function carregarExplicacao(faseAtual) {
  if (faseAtual >= 1 && faseAtual <= explicacao.length) {
    global.explicacaoAtual = explicacao[faseAtual-1];
    indiceInstrucaoAtual = 0;
    exibirFrase(global.explicacaoAtual[0]);
  } 
}

function exibirFrase(frase) {
  fraseElement.innerHTML = frase;
}

function proximaFrase() {
  if (global.explicacaoAtual && indiceInstrucaoAtual < global.explicacaoAtual.length - 1) {
    indiceInstrucaoAtual++;
    exibirFrase(global.explicacaoAtual[indiceInstrucaoAtual]);
  }
}

function fraseAnterior() {
  if (global.explicacaoAtual && indiceInstrucaoAtual > 0) {
    indiceInstrucaoAtual--;
    exibirFrase(global.explicacaoAtual[indiceInstrucaoAtual]);
  }
}

let btnAnterior = document.querySelector("#btnAnterior");
let btnProximo = document.querySelector("#btnProximo");

if (btnAnterior) {
  btnProximo.addEventListener("click", proximaFrase);
  btnAnterior.addEventListener("click", fraseAnterior);
}

