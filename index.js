const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const { response } = require('express');
const app = express();
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.d5s5i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travelAgency');
        const userCollection = database.collection('destination');
        const packageCollection = database.collection('packages');
        const tourBookingCollection = database.collection('tourBooking');

        app.get('/', (req, res) => {
            res.send("Hello I am Working!!!");
        })
        // tesgin purpose 

        //   app.get('/users' , async(req , res) =>{
        //       const userInfo = userCollection.find({});
        //       const userInfos = await userInfo.toArray()
        //       res.send(userInfos)
        //   })

        // app.post('/packages', async (req, res) => {
        //     const data = req.body;
        //     const userData = await packageCollection.insertMany(data)
        //     res.send(userData)
        // })

        // get destination Data

        app.get('/destination', async (req, res) => {
            const data = userCollection.find({});
            const destinationData = await data.toArray();
            res.send(destinationData)
        })

        // get destination single data

        app.get('/destination/:name', async (req, res) => {
            const destinationId = req.params.name;
            // const getId  = {_id: ObjectId(destinationId)}
            const getName = { name: destinationId }
            const getSingleDestination = await userCollection.findOne(getName)
            res.send(getSingleDestination);
        })

        // get packages data

        app.get('/packages', async (req, res) => {
            const packagesData = packageCollection.find({});
            const package = await packagesData.toArray();
            res.send(package);
        })

        // load single package data

        app.get("/packages/:name", async (req, res) => {
            const packageName = req.params.name;
            const getPackageName = { name: packageName }
            const getSinglePackage = await packageCollection.findOne(getPackageName)
            res.send(getSinglePackage);
        })

        // post tour booking Data 

        app.post('/tour-booking', async (req, res) => {
            const tourBookingData = req.body;
            const tourBooking = await tourBookingCollection.insertOne(tourBookingData)
            res.send(tourBooking);
        })

        // get Tour data 

        app.get('/tour-booking', async (req, res) => {
            const tourData = tourBookingCollection.find({ email: req.query.email });
            const tour = await tourData.toArray();
            res.send(tour);
        })

        // delete Tour data 

        app.delete('/tour-booking/:id', async(req, res) => {
            const userId = req.params.id;
            const userObjectId = { _id: ObjectId(userId) }
            const deleteUser = await tourBookingCollection.deleteOne(userObjectId)
            res.send(deleteUser)
        })


    } finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Listing the address http://localhost:${port}`)
})