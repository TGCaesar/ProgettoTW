const express = require('express')
var bodyparser = require('body-parser')
const app = express()
const port = 6060
const { MongoClient, ServerApiVersion, Db } = require('mongodb');
const bodyParser = require('body-parser')

//inserire qui l'uri di mongodb
const uri = "###";


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());




app.post('/signup', (req, res) => {
  console.log("signup");
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }

  });



  async function run() {
    var data
    try {
      //inserire il database e collection desiderati
      const collection = client.db("###").collection("###")
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      let success = false;
      let query = {
        username: req.body.username
      }
      let acc = await collection.findOne(query)
      if(!acc) {
        success=true
        await collection.insertOne(req.body)
      }
      console.log(success)
      console.log(req.body)
      res.send(success)
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);

})

app.post('/login', (req, res) => {
    console.log("login");
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
  
    });
  
    async function run() {
      var data
      try {
        //inserire il database e la collection desiderati
        const collection = client.db("###").collection("###")
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        let success = false;
        let query = {
          username: req.body.username,
        }
        let acc = await collection.findOne(query)
        if(acc) {
            acc.success = false
            if (acc.password == req.body.password) {
                //codice che si esegue se l'account esiste e la password è giusta
                acc.success = true
                console.log("success")
                res.send(acc)
            } else {
                //codice che si esegue se l'account esiste ma la password è sbagliata
                console.log("wrong password")
                res.send( {
                    success: false
                })
            }
        } else {
            //codice che si esegue se l'account non è esiste
            console.log("failure")
            res.send(null)
        }
      } finally {
        await client.close();
      }
    }
    run().catch(console.dir);
  
  })

app.listen(port, () => {
})
