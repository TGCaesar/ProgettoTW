const button = document.getElementById("submit")
const label = 'display'
const slider = 'timeRange'
const cycles = 'cycles'
const study = 'studyDuration'
const pause = 'pauseDuration'


var s
var p

function Count () {
    let c = document.getElementById(cycles)
    let s = document.getElementById(study)
    let p = document.getElementById(pause)
    let values = number_parser (document.getElementById(slider).value)
    c.value = values.cicli;
    s.value = values.studio*5;
    p.value = values.pausa*5;
    update()
}


// funzione che incrementa s e p, i valori che rappresentano la durata del tempo di studio e di pausa
function incrementer () {
    console.log("++")
    if (s-6>=2*(p-1)) {p++} else {s++}
}

//funzione che riceve in input il tempo totale e ritorna un ogetto contenente la lunghezza del tempo di studio, di pausa e il numero di cicli
function number_parser (int) {
    console.log(int)
    s = 6;
    p = 1;
    var c;
    var r;
    let rf = (int % 7);
    let sf = s;
    let pf = p;
    var loop = true;
    while (loop) {
    if ((s+p)==11) {loop = false}
    r = (int % (s+p));
    if (r==0) {
        loop = false
        sf = s;
        pf = p;

    } else {
        if (r<rf) {
            rf = r;
            sf = s;
            pf = p;
        }
        incrementer ()
    }
    }
    c = Math.trunc(int/(sf+pf))
    let response = {
        studio: sf,
        pausa: pf,
        cicli: c
    }
    return (response)
}

// button.addEventListener('click', function () {
// let res = number_parser(range.value)
// console.log(res)
// })