// //server
// var http = require('http');

// http.createServer(onrequest).listen(5500);

// function onreqeust(req, res){
//     res.statusCode = 200;
//     resizeTo.setHeader('Content-Type','text/html');
//     res.send('Hello World!/n');
// }

//routes
const Handlebars = require("handlebars");
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5500
const chalk = require('chalk');

//const compression = require('compression');

// express()
//     .get('/',onHome)
//     .get('/about',onabout)
//     .listen(5500);
app.set('view engine', 'handlebars')
app.set('views','view')
app.get('/',onHome);
app.get('/about',onAbout);

app.listen(PORT, () => console.log(chalk.blue('Running on port: ${PORT}')));


    function onHome(req,res){
        res.send('hefkjhki');
    }

    function onAbout(req,res){
        res.render('views/index')
    }