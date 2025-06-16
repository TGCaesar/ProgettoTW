let user = "Gio"; // <- Da aggiornare con il nome di chi ha fatto l'accesso
const { createApp, ref } = Vue;
import {
  Day,
  Week,
  Month,
  Year,
  Decade,
  ActualWeek,
  ActualMonth,
  ActualYear,
  Today,
  Attivita,
} from "./Calendario.js";

const general_month = Vue.createApp({
  data() {
    let w = ActualWeek();
    let m = ActualMonth();
    let y = ActualYear();
    const day = new Day(1, 1, 1);
    let week = new Week(1, 1, 1);
    if (w <= 4) {
      week = new Week(w, m, y);
    } else {
      if (m < 12) {
        week = new Week(w - 4, m + 1, y);
      } else {
        week = new Week(w - 4, 1, y + 1);
      }
    }
    const month = new Month(m, y);
    month.Print(); //inizializzazione del mese nel format giusto, vedi Calendario.js
    return {
      // Variabili temporali:
      day: day,
      month: month,
      today: Today(),
      ActualMonth: ActualMonth(),
      ActualYear: ActualYear(),
      monthNames: [
        "Gennaio",
        "Febbraio",
        "Marzo",
        "Aprile",
        "Maggio",
        "Giugno",
        "Luglio",
        "Agosto",
        "Settembre",
        "Ottobre",
        "Novembre",
        "Dicembre",
      ],
      selectedDays: {
        //la funzione getDay() ritorna dom=0, quindi l'ho messa prima
        Dom: false,
        Lun: false,
        Mar: false,
        Mer: false,
        Gio: false,
        Ven: false,
        Sab: false,
      },

      // Parte visiva:
      showDetails: false, //mostra Transition giornaliera se true
      showMonth: true, //true mostra mese, false la settimana
      showEvents: true, //mostra la parte degli eventi nella Tansition
      showNotes: false, //la parte delle note nella Transition
      showAct: false, //parte attivita' nella Transition
      showInsert: false, //mostra Transiction dell'inserimento evento
      showInsertAct: false, //come sopra ma act
      decade: new Decade(2024), //utile per 'manipolare' il calendario

      // Variabili dove caricare le rispodte del server:
      week: week,
      eventi: day.eventi,
      note: "",
      act: day.act,

      // Variabili per server:
      mdEvent: false, //come su, ma modificare eventi
      rmEvent: false, //per rimuoverne uno
      eventType: 0, //per capire che tipo di inserimento usare
      changeNotes: false, //per visualizzare modifica note nel client
      mdNote: false, //parte server, per capire se modificaare note
      rmAct: false,
      mdAct: false,
      inAct: false,
    };
  },
  methods: {
    Prec() {
      // Ritorna mese precedente
      if (this.month.m > 1) {
        this.month = new Month(this.month.m - 1, this.month.y);
      } else this.month = new Month(12, this.month.y - 1);
      this.month.Print();
    },
    Next() {
      // Successivo
      if (this.month.m < 12) {
        this.month = new Month(this.month.m + 1, this.month.y);
      } else this.month = new Month(1, this.month.y + 1);
      this.month.Print();
    },
    async PrecWeek() {
      // Come sopra per week
      if (this.week.w > 1) {
        this.week = new Week(this.week.w - 1, this.week.m, this.week.y);
      } else {
        if (this.week.m > 1) {
          this.week = new Week(4, this.week.m - 1, this.week.y);
        } else {
          this.week = new Week(4, 12, this.week.y - 1);
        }
      }
      await this.loadWeek(
        this.week.days[0].d,
        this.week.days[0].m,
        this.week.days[0].y
      );
    },
    async NextWeek() {
      if (this.week.w < 4) {
        this.week = new Week(this.week.w + 1, this.week.m, this.week.y);
      } else {
        if (this.week.m < 12) {
          this.week = new Week(1, this.week.m + 1, this.week.y);
        } else {
          this.week = new Week(1, 1, this.week.y + 1);
        }
      }
      await this.loadWeek(
        this.week.days[0].d,
        this.week.days[0].m,
        this.week.days[0].y
      );
    },
    async loadWeek(d, m, y) {
      try {
        await fetch(
          `http://127.0.0.1:3000/${user}/week?d=${d}&m=${m}&y=${y}&w=${this.week.w}`,
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
            this.week = response.week;
          });
      } catch (error) {
        console.log("Errore: " + error);
      }
    },
    async showDay(d, m, y) {
      // Carica eventi, note  eattivita' del giorno (d, m, y)
      this.showDetails = !this.showDetails;
      this.day.d = d;
      this.day.m = m;
      this.day.y = y;
      await this.loadEventi(d, m, y);
      await this.loadNote(d, m, y);
      await this.loadAct(d, m, y);
    },
    async loadEventi(d, m, y) {
      //carica gli eventi dal server
      try {
        await fetch(
          `http://127.0.0.1:3000/${user}/eventi?d=${d}&m=${m}&y=${y}`,
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
            this.eventi = response.eventi;
          });
      } catch (error) {
        console.log("Errore: " + error);
      }
    },
    async modifyEvent(d, m, y, n) {
      this.eventi[n].i = document.querySelector("#inizio" + n).value;
      this.eventi[n].f = document.querySelector("#fine" + n).value;
      this.eventi[n].event = document.querySelector("#desc" + n).value;
      if (this.eventi[n].i == "" || this.eventi[n].f == "") {
        this.removeEvent(d, m, y, n);
      } else {
        try {
          await fetch(
            `http://127.0.0.1:3000/${user}/eventi?d=${d}&m=${m}&y=${y}`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                day: d,
                month: m,
                year: y,
                eventi: this.eventi,
                mdEvent: true,
              }),
            }
          ).then(await this.loadEventi(d, m, y));
        } catch (error) {
          console.log("Errore: " + error);
        }
      }
    },
    async removeEvent(d, m, y, n) {
      for (let i = n; i < 6; i++) {
        this.eventi[i] = this.eventi[i + 1];
      }
      this.eventi[5].i = "";
      this.eventi[5].f = "";
      this.eventi[5].event = "";
      this.eventi[5].titolo = "";
      this.eventi[5].luogo = "";
      try {
        await fetch(
          `http://127.0.0.1:3000/${user}/eventi?d=${d}&m=${m}&y=${y}`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              day: d,
              month: m,
              year: y,
              eventi: this.eventi,
              rmEvent: true,
            }),
          }
        );
      } catch (error) {
        console.log("Errore: " + error);
      }
    },
    async insertEvent(d, m, y) {
      if (this.eventType == 0) {
        var day = document.querySelector("#day").value; //ho usato var perche' deve essere visibile fuori
      } else if (this.eventType == 1) {
        var d1 = document.querySelector("#day1").value;
        var d2 = document.querySelector("#day2").value;
        var arrOfDays = [
          this.selectedDays.Dom,
          this.selectedDays.Lun,
          this.selectedDays.Mar,
          this.selectedDays.Mer,
          this.selectedDays.Gio,
          this.selectedDays.Ven,
          this.selectedDays.Sab,
        ];
      } else if (this.eventType == 2) {
        var m = document.querySelector("#mese").value;
        var y = document.querySelector("#anno").value;
      }
      let t = document.querySelector("#titolo").value;
      let i = document.querySelector("#inizio").value;
      let f = document.querySelector("#fine").value;
      let desc = document.querySelector("#desc").value;

      try {
        await fetch(
          `http://127.0.0.1:3000/${user}/eventi?d=${d}&m=${m}&y=${y}`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              day: day,
              day1: d1,
              day2: d2,
              mese: m,
              anno: y,
              titolo: t,
              inizio: i,
              fine: f,
              desc: desc,
              type: this.eventType,
              arrOfDays: arrOfDays,
              inEvent: true,
            }),
          }
        );
      } catch (error) {
        console.log("Errore: " + error);
      }
    },
    async loadNote(d, m, y) {
      try {
        await fetch(`http://127.0.0.1:3000/${user}/note?d=${d}&m=${m}&y=${y}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          .then(async (response) => await response.json())
          .then((response) => {
            this.note = response.note.slice(1, -1);
          });
      } catch (error) {
        console.log("Errore: " + error);
      }
    },
    async modifyNotes(d, m, y) {
      try {
        await fetch(`http://127.0.0.1:3000/${user}/note?d=${d}&m=${m}&y=${y}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            day: d,
            month: m,
            year: y,
            notee: this.note,
          }),
        });
      } catch (error) {
        console.log("Errore: " + error);
      }
    },
    async loadAct(d, m, y) {
      try {
        await fetch(`http://127.0.0.1:3000/${user}/act?d=${d}&m=${m}&y=${y}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          .then(async (response) => await response.json())
          .then((response) => {
            this.act = response.act;
          });
      } catch (error) {
        console.log("Errore: " + error);
      }
    },
    async removeAct(d, m, y, n) {
      for (let i = n; i < 6; i++) {
        this.act[i] = this.act[i + 1];
      }
      this.act[5].i = "";
      this.act[5].f = "";
      this.act[5].desc = "";
      try {
        await fetch(`http://127.0.0.1:3000/${user}/act?d=${d}&m=${m}&y=${y}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            day: d,
            month: m,
            year: y,
            act: this.act,
            rmAct: true,
          }),
        });
      } catch (error) {
        console.log("Errore: " + error);
      }
    },
    async modifyAct(d, m, y, n) {
      this.act[n].i = document.querySelector("#inizio" + n + "act").value;
      this.act[n].f = document.querySelector("#fine" + n + "act").value;
      this.act[n].desc = document.querySelector("#desc" + n + "act").value;
      if (this.act[n].i == "" || this.act[n].f == "") {
        this.removeAct(d, m, y, n);
      } else {
        try {
          await fetch(
            `http://127.0.0.1:3000/${user}/act?d=${d}&m=${m}&y=${y}`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                day: d,
                month: m,
                year: y,
                act: this.act,
                mdAct: true,
              }),
            }
          );
        } catch (error) {
          console.log("Errore: " + error);
        }
        await this.loadAct(d, m, y);
      }
    },
    async insertAct() {
      let d1 = document.getElementById("inActDay1").value;
      let d2 = document.getElementById("inActDay2").value;
      let desc = document.getElementById("descAct").value;
      let day1 = new Day(
        parseInt(d1.slice(8, 10)), //d
        parseInt(d1.slice(5, 7)), //m
        parseInt(d1.slice(0, 4)) //y
      );
      let day2 = new Day(
        parseInt(d2.slice(8, 10)),
        parseInt(d2.slice(5, 7)),
        parseInt(d2.slice(0, 4))
      );
      let newAct = new Attivita(day1, day2, desc);
      await this.loadAct(
        parseInt(d1.slice(8, 10)),
        parseInt(d1.slice(5, 7)),
        parseInt(d1.slice(0, 4))
      );
      if (this.act == "" || this.act[5].i == "") {
        try {
          await fetch(
            `http://127.0.0.1:3000/${user}/act?d=${d}&m=${m}&y=${y}`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                act: new Attivita(day1, day2, desc),
                inAct: true,
              }),
            }
          );
        } catch (error) {
          console.log("Errore: " + error);
        }
      } else alert("Act di oggi piene");
    },
  },
});
general_month.mount("#general_month");
