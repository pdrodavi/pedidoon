const express = require('express')
const router = express.Router()

const firebase = require("firebase/app")
require('firebase/auth')
require('firebase/database')

// env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\Pedro Davi\github\pedidoon\ipedidoon-firebase-adminsdk-d0sfr-a2d8b6ea6f.json"

require('dotenv').config();

let firebaseConfig = {
  apiKey: `${process.env.API_KEY}`,
  authDomain: `${process.env.AUTH_DOMAIN}`,
  projectId: `${process.env.PROJECT_ID}`,
  databaseURL: `${process.env.URL_DB}`,
  storageBucket: `${process.env.STORAGE_B}`,
  messagingSenderId: `${process.env.MSG_SEND_ID}`,
  appId: `${process.env.APP_ID}`,
  measurementId: `${process.env.MEASURE_ID}`
};

firebase.initializeApp(firebaseConfig);

if (!firebase.apps.length) {
   firebase.initializeApp({});
}else {
   firebase.app(); // if already initialized, use that one
}

router.get('/', function(req, res, next) {
  res.render('logon', { title: 'Logon iPedidoon', error: '' });
});

router.post('/', function(req, res, next) {

    let email = req.body.email
    let password = req.body.password

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
            //res.render('logon', { error: 'LOGADO!!!!' });
            res.render('addpizza', { error: email });
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            res.render('logon', { error: errorMessage });
        });

});



router.get('/add', function(req, res, next) {
  //res.render('dashadmin', { title: 'Cadastrar Usuário', error: '' });
});

router.get('/add/pizza', function(req, res, next) {
  res.render('addpizza', { title: 'Add Pizza', error: '' });
});


function writeUserData(userId, pizza, valor, imageUrl) {
  firebase.database().ref('pizzas/' + userId).set({
    nome_pizza: pizza,
    valor_pizza: valor,
    pizza_picture : imageUrl
  });
}


router.post('/add/pizza', function(req, res, next) {

   //var database = firebase.database();

   let pizza = req.body.pizza
   let valor = req.body.valor
   let img = req.body.image

   var user = firebase.auth().currentUser;

   let userId;

   if (user != null) {
     userId = user.uid
   }

   writeUserData(userId, pizza, valor, img)

   res.render('addpizza', { title: 'Add Pizza', error: '' });

});

router.post('/add', function(req, res, next) {

});

router.get('/logout', function(req, res, next) {

    firebase.auth().signOut().then(() => {
        res.render('logon', { title: 'Logon', error: '' });
    }).catch((error) => {
        // An error happened.
    });

});

module.exports = router;
