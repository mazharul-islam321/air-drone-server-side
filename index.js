const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lw2vc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db("air_Drone");
        const droneCollection = database.collection("drones");
        const orderCollection = database.collection("order");

        // Post api
        app.post("/products", async (req, res) => {
            const drone = req.body;
            const result = await droneCollection.insertOne(drone);
            // console.log("A document was inserted with the _id:", result);
            res.json(result);
        });

        // get api for all data
        app.get("/products", async (req, res) => {
            const cursor = droneCollection.find({});
            const allProducts = await cursor.toArray();
            res.send(allProducts);
        });

        //get api for a single data
        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleOrderInfo = await droneCollection.findOne(query);
            // console.log(singleOrderInfo);
            res.send(singleOrderInfo);
        });
        // post api for place order
        app.post("/orders", async (req, res) => {
            const placeOrder = req.body;
            const result = await orderCollection.insertOne(placeOrder);
            // console.log("A document was inserted with the _id:", result);
            res.json(result);
        });
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Air Drone World!");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
