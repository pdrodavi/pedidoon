const { config, engine } = require('express-edge')
const express = require('express')
const edge = require('edge.js')
const path = require('path')
const cors = require('cors');

require('dotenv').config();

// protect
const helmet = require('helmet')
const cookieParser = require('cookie-parser')

// logger
const logger = require('./utils/loggerWinston')
const morgan = require('morgan')

const app = express()

// view engine setup
edge.registerViews(path.join(__dirname, '/views'))
app.use(engine)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'edge')
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))


//app.use((req, res, next) => { //Cria um middleware onde todas as requests passam por ele
//    if ((req.headers["x-forwarded-proto"] || "").endsWith("http")) //Checa se o protocolo informado nos headers é HTTP
//        res.redirect(`https://${req.headers.host}${req.url}`); //Redireciona pra HTTPS
//    else //Se a requisição já é HTTPS
//        next(); //Não precisa redirecionar, passa para os próximos middlewares que servirão com o conteúdo desejado
//})

// protect
app.use(helmet());
app.disable('x-powered-by');

app.use(helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
}))

// routes
const indexRouter = require('./routes/home')
const adminRouter = require('./routes/admin')
app.use('/', indexRouter)
app.use('/admin', adminRouter)

// rota response 404
app.use(function(req, res) {
    res.status(404)
    res.render('index', { title: '404' });
    //res.render('404')
})

app.listen(process.env.PORT || 3000, () => {
    logger.info(`Server listening on port ${process.env.PORT}`);
})
