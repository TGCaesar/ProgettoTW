import { Today, Evento } from "../Calendario/Calendario";
const localhost = window.location.hostname;
var user


async function start() {
    // Non sono certo di questo codice, non posso testarlo facilmente quindi dovrai riverderlo tu
    if (localStorage.getItem("selfie-user")) {
        user = localStorage.getItem("selfie-user")
    } else if (sessionStorage.getItem("selfie-user")) {
        user = sessionStorage.getItem("selfie-user")
    } else {
        window.location.href = "../Index.html"
    }
    var events = []
    var acts = []
    var pomodoro
    let Tday = Today()
    await fetch(`http://${localhost}:3000/${user}/eventi?d=${Tday.d}&m=${Tday.m}&y=${Tday.y}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },

    })
        .then((response) => response.json())
        .then(async (response) => {
            events = response.eventi;
        });
    await fetch(
          `http://${localhost}:3000/${user}/act?d=${Tday.d}&m=${Tday.m}&y=${Tday.y}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then(async (response) => {
            acts = response.act;
          });
          // Inserisci quà la richiesta per il pomodoro



          for (let i = 0; i<events.length;i++) {
            let card = document.createElement("div")
            card.setAttribute("class","card")
            let title = document.createElement("div")
            title.setAttribute("class","EventTitle")
            title.textContent = events[i].titolo
            let place = document.createElement("div")
            place.setAttribute("class","EventPlace")
            place.textContent = events[i].luogo
            let date = document.createElement("div")
            date.setAttribute("class","EventTime")
            date.textContent = `Da ${events[i].i} a ${events[i].f}`
            let desc = document.createElement("div")
            desc.setAttribute("class","EventDesc")
            desc.textContent = events[i].desc
            card.appendChild(title)
            card.appendChild(place)
            card.appendChild(date)
            card.appendChild(desc)
            document.getElementById("EventSpace").appendChild(card)
          }
          for (let i = 0; i<acts.length;i++) {
            let card = document.createElement("div")
            card.setAttribute("class","card")
            let date = document.createElement("div")
            date.setAttribute("class","ActTime")
            date.textContent = `Da ${acts[i].i} a ${acts[i].f}`
            let desc = document.createElement("div")
            desc.setAttribute("class","ActDesc")
            desc.textContent = acts[i].desc
            card.appendChild(date)
            card.appendChild(desc)
            document.getElementById("ActSpace").appendChild(card)
          }

          // inserisci qua il codice che mette il pomodoro in document.getElementById("PomSpace")
}