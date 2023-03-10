require('dotenv').config();
//Loads Express module
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


//Loads the handlebars module
const handlebars = require('express-handlebars');
const { MongoClient, ServerApiVersion} = require('mongodb');

const uri =
    "mongodb+srv://" +
    process.env.DB_USERNAME +
    ":" +
    process.env.DB_PASS +
    "@" +
    process.env.DB_NAME +
    "." +
    process.env.DB_HOST +
    "/" +
    "?tls=true&retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })

// client.connect()
//     .then((res) => console.log('@@-- connection established', res))
//     .catch((err) => console.log('@@-- error', err));


client.connect()
    .then((res) => console.log('@@-- connection established', res))
    .catch((err) => console.log('@@-- error', err));


async function getData(){
    const collection = await client.db('calenderdb').collection('activities');
    const docs = await collection.find().toArray();
    console.log(docs);
}



//Sets our app to use the handlebars engine
app.set('view engine', 'hbs');
app.use(express.static('public'));
//Sets handlebars configurations (we will go through them later on)
app.engine('hbs', handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'index',
    partialsDir: __dirname + '/views/partials/'
}));


app.get('/', (req, res) => {
    res.render('main', { layout: 'index' });
});

app.get('/activities', async (req, res) => {
    res.render('activities', { layout: 'activities' });
    getData();
    
});

app.listen(port, () => console.log(`App listening to port ${port}`));