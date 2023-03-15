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



//Sets our app to use the handlebars engine
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
//Sets handlebars configurations (we will go through them later on)
app.engine('hbs', handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'index',
    partialsDir: __dirname + '/views/partials/'
}));

// routes
app.get('/', (req, res) => {
    res.render('main', { layout: 'index' });
});

app.get('/activities', async (req, res) => {
    const activitiesCollection = await client.db('calenderdb').collection('activities');
    // const activities = await activitiesCollection.find().toArray();
    const query = {};
    const projection = { name: 1, _id: 0 };
    const cursor = activitiesCollection.find(query, projection);
    const data = await cursor.toArray();
    const namesNmb = data.length;
    const names = data.map(data => data.name);
    // console.log(names);
    let a = {};

    for (var i = 0; i < data.length; i++) {
       a = names[i]
    }
    // console.log(a);



    const activatedCollection = await client.db('calenderdb').collection('morning');
    const activatedCursor = activatedCollection.find(query,projection);
    const activatedData = await activatedCursor.toArray();
    const activatedNames = activatedData.map(activatedData => activatedData.name);
    const activatedNmb = activatedNames.length;

    // console.log(activities);
    res.render('activities', { 
        layout: 'activities',
        activatedActivity: activatedNames,
        activatedNmb: activatedNmb,
        activity: a,
        namesLength: namesNmb
    })
    
});

app.post('/post-name', (req, res) => {
    let collectionTimespace = JSON.stringify(req.body.timespaceBtn);
    console.log(collectionTimespace);
    const activitiesCollection = client.db('calenderdb').collection(collectionTimespace);
    const name = req.body.name;
  console.log('Name:', name);
      activitiesCollection.insertOne({ name }, (err, result) => {
        if (err) {
          console.error(err);
          client.close();
          return res.status(500).json({ error: 'Failed to insert name' });
        }
        client.close();
        res.json({ message: 'Name inserted successfully' });
      });
      res.redirect('/activities');
    });

app.get('/deleteData', function(req, res) {
    const deleteName = req.body.deleteName;
    const activatedCollection = client.db('calenderdb').collection('morning');
    console.log('Deleted data with ID ' + deleteName);
    activatedCollection.deleteOne({ deleteName }, function(err, result) {
      if (err) throw err;
      console.log('Deleted data with ID ' + deleteName);
      
    });
    res.redirect('/activities');
  });
app.listen(port, () => console.log(`App listening to port ${port}`));