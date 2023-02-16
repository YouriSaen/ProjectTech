// var http = require('http')

// http.createServer(onrequest).listen(8000)

// function onreqeust(req, res){
//     res.statusCode = 200
//     resizeTo.setHeader('Content-Type','text/html')
//     res.send('Hello World!/n')
// }

const express = require('express')

express()
    .get('/',onhome)
    .listen(8000)

    function onhome(req,res){
        res.send('<h1>Hello Client</h1>/n')
    }