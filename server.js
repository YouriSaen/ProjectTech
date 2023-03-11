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

global.getData = getData;


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

// Functions

function makeDays(){
    const morningSpace = document.querySelector(".morningSpace")
const middaySpace = document.querySelector(".middaySpace");
const eveningSpace = document.querySelector(".eveningSpace");


function createSpaceMorning(){
    const morningSpaceActivities = document.createElement('div');
    morningSpaceActivities.className = 'activitiesSpaceMorning';
    morningSpace.appendChild(morningSpaceActivities);
}

function createSpaceMidday(){
    const middaySpaceActivities = document.createElement('div');
    middaySpaceActivities.className = 'activitiesSpaceMidday';
    middaySpace.appendChild(middaySpaceActivities);
}

function createSpaceEvening(){
    const eveningSpaceActivities = document.createElement('div');
    eveningSpaceActivities.className = 'activitiesSpaceEvening';
    eveningSpace.appendChild(eveningSpaceActivities);
}

for(i = 0; i < 7; i++){
    createSpaceMorning();
    createSpaceMidday();
    createSpaceEvening();
} 
}




// routes
app.get('/', (req, res) => {
    res.render('main', { layout: 'index' });
    makeDays();
});

app.get('/activities', async (req, res) => {
    res.render('activities', { layout: 'activities' });
    getData();
    
});

app.listen(port, () => console.log(`App listening to port ${port}`));