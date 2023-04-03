//Loads Express module
const express = require('express');
var bodyParser = require('body-parser')
const session = require('express-session');
const app = express();

// dot ENV
require('dotenv').config();

// 
const Handlebars = require('handlebars');
const handlebars = require('express-handlebars');

// API
const axios = require('axios');






const port = process.env.PORT || 3000;

// MongoDB
const {
    MongoClient,
    ServerApiVersion
} = require('mongodb');

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

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});


client.connect()
    .then((res) => console.log('@@-- connection established', res))
    .catch((err) => console.log('@@-- error', err));


//Sets our app to use the handlebars engine
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.json());   
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true
  }));
//Sets handlebars configurations
app.engine('hbs', handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'index',
    partialsDir: __dirname + '/views/partials/'
}));

// routes
app.get('/', (req, res) => {
    res.render('main', {
        layout: 'index'
    });
});

app.get('/activities', async (req, res) => {
    const hours = new Date().getHours()
    console.log(hours);
    const activitiesCollection = await client.db('calenderdb').collection('activities');
    const query = {};
    const projection = {
        name: 1,
        timeOfDay: 1,
        _id: 0
    };
    const cursor = await activitiesCollection.find(query, projection).toArray();

    const activatedCollection = await client.db('calenderdb').collection('activities');
    const activatedCursor = activatedCollection.find(query, projection);
    const activatedData = await activatedCursor.toArray();
    const timeOfDay = activatedData.map(activatedData => activatedData.timeOfDay);
    const activity = activatedData.map(activatedData => activatedData.name);

    const morningActivities = activatedData.filter(data => data.timeOfDay === 'morning');
    const middayActivities = activatedData.filter(data => data.timeOfDay === 'midday');
    const eveningActivities = activatedData.filter(data => data.timeOfDay === 'evening');
    console.log(middayActivities);

    const params = {
        access_key: '408856757f28ef5526a9f87e23fced8a',
        query: 'Amsterdam, The Netherlands'
      }
      
      const response = await axios.get('http://api.weatherstack.com/current', {params});
    const apiResponse = response.data;
    const weatherResponse =`Current temperature in ${apiResponse.location.name} is ${apiResponse.current.temperature}℃`;

    console.log("READ THIS::::WEATHER",weatherResponse);

    res.render('activities', {
      layout: 'activities',
      activatedActivity: activity,
      timeOfDay: timeOfDay,
      activity: activity,
      morningActivities: morningActivities,
      middayActivities: middayActivities,
      eveningActivities: eveningActivities,
      weatherResponse: weatherResponse
    });
});

app.get('/chooseTime', (req, res) => {

    const name = req.body.activity;
    console.log("READ THIS::::", name);
    res.render('choosetime', {
        layout: 'activities',
        activity: name
    })
});


app.post('/update', async (req, res) => {
    const activity = req.body.activity; // get the button value from the request body
    const timeOfDay = req.body.timeOfDay;
    const activitiesCollection = await client.db('calenderdb').collection('activities');
    console.log(timeOfDay, "<Timeoday", "activity>", activity);
    await activitiesCollection.updateOne({ name: activity }, { $set: { timeOfDay: timeOfDay } }); // update the timeOfDay field of the document with the given name
    res.redirect('/activities');
  });

app.post('/unsetTime', async function(req, res) {
    const deleteName = req.body.activity;
    const activitiesCollection = client.db('calenderdb').collection('activities');
    await activitiesCollection.updateOne({ name: deleteName }, { $unset: { timeOfDay: null } });
    res.redirect('/activities');
});

app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
  })
app.listen(port, () => console.log(`App listening to port ${port}`));