const express = require('express')
const router = express.Router()

const firebase = require("firebase/app")
require('firebase/auth')

require('dotenv').config();

let firebaseConfig = {
  apiKey: `${process.env.API_KEY}`,
  authDomain: `${process.env.AUTH_DOMAIN}`,
  projectId: `${process.env.PROJECT_ID}`,
  storageBucket: `${process.env.STORAGE_B}`,
  messagingSenderId: `${process.env.MSG_SEND_ID}`,
  appId: `${process.env.APP_ID}`,
  measurementId: `${process.env.MEASURE_ID}`
};

router.get('/', function(req, res, next) {
  res.render('logon', { title: 'Logon iPedidoon', error: '' });
});

router.post('/', function(req, res, next) {

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    let email = req.body.email
    let password = req.body.password

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
            res.render('logon', { error: 'LOGADO!!!!' });
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            res.render('logon', { error: errorMessage });
        });

});

router.get('/logout', function(req, res, next) {

    firebase.auth().signOut().then(() => {
        res.render('logon', { title: 'Logon', error: '' });
    }).catch((error) => {
        // An error happened.
    });

});

module.exports = router;
