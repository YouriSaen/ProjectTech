
//Loads Express module
const express = require('express');
const app = express();
const port = 3000;

//Loads the handlebars module
const handlebars = require('express-handlebars');

//Sets our app to use the handlebars engine
app.set('view engine', 'hbs');


app.use(express.static('public'));

//Sets handlebars configurations (we will go through them later on)
app.engine('hbs', handlebars.engine({
layoutsDir: __dirname + '/views/layouts',
extname: 'hbs',
defaultLayout: 'planB',
partialsDir: __dirname + '/views/partials/'
}));


app.get('/', (req, res) => {
res.render('main', {layout: 'index'});
});


app.listen(port, () => console.log(`App listening to port ${port}`));