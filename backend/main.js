let express = require('express');
let app = express();
let admin = require('firebase-admin');
let serviceAccount = require('./serviceAccountKey');
let cors = require('cors');
let path = require('path');
let fs = require('fs');
let { createCanvas, loadImage } = require('canvas');
let moment = require('moment');
let axios = require('axios');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://playcode-c6a00.firebaseio.com'
});

let firestore = admin.firestore();
let auth = admin.auth();
let db = firestore;

app.use(cors());
app.use(express.json());

app.get('/firebaseConfig', (req, res) => {
  let firebaseConfig = {
    apiKey: "AIzaSyBWMyS-uvCOmPPnkYB02lDpgLZ0VwyxYJI",
    authDomain: "playcode-c6a00.firebaseapp.com",
    projectId: "playcode-c6a00",
    storageBucket: "playcode-c6a00.appspot.com",
    messagingSenderId: "574216065173",
    appId: "1:574216065173:web:22652fb20b8d1ec7418b9c",
    measurementId: "G-7X2NCD6FCK"
  };
  res.json(firebaseConfig);
});

app.post('/login', async (req, res) => {
  let { idToken } = req.body;

  try {
    let token = await admin.auth().verifyIdToken(idToken);

    let uid = token.uid;

    let userDoc = await db.collection('users').doc(uid).get();

    if (userDoc.exists) {
      let userData = userDoc.data();
      let admin = userData.admin == true;

      res.status(200).json({ auth: true, verificarAdmin: admin });
      console.log(`Usuário efetuou login. E-mail: ${userData.email}`);
    }else {
      res.status(401).json({ error: 'Usuário não encontrado' });
    }

  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

app.post('/loginGoogle', async (req, res) => {
  let { idToken, nome, email } = req.body;

  try {
    let token = await admin.auth().verifyIdToken(idToken);
    let uid = token.uid;
    let userDoc = await db.collection('users').doc(uid).get();

    if (userDoc.exists) {
      let userData = userDoc.data();
      let admin = userData.admin == true;

      res.status(200).json({ auth: true, verificarAdmin: admin });
    } else {
      await db.collection('users').doc(uid).set({
        nome: nome, 
        email: email,
        guardarFase: 1,
        admin: false
      });

      res.status(200).json({ auth: true, verificarAdmin: false });
    }
    console.log(`Usuário efetuou login com a api do google. E-mail: ${email}`);
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
});




app.post('/excluirUser', async (req, res) => {
  try {
    let userId = req.body.userId; 

    await auth.deleteUser(userId);

    let userDocRef = db.collection('users').doc(userId);
    await userDocRef.delete();
    

    res.status(200).json({ message: 'Cadastro excluído com sucesso.' });
    console.log(`Cadastro excluído com sucesso. Id: ${userId}`);
  } catch (error) {
    console.log('Erro ao excluir usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.post('/alterarUser', async (req, res) => {
  try {
    let userId = req.body.userId; 
    let email = req.body.email; 
    let nome = req.body.nome; 
    let dataNascimento = req.body.dataNascimento; 
    let guardarFase = req.body.guardarFase; 
    let admin = req.body.admin; 
    
    let user = await auth.getUser(userId);

    let UserExistente = await auth.getUserByEmail(email).catch(() => null);

    if (!UserExistente || UserExistente.uid === userId) {
      await auth.updateUser(userId, {
        email: email
      });

      let userDocRef = db.collection('users').doc(userId);
      await userDocRef.update({ 
        email: email, 
        nome: nome, 
        dataNascimento: dataNascimento,
        guardarFase: guardarFase,
        admin: admin == 'true'
      });

      res.status(200).json({ message: 'Cadastro atualizado com sucesso' });
      console.log(`Cadastro atualizado com sucesso. E-mail: ${email}`);
    } else {
      res.status(403).json({ error: 'E-mail já registrado por outro usuário' });
    }
  } catch (error) {
    console.error('Erro ao atualizar o e-mail do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.post('/obterCertificado', async (req, res) => {
  try {
    let nomeUser = await obterDadosUser(req.body.userId);

    let canvas = createCanvas(800, 600); 
    let ctx = canvas.getContext('2d');

    let backgroundImage = await loadImage('frontend/jogo/imagens/certificadoPC.png');
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    ctx.font = '30px sans-serif'; 
    ctx.fillStyle = 'black'; 

    let textWidth = ctx.measureText(nomeUser).width;
    let x = (canvas.width - textWidth) / 2;
    ctx.fillText(nomeUser, x, 285); 

    ctx.font = '20px sans-serif'; 

    let dataConclusao = new Date().toLocaleDateString();
    ctx.fillText(dataConclusao, 341, 561); 

    let userDir = process.env.USERPROFILE;
    let filePath = path.join(userDir, 'Downloads', 'certificadoPC.jpeg');
    let outputStream = fs.createWriteStream(filePath);
    
    let stream = canvas.createPNGStream();
    stream.pipe(outputStream);

    res.status(200).json({ message: 'Certificado obtido com sucesso.' });
    console.log(`Certificado obtido com sucesso. User: ${nomeUser}`);
  } catch (error) {
    console.error('Erro interno do servidor ', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.post('/cadastrarUsuario', async (req, res) => {
  let { email, senha, nome, dataNascimento } = req.body;
  try {
    let userRecord = await auth.createUser({
      email: email,
      password: senha
    });

    let userId = userRecord.uid;

    let userDocRef = db.collection('users').doc(userId);
    await userDocRef.set({
      nome,
      dataNascimento,
      email,
      guardarFase: 1,
      admin: false,
    });
   
    res.status(200).json({ message: 'Cadastro efetuado!' });
    console.log(`Cadastro efetuado! E-mail: ${email}`);
  } catch (error) {
    if (error.code == 'auth/email-already-exists') {
      res.status(409).json({ message: 'O e-mail já está cadastrado.' });
    } else if (error.code == 'auth/invalid-email') {
      res.status(400).json({ message: 'O e-mail não é válido.' });
    } else {
      console.error('Erro ao cadastrar o usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
});

app.post('/suporte', async (req, res) => {
  let { email, mensagem } = req.body;

  try {
    let dataFormatada = moment().format('YYYY-MM-DD HH:mm');

    let historicoRef = await db.collection('historico').add({
      email: email,
      mensagem: mensagem,
      data: dataFormatada,
      status: 'Pendente',
      respostaAdmin: ''
    });

    res.status(200).json({ id: historicoRef.id, message: 'Solicitação de suporte registrada com sucesso.' });
    console.log(`Solicitação de suporte registrada! E-mail: ${email}`);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.get('/suporte', async (req, res) => {
  try {
    let status = req.query.status; 

    let historicoRef = db.collection('historico');

    if (status && (status == 'Pendente' || status == 'Concluído')) {
      historicoRef = historicoRef.where('status', '==', status);
    }

    let querySnapshot = await historicoRef.get();
    
    let solicitacoes = [];

    querySnapshot.forEach(doc => {
      let data = doc.data();
      solicitacoes.push({
        id: doc.id,
        email: data.email,
        mensagem: data.mensagem,
        data: data.data,
        status: data.status,
      });
    });

    res.status(200).json({ solicitacoes: solicitacoes });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});


app.get('/suporte/:id', async (req, res) => {
  let id = req.params.id;

  try {
      let doc = await db.collection('historico').doc(id).get();

      if (!doc.exists) {
          res.status(404).json({ error: 'Solicitação não encontrada.' });
          return;
      }

      let data = doc.data();
      let solicitacao = {
          id: doc.id,
          email: data.email,
          mensagem: data.mensagem,
          data: data.data,
          status: data.status,
          respostaAdmin: data.respostaAdmin
      };

      res.status(200).json(solicitacao);
  } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});





app.post('/responderSolicitacao', async (req, res) => {
  let id = req.body.id;
  let respostaAdmin = req.body.respostaAdmin;
  let email = req.body.email;

  try {
    await db.collection('historico').doc(id).update({
      respostaAdmin: respostaAdmin,
      status: "Concluído"
    });

    let elasticEmailApiKey = '1636C34D6A92F42F1AE1FABA9322DF22A48F0AF2E7FB6015BD417073C580B93E52496703F33D59848DFEC2BB95C0EA82';
    let elasticEmailApiUrl = 'https://api.elasticemail.com/v2/email/send';

    let emailData = {
      apiKey: elasticEmailApiKey,
      to: email,
      subject: 'Resposta a sua solicitação de suporte PlayCode',
      bodyText: `${respostaAdmin} \n\n\n Link para não receber mais essas mensagens: `,
      from: 'tgplaycode@gmail.com',
      fromName: 'PlayCode',
    };

    let response = await axios.post(elasticEmailApiUrl, null, { params: emailData });

    if (response.data.success) {
      console.log(`E-mail enviado para ${email}.`)
      res.status(200).json({ message : 'E-mail enviado!' });
    } else {
      console.error('Falha ao enviar e-mail:', response.data.error);
    } 
  } catch (error) {
    console.error('Erro ao enviar resposta:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.post('/excluirSolicitacao', async (req, res) => {
  let id = req.body.id;

  try {
      await db.collection('historico').doc(id).delete();
      res.status(200).json({ message: 'Solicitação excluída com sucesso.' });
  } catch (error) {
      console.error('Erro ao excluir solicitação:', error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

async function obterDadosUser(userId) {
  try {
    let userDocRef = db.collection('users').doc(userId); 
    let userDoc = await userDocRef.get();

    let userData = userDoc.data();
    return userData.nome; 
  } catch (error) {
    console.log("error: ", error);
    return false;
  }
}

let port = 10000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


