// // //server
// // var http = require('http');

// // http.createServer(onrequest).listen(5500);

// // function onreqeust(req, res){
// //     res.statusCode = 200;
// //     resizeTo.setHeader('Content-Type','text/html');
// //     res.send('Hello World!/n');
// // }

// //express
// const express = require('express');
// const app = express();

// //opens port
// const PORT = process.env.PORT || 5500

// //Chalk for making stuffy ~~pretty~~
// const chalk = require('chalk');

// //Loads the handlebars module
// const handlebars = require('express-handlebars');

// //Sets our app to use the handlebars engine
// app.set('view engine', 'handlebars');

// //Sets handlebars configurations (we will go through them later on)
// app.engine('handlebars', handlebars({
// layoutsDir: __dirname + '/views/layouts',
// }));
// app.use(express.static('public'))
// app.get('/', (req, res) => {
// //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
// res.render('main', {layout : 'index'});
// });



// //const compression = require('compression');

// // express()
// //     .get('/',onHome)
// //     .get('/about',onabout)
// //     .listen(5500);

// //Routes
// app.set('view engine', 'handlebars')
// app.set('views','view')
// app.get('/',onHome);
// app.get('/about',onAbout);

//   app.listen(port, () => console.log(`App listening to port ${port}`));

    



const express = require('express');
const app = express();
const port = 3000;
//Loads the handlebars module
const handlebars = require('express-handlebars');

//Sets our app to use the handlebars engine
app.set('view engine', 'handlebars');
//Sets handlebars configurations (we will go through them later on)
app.engine('handlebars', handlebars.engine({
layoutsDir: __dirname + '/views/layouts',
}));
app.use(express.static('public'))
app.get('/', (req, res) => {
//Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
res.render('main.handlebars', {layout : 'index'});
});

app.get('/about', (req, res) => {
  //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
  res.render('main.handlebars', {layout : 'about'});
  });


app.listen(port, () => console.log(`App listening to port ${port}`));