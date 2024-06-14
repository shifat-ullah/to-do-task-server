const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
app.use(cors())

//to-do-task
// QC4xwDEHPtj9XylK



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://to-do-task:QC4xwDEHPtj9XylK@cluster0.nxcosv7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const userCollection = client.db('to-do-task').collection('user');
        const taskCollection = client.db('to-do-task').collection('tasks');


        app.put('/users/:email', async (req, res) => {
            const user = req.body;
            const email = req.params.email
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    user
                },
            };

            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })


        // task

        app.post('/api/tasks', async (req, res) => {
            const formData=req.body;
            const result =await taskCollection.insertOne(formData);
            console.log(result);
            res.send(result)
          });


          app.get('/api/tasks', async (req, res) => {
            const tasks = await taskCollection.find().toArray();
            res.json(tasks);
          });

          app.put('/api/tasks/:id', async (req, res) => {
            const taskId = req.params.id;
            const { status } = req.body;
        
            const updateStatus = { $set: { status: status } };
        
            try {
                const result = await taskCollection.updateOne({ _id: new ObjectId(taskId) }, updateStatus);
                if (result.matchedCount === 0) {
                    res.status(404).send({ error: 'Task not found' });
                } else {
                    res.send(result);
                }
            } catch (err) {
                console.error(err);
                res.status(500).send({ error: 'An error has occurred' });
            }
        });
        
        
        
          
          app.delete('/api/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const result = await taskCollection.deleteOne(query);
            console.log(result)
            res.send(result)
          });





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})