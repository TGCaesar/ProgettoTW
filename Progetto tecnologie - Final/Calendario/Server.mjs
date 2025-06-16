import {
  User,
  Day,
  Today,
  Evento,
  Attivita,
  Week,
} from "./views/Calendario.js";
import { MongoClient } from "mongodb";
import express from "express";
const app = express();
app.use(express.static("public"));

/*=====================================
            PARTE MONGODB
=====================================*/

const database = "ProgettoTW";
const collection = "Eventi e note";
const url = "mongodb+srv://bolly1e:Pasword.0@cluster0.03v4v.mongodb.net/";
const client = new MongoClient(url);
const db = client.db(database);
const coll = db.collection(collection);

async function newUser(name) {
  // Crea un nuovo user (vedi Caledario.js)
  const user = new User();
  try {
    await client.connect();
    await coll.insertOne({ User: user, name: [name] });
  } finally {
    await client.close();
  }
}

async function getUser(name) {
  // Ritorna user
  try {
    await client.connect();
    return await coll.findOne({ name: name });
  } finally {
    await client.close();
  }
}

async function updateEvents(name, day, eventi) {
  // Aggiorna gli eventi dell'user, eventi deve essere un array di obj Evento (vedi Calendario.js)
  try {
    await client.connect();
    await coll.updateOne(
      { name: name },
      {
        $set: {
          [`User.grid.decade.${day.y - 2024}.year.${day.m - 1}.month.${
            day.d - 1
          }.eventi`]: eventi,
        },
      }
    );
  } finally {
    await client.close();
  }
}

async function updateNotes(name, day, newNotes) {
  // Aggiorna note, new Notes deve essere una String
  try {
    await client.connect();
    await coll.updateOne(
      { name: name },
      {
        $set: {
          [`User.grid.decade.${day.y - 2024}.year.${day.m - 1}.month.${
            day.d - 1
          }.note`]: newNotes,
        },
      }
    );
  } finally {
    await client.close();
  }
}

async function updateAct(name, day, act) {
  // Aggiorna le attivita', act e' un array di obj Attivita'(vedi Calendario.js)
  try {
    await client.connect();
    await coll.updateOne(
      { name: name },
      {
        $set: {
          [`User.grid.decade.${day.y - 2024}.year.${day.m - 1}.month.${
            day.d - 1
          }.act`]: act,
        },
      }
    );
  } finally {
    await client.close();
  }
}

async function addAct(name, newAct) {
  // Inserisce nuova/e attivita', newAct e' un obj:{inizio: obj Day(), fine: obj Day(), desc: String}. 
  // Per dettagli su Day() vedere Calendario.js
  try {
    let d1 = newAct.i.d;
    let m1 = newAct.i.m;
    let y1 = newAct.i.y;
    let date1 = new Date(y1, m1, d1);
    let day1 = new Day(d1, m1, y1);

    let d2 = newAct.f.d;
    let m2 = newAct.f.m;
    let y2 = newAct.f.y;
    let date2 = new Date(y2, m2, d2);
    date2.setDate(date2.getDate() + 1); //perche' deve essere modificato anche il giorno date2 stesso
    d2 = date2.getDate();
    m2 = date2.getMonth();
    y2 = date2.getFullYear();
    let day2 = new Day(d2, m2, y2);

    let actual = new Day(1, 1, 1);
    while (date1.toDateString() != date2.toDateString()) {
      //chatGPT, per comparare date senza tempo
      day1 = new Day(date1.getDate(), date1.getMonth(), date1.getFullYear());
      actual = await fetchAct(name, day1);
      await client.connect();
      for (let i = 0; i < 6; i++) {
        if (actual[i].i == "") {
          actual[i].i = { d: day1.d, m: day1.m, y: day1.y };
          actual[i].f = { d: day2.d, m: day2.m, y: day2.y };
          actual[i].desc = newAct.desc;
          await coll.updateOne(
            { name: name },
            {
              $set: {
                [`User.grid.decade.${day1.y - 2024}.year.${day1.m - 1}.month.${
                  day1.d - 1
                }.act`]: actual,
              },
            }
          );
          break;
        }
      }
      date1.setDate(date1.getDate() + 1);
    }
  } finally {
    await client.close();
  }
}

async function fetchDay(name, day) {
  // Ritorna giorno, day e' un obj Day()
  try {
    await client.connect();
    var f = await coll.findOne({ name: name });
  } finally {
    await client.close();
  }
  return await f.User.grid.decade[day.y - 2024].year[day.m - 1].month[
    day.d - 1
  ];
}

async function fetchWeek(name, day, w) {
  // Ritorna settimana, w e' il numero della settimana (vedi Calendario.js)
  try {
    await client.connect();
    var f = await coll.findOne({ name: name });
  } finally {
    await client.close();
  }
  let date = new Date(day.y, day.m, day.d);
  let week = { days: new Array(7), w: w, m: day.m, y: day.y };
  for (let i = 0; i < 7; i++) {
    week.days[i] = {
      d: date.getDate(),
      m: date.getMonth(),
      y: date.getFullYear(),
      eventi:
        f.User.grid.decade[day.y - 2024].year[day.m - 1].month[
          date.getDate() - 1
        ].eventi,
      act: f.User.grid.decade[day.y - 2024].year[day.m - 1].month[
        date.getDate() - 1
      ].act,
    };
    date.setDate(date.getDate() + 1);
  }
  return week;
}

async function fetchEvents(name, day) {
  // Ritorna eventi del giorno day
  try {
    await client.connect();
    var f = await coll.findOne({ name: name });
  } finally {
    await client.close();
  }
  return await f.User.grid.decade[day.y - 2024].year[day.m - 1].month[day.d - 1]
    .eventi;
}

async function fetchNote(name, day) {
  // Ritorna note del giorno day
  try {
    await client.connect();
    var f = await coll.findOne({ name: name });
  } finally {
    await client.close();
  }
  return await f.User.grid.decade[day.y - 2024].year[day.m - 1].month[day.d - 1]
    .note;
}

async function fetchAct(name, day) {
  // Ritorna attivita' del giorno day
  try {
    await client.connect();
    var f = await coll.findOne({ name: name });
  } finally {
    await client.close();
  }
  return await f.User.grid.decade[day.y - 2024].year[day.m - 1].month[day.d - 1]
    .act;
}

//=============================================================================================

/*=====================================
            PARTE SERVER
=====================================*/

import bodyParser from "body-parser";
const server = express();
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.set("view engine", "ejs");

let user = "Gio"; 

// Provvisorio, devi assegnarli il nome dell'user che ha fatto l'accesso. Quindi costruire una cosa tipo: 
// if thereIsUser(user): come sotto; else newUser(user);

server.get("/views/Mese", (req, res) => {
  res.render("Mese");
});

server.get("/:user/week", async (req, res) => {
  // Ritorna eventi utente del giorno (d, m, y)
  const user = req.params.user;
  const d = req.query.d;
  const m = req.query.m;
  const y = req.query.y;
  const w = req.query.w;
  let day = new Day(d, m, y);
  res.json({ week: await fetchWeek(user, day, w) });
});

server.get("/:user/eventi", async (req, res) => {
  // Ritorna eventi utente del giorno (d, m, y)
  const user = req.params.user;
  const d = req.query.d;
  const m = req.query.m;
  const y = req.query.y;
  let day = new Day(d, m, y);
  res.json({ eventi: await fetchEvents(user, day) });
});

