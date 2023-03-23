require('dotenv').config();
//Loads Express module
const express = require('express');
var bodyParser = require('body-parser')
const http = require('http');
const session = require('express-session');
const app = express();
const server = http.createServer(app); 

const port = process.env.PORT || 3000;


//Loads the handlebars module
const handlebars = require('express-handlebars');
const {
    MongoClient,
    ServerApiVersion
} = require('mongodb');
const { css } = require('js-beautify');

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
})

// client.connect()
//     .then((res) => console.log('@@-- connection established', res))
//     .catch((err) => console.log('@@-- error', err));


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
//Sets handlebars configurations (we will go through them later on)
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
    const dbName = req.body.timespaceBtn;
    req.dbName = dbName;

    const activitiesCollection = await client.db('calenderdb').collection('activities');
    // const activities = await activitiesCollection.find().toArray();
    const query = {};
    const projection = {
        name: 1,
        _id: 0
    };
    const cursor = await activitiesCollection.find(query, projection).toArray();
    // const data = await cursor.toArray();
    console.log(cursor);
    const namesNmb = cursor.length;
    const names = cursor.map(data => data.name);
    // console.log(names);
    let a = [];
    cursor.map((elem) => a.push(elem.name));

    const activatedCollectionMorning = await client.db('calenderdb').collection('morning');
    const activatedCursorMorning = activatedCollectionMorning.find(query, projection);
    const activatedDataMorning = await activatedCursorMorning.toArray();
    const activatedNamesMorning = activatedDataMorning.map(activatedData => activatedData.name);
    const activatedNmbMorning = activatedNamesMorning.length;

    const activatedCollectionMidday  = await client.db('calenderdb').collection('midday');
    const activatedCursorMidday = activatedCollectionMidday.find(query, projection);
    const activatedDataMidday = await activatedCursorMidday.toArray();
    const activatedNamesMidday = activatedDataMidday.map(activatedData => activatedData.name);
    const activatedNmbMidday = activatedNamesMidday.length;

    const activatedCollectionEvening = await client.db('calenderdb').collection('evening');
    const activatedCursorEvening = activatedCollectionEvening.find(query, projection);
    const activatedDataEvening = await activatedCursorEvening.toArray();
    const activatedNamesEvening = activatedDataEvening.map(activatedData => activatedData.name);
    const activatedNmbEvening = activatedNamesEvening.length;

    // console.log(activities);
    res.render('activities', {
        layout: 'activities',
        activatedActivityMorning: activatedNamesMorning,
        activatedActivityMidday: activatedNamesMidday,
        activatedActivityEvening: activatedNamesEvening,
        activatedNmb: activatedNmbMorning,
        activity: a,
        namesLength: namesNmb
    })
});

const ObjectId = require('mongodb').ObjectId;

app.post('/post-db', (req, res) => {
    const dbName = req.body.timespaceBtn;
    req.dbName = dbName;
    res.redirect('/activities');
});


app.post('/post-name', (req, res) => {
    const name = req.body.activity;
    const dbName = req.dbName;
    console.log("READ THIS:::String", dbName);
    let activatedCollection = client.db('calenderdb').collection('morning');

    activatedCollection.insertOne({
        _id: new ObjectId(), // generate a new unique identifier for each document
        name
    }, (err, result) => {
        if (err) {
            console.error(err);
            client.close();
            return res.status(500).json({
                error: 'Failed to insert name'
            });
        }
        client.close();
        res.json({
            message: 'Name inserted successfully'
        });
    });

    res.redirect('/activities');
});

app.get('/deleteData', function(req, res) {
    const deleteName = req.body.deleteName;
    const activatedCollection = client.db('calenderdb').collection('midday');
    // console.log('Deleted data with ID ' + deleteName);
    activatedCollection.deleteOne({
        deleteName
    }, function(err, result) {
        if (err) throw err;
        // console.log('Deleted data with ID ' + deleteName);

    });
    res.redirect('/activities');
});

app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
  })
app.listen(port, () => console.log(`App listening to port ${port}`));