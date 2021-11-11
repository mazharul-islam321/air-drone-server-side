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
        const usersCollection = database.collection("users");
        const reviewCollection = database.collection("review");

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
        // delete api for my products
        app.delete("/products/:id", async (req, res) => {
            const droneId = req.params.id;
            const query = { _id: ObjectId(droneId) };
            const deleteAnDrone = await droneCollection.deleteOne(query);
            // console.log(deleteAnDrone);
            res.json(deleteAnDrone);
        });
        // post api for place order
        app.post("/orders", async (req, res) => {
            const placeOrder = req.body;
            const result = await orderCollection.insertOne(placeOrder);
            // console.log("A document was inserted with the _id:", result);
            res.json(result);
        });

        // get api for place order
        app.get("/orders/:email", async (req, res) => {
            const email = req.params.email;
            const myOrder = await orderCollection.find({ email }).toArray();
            // console.log(myOrder);
            res.send(myOrder);
        });

        // get api for all order
        app.get("/orders", async (req, res) => {
            const manageorder = await orderCollection.find({}).toArray();
            // console.log(manageorder);
            res.send(manageorder);
        });

        // delete api for my order
        app.delete("/orders/:id", async (req, res) => {
            const orderId = req.params.id;
            const query = { _id: ObjectId(orderId) };
            const deleteAnOrder = await orderCollection.deleteOne(query);
            // console.log(deleteAnOrder);
            res.json(deleteAnOrder);
        });
        // update api for status
        app.put("/orders/:id", async (req, res) => {
            const statusId = req.params.id;
            const updatedStatus = req.body;
            // console.log(updatedStatus);
            const filter = { _id: ObjectId(statusId) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedStatus.status,
                },
            };
            const approvedStatus = await orderCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            // console.log(approvedStatus);
            res.json(approvedStatus);
        });

        // post api for user
        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            // console.log(result);
            res.json(result);
        });

        // put api for user
        app.put("/users", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            res.json(result);
        });

        // put api for creating admin
        app.put("/users/admin", async (req, res) => {
            const user = req.body;
            // console.log(user);
            const filter = { email: user.email };
            const updateDoc = { $set: { role: "admin" } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        // get api for admin panel
        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            // console.log(user);
            let isAdmin = false;
            if (user?.role === "admin") {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });

        // post api for review
        app.post("/reviews", async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            // console.log(result);
            res.json(result);
        });

        // get api for all data
        app.get("/reviews", async (req, res) => {
            const allReview = await reviewCollection.find({}).toArray();
            // console.log(allReview);
            res.send(allReview);
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
