export class Day {
  constructor(d, m, y) {
    this.d = d;
    this.m = m;
    this.y = y;
    this.bold = false; //per capire se da fare in grassetto, vedi Mese.html
    this.note = ""; //note da mostrare successivamente
    this.eventi = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.eventi[i] = new Evento("", "", "", "", "");
    }
    this.act = new Array(10); //array di attivita'
    for (let i = 0; i < 10; i++) {
      this.act[i] = new Attivita("", "", "");
    }
  }
  isMonday() {
    const date = new Date(this.y, this.m - 1, this.d);
    return date.getDay() === 1;
  }
}

export class Evento {
  constructor(desc, inizio, fine, titolo, luogo) {
    this.desc = desc.toString(); 
    this.i = inizio; //Ora
    this.f = fine; //Ora
    this.titolo = titolo;
    this.luogo = luogo;
  }
}

export class Attivita {
  constructor(inizio, fine, desc) {
    this.i = inizio;
    this.f = fine;
    this.desc = desc;
  }
}

export class Week {
  constructor(w, m, y) {
    // Le settimane non coprono precisamente i mesi: ho quindi deciso di dividerle in gruppi da 4 per ogni mese.
    // Ad esempio la settimana 1 di novembre 2024 e' 28 ott - 3 nov, ..., la quarta 18 nov - 24 nov, poi si passa a quelle
    // di dicembre.
    this.w = w; //da 1 a 4 compreso
    this.m = m;
    this.y = y;
    this.days = new Array(7);
    let tmp = new Month(m, y);
    tmp.Print(); // inizializza il mese, vedi giu
    for (let i = 0; i < 7; i++) {
      this.days[i] = new Day(tmp.print[w * 7 + i - 7]).d;
    }
  }
}

export class Month {
  constructor(m, y) {
    this.y = y;
    this.m = m;
    // Come per le settimane i mesi sono diversi, ho deciso di dividerli in blocchi da 42. I giorni aggiuntivi sono trovati
    // con le funzioni che vedi sotto.
    this.print = new Array(42);
    //in input valore del mese vero, ad esempio genneaio = 1
    if (m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12) {
      //gennaio, marzo, maggio, luglio, agosto, ottobre, dicembre
      this.month = new Array(31); //mese "vero"
      this.len = 31;
      for (let d = 0; d < 31; d++) {
        this.month[d] = new Day(d + 1, m, y);
      }
    } else if (m == 4 || m == 6 || m == 9 || m == 11) {
      //aprile, giugno, settembre, novembre
      this.month = new Array(30);
      this.len = 30;
      for (let d = 0; d < 30; d++) {
        this.month[d] = new Day(d + 1, m, y);
      }
    } else if (m == 2 && y % 4 == 0) {
      this.month = new Array(29);
      this.len = 29;
      for (let d = 0; d < 29; d++) {
        this.month[d] = new Day(d + 1, m, y);
      }
    } else {
      this.month = new Array(28);
      this.len = 28;
      for (let d = 0; d < 28; d++) {
        this.month[d] = new Day(d + 1, m, y);
      }
    }
  }
  FirstMonday() {
    let check = false;
    let i = 0;
    let d = new Day();
    while (!check) {
      check = this.month[i].isMonday();
      d = this.month[i];
      i++;
    }
    return d;
  }
  SpaceLeft() {
    //ritorna quanti giorni aggiungere prima dell'inizio del mese
    let first = this.FirstMonday().d;
    return 8 - first;
  }
  SpaceRight() {
    //questa quanti alla fine
    let first = this.FirstMonday().d;
    let tot = this.SpaceLeft() + this.len;
    return 42 - tot;
  }
  Prec() {
    //ritorna il mese precedente, utile per capire quali giorni mettere prima
    if (this.m > 1) {
      return new Month(this.m - 1, this.y);
    } else return new Month(12, this.y - 1);
  }
  Next() {
    //qui il mese successivo
    if (this.m < 12) {
      return new Month(this.m + 1, this.y);
    } else return new Month(1, this.y + 1);
  }
  Print() {
    //riempre l'array print con i giorni giusti
    let prec_m = this.Prec();
    let next_m = this.Next();
    for (let i = 0; i < this.SpaceLeft(); i++) {
      this.print[i] = prec_m.month[prec_m.len - this.SpaceLeft() + i];
    }
    for (let i = this.SpaceLeft(); i < 42 - this.SpaceRight(); i++) {
      this.print[i] = this.month[i - this.SpaceLeft()];
      this.print[i].bold = true;
    }
    for (let i = 42 - this.SpaceRight(); i < 42; i++) {
      this.print[i] = next_m.month[i - this.len - this.SpaceLeft()];
    }
  }
}

export class Year {
  constructor(y) {
    this.y = y;
    this.year = new Array(12);
    for (let m = 0; m < 12; m++) {
      this.year[m] = new Month(m + 1, y);
    }
  }
}

export class Decade {
  constructor(y) {
    this.decade = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.decade[i] = new Year(y + i);
    }
  }
}

export class User {
  constructor() {
    this.grid = new Decade(ActualYear() - 1);
  }
}

export function Today() {
  let today = new Date();
  let d = today.getDate();
  let m = ActualMonth();
  let y = ActualYear();
  return new Day(d, m, y);
}

export function ActualWeek() {
  let d = Today();
  let m = ActualMonth();
  let y = ActualYear();
  let tmp = new Month(m, y);
  tmp.Print();
  for (let i = 0; i < 42; i++) {
    if (d.d == tmp.print[i].d && d.m == tmp.print[i].m)
      return Math.floor(i / 7) + 1;
  }
}

export function ActualMonth() {
  let d = new Date();
  d.getDay();
  let m = d.getMonth();
  return m + 1;
}

export function ActualYear() {
  let d = new Date();
  d.getDay();
  let y = d.getUTCFullYear();
  return y;
}