server.post("/:user/eventi", async (req, res) => {
  // Modifica o inserisce eventi del giorno (d, m, y)
  // Vedi addAct per scelte implementative
  const user = req.params.user;
  const d = req.query.d;
  const m = req.query.m;
  const y = req.query.y;
  let day = new Day(d, m, y);
  if (req.body.mdEvent || req.body.rmEvent) {
    let e = req.body.eventi;
    await updateEvents(user, day, e);
  } else if (req.body.inEvent) {
    let date = req.body.day; 
    let date1 = req.body.day1; 
    date1 = new Date(date1); 
    let date2 = req.body.day2; 
    date2 = new Date(date2); 
    date2.setDate(date2.getDate() + 1); 
    let m = req.body.mese; //Int
    let y = req.body.anno; //Int
    let i = req.body.inizio; //Ora
    let f = req.body.fine; //Ora
    let t = req.body.titolo;
    let desc = req.body.desc;
    let type = req.body.type; //0=evento singolo, 1=frequenza, 2=ogni primo lunedi'
    let arrOfDays = req.body.arrOfDays;
    if (type == 0) {
      date = new Day(
        parseInt(date.slice(8, 10)),
        parseInt(date.slice(5, 7)),
        parseInt(date.slice(0, 4))
      ); //Ora e' Day
      let e = await fetchEvents(user, date);
      for (let j = 0; j < 6; j++) {
        if (e[j].i == "") {
          e[j].titolo = t;
          e[j].i = i;
          e[j].f = f;
          e[j].desc = desc;
          break;
        }
      }
      await updateEvents(user, date, e);
    } else if (type == 1) {
      while (date1.toDateString() != date2.toDateString()) {
        if (arrOfDays[date1.getDay()]) {
          //getDay() ritora 0 se dom,1 se lun,...
          day = new Day(
            date1.getDate(),
            date1.getMonth() + 1,
            date1.getFullYear()
          );
          let e = await fetchEvents(user, day);
          for (let j = 0; j < 6; j++) {
            if (e[j].i == "") {
              e[j].titolo = t;
              e[j].i = i;
              e[j].f = f;
              e[j].desc = desc;
              break;
            }
          }
          await updateEvents(user, day, e);
          console.log(await fetchDay(user, day));
        }
        date1.setDate(date1.getDate() + 1);
      }
    } else {
      //type=2
      let i = 1;
      day = new Day(i, m, y);
      while (!day.isMonday()) {
        i = i + 1;
        day = new Day(i, m, y);
      }
      let e = await fetchEvents(user, day);
      for (let j = 0; j < 6; j++) {
        if (e[j].i == "") {
          e[j].titolo = t;
          e[j].i = i;
          e[j].f = f;
          e[j].desc = desc;
          break;
        }
      }
      await updateEvents(user, day, e);
    }
  }
});

server.get("/:user/note", async (req, res) => {
  // Ritorna note utente del giorno (d, m, y)
  const user = req.params.user;
  const d = req.query.d;
  const m = req.query.m;
  const y = req.query.y;
  let day = new Day(d, m, y);
  res.json({ note: await fetchNote(user, day) });
});

server.post("/:user/note", async (req, res) => {
  // Modifica note del giorno (d, m, y)
  console.log("a");
  const user = req.params.user;
  const d = req.query.d;
  const m = req.query.m;
  const y = req.query.y;
  let day = new Day(d, m, y);
  let n = JSON.stringify(req.body.note);
  await updateNotes(user, day, n);
});

server.get("/:user/act", async (req, res) => {
  // Ritorna attivita' utente del giorno (d, m, y)
  const user = req.params.user;
  const d = req.query.d;
  const m = req.query.m;
  const y = req.query.y;
  let day = new Day(d, m, y);
  res.json({ act: await fetchAct(user, day) });
});

server.post("/:user/act", async (req, res) => {
  // Modifica, aggiunge o rimuove attivita' del giorno (d, m, y)
  const user = req.params.user;
  const d = req.query.d;
  const m = req.query.m;
  const y = req.query.y;
  let day = new Day(d, m, y);
  let act = req.body.act;
  if (req.body.mdAct || req.body.rmAct) {
    await updateAct(user, day, act);
  } else if (req.body.inAct) {
    await addAct(user, act);
  }
});

server.use(express.static("."));

server.listen(3000, () => {
  console.log("ready");
});
