const express = require('express')
var bodyparser = require('body-parser')
const app = express()
const port = 5050
const { MongoClient, ServerApiVersion, Db, ObjectId } = require('mongodb');
const bodyParser = require('body-parser')

const { marked } = require('marked');
const { type } = require('jquery');

//inserire qui l'uri di mongodb
const uri = "#";


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.post('/create', (req, res) => {
  console.log("create");
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }

  });



  async function run() {
    try {
      const collection = client.db("UserData").collection("Notes")
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      let now = Date.now()
      let query = {
        type: req.body.type,
        body: req.body.body,
        title: req.body.title,
        length: req.body.body.length,
        create_date: now,
        last_change: now,
        creator: req.body.user,
        labels: req.body.labels,
        list: req.body.list,
        permission: req.body.permission,
        whitelist: req.body.whitelist
      }
      console.log(req.body)
      
        // Caso in cui ci sia un evento da inserire nel calendario (guarda in req.body.list[i].expiry per ogni i)
        if (query.type){
        for (let i = 0; i<req.body.list.length; i++) {
          if (req.body.list[i].expiry) {

          }
        }
      }
      await collection.insertOne(query)
      doc = await collection.findOne(query)
      console.log(doc._id)
      res.send(doc._id)
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);

})



app.post('/update', (req, res) => {
  console.log('update')
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  })
  async function run () {
    try {
      const collection = client.db("UserData").collection("Notes")
      console.log(req.body.id)
      const updateDoc = {
        $set: {
          body: req.body.body,
          title: req.body.title,
          length: req.body.body.length,
          last_change: Date.now(),
          list: req.body.list,
          labels: req.body.labels,
          permission: req.body.permission,
          whitelist: req.body.whitelist
        }
      }
      document = await collection.findOne({ _id: new ObjectId(`${req.body.id}`) })
      if (document.list.length==req.body.list.length) {
      // Controllo di Modifica se una scadenza è stata modificata
      if (req.body.type) {
        for (let i = 0; i<req.body.list.length; i++) {
          if (req.body.list[i].expiry!=document.list[i].expiry) {
            

            
          }
        }
      } else {
        // Caso in cui il la lunghezza della lista è diversa, il metodo sopra non funzionerebbe 



      }
    }
      const doc = await collection.updateOne({ _id: new ObjectId(`${req.body.id}`) },updateDoc)
      console.log(doc)
    } finally {
      await client.close()
    }
  }


  run().catch(console.dir)
})


app.post('/load', (req,res) => {
  console.log('load')
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
})
async function run() {
  const collection = client.db("UserData").collection("Notes")
  try {
    const query = req.body.query
    const options = req.body.options
    console.log (query)
    console.log(options)
    var items = []

    const doc = await collection.find(query,options).collation({locale:"en", caseLevel:true})

    for await (const nav of doc) {
      if (nav.creator == req.body.sender){
      items.push(nav)
    } else if (nav.permission == "public") {
      items.push(nav)
    } else if (nav.permission == "whitelist" && nav.whitelist) {
      if (nav.whitelist.includes(query.body.sender)) {
      items.push(nav)
    }
    }
  }
    res.send(items)
  } finally {
    await client.close()
  }
}

run().catch(console.dir)
})



app.post('/singledoc', (req, res) => {
  console.log("get one");
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }

  });

  async function run() {
    try {
      console.log(req.body)
      const collection = client.db("UserData").collection("Notes")
      const query = { _id: new ObjectId(`${req.body.id}`) }
      const doc = await collection.findOne(query)
      console.log(doc)
      res.send(doc)
    } finally {
      await client.close()
    }
  }
  run().catch(console.dir);

})


app.post('/delete', (req,res) => {
  console.log("delete");
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }

  });
  async function run () {
    try{
    const collection = client.db("UserData").collection("Notes")
    doc = await collection.findOne({_id: new ObjectId(`${req.body.id}`)})
    if (doc.type) {
    for (let i = doc.list.findIndex(expiry_check); i!=-1; i = doc.list.findIndex(expiry_check)) {
      // Caso in cui ci sia un evento da eliminare associato ad doc.list[i]
      
      
      
      
      delete doc.list[i]
    }
  }
    await collection.deleteOne(doc)
    res.send(true)
    } finally {
      await client.close
    }
  }
  run().catch(console.dir)
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



function expiry_check (value,index,array) {
  if (!value) {
    return null
  }
  if((value.expiry)) {
    if (value.done) {
      return null
    } else {
    return true
    }
  } else {
    return null
  }
}