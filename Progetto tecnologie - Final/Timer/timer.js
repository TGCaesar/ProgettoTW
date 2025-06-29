const clock = document.getElementById("timer")
const dots = document.getElementById("Dots")
var wait
var starttime
var waittime
var interval
var offset = 0
var skipper = true
var cycles
var study
var pause
var alternator = true
var finished = true
var started = false
var notif
const startButton = document.getElementById("start")
const stopButton = document.getElementById("stop")
const resumeButton = document.getElementById("resume")
const skipButton = document.getElementById("skip")
const nextButton = document.getElementById("next")
const endButton = document.getElementById("end")
const restartButton = document.getElementById("restart")

startButton.addEventListener("click",start)
stopButton.addEventListener("click",stop)
resumeButton.addEventListener("click",resume)
skipButton.addEventListener("click",skip)
nextButton.addEventListener("click",next)
endButton.addEventListener("click",end)
restartButton.addEventListener("click",restart)

// La funzione che avvia l'inizio del timer e abilita tutti gli altri pulsanti
function start() {
    if (!started) {
        started = true
        skipper = true
        cycles = (document.getElementById("cicli").textContent) * 2
        study = document.getElementById("studio").textContent
        pause = document.getElementById("pausa").textContent
        next()
        resume()
        startButton.setAttribute("hidden",true)
        stopButton.removeAttribute("hidden")
        skipButton.removeAttribute("hidden")
        restartButton.removeAttribute("hidden")
    }
}

// una funzione che mette in pausa il timer e memorizza il momento in cui è stato messo in pausa per permettere di ripartire dopo
function stop() {
    if (interval) {
        offset = waittime
        clearInterval(interval)
        interval = null
        dots.style.animationName = null
        
    }
    stopButton.setAttribute("hidden",true)
    resumeButton.removeAttribute("hidden")
}

// funzione opposta di stop, fa ripartire il timer
function resume() {
    if (!interval) {
        starttime = Date.now()
        interval = setInterval(tick, 100)
        if (cycles%2) {
            dots.style.animationName = "study-anim"
        } else {
            dots.style.animationName = "pause-anim"
        }
        
    }
    stopButton.removeAttribute("hidden")
    resumeButton.setAttribute("hidden",true)
}

// una funzinone che azzera il timer e permette di passare al ciclo successivo
function skip() {
    skipper = false
    tick
    skipButton.setAttribute("hidden",true)
}


// la funzione principale che gestisce l'operazione del timer, normalmente viene eseguita attraverso setInterval e paragona Date.now con starttime, tenendo di conto l'offset che viene causato da pause precedenti
// la funzione aggiorna il cronometro sulla pagina e se la pagina non è aperta manda una notifica quando si conclude il timer
function tick() {
    waittime = (Date.now() - starttime) + offset
    let displaytime = Math.trunc(wait * 60 - (waittime / 1000))
    if (displaytime > 0 && skipper) {
        let seconds = displaytime % 60
        seconds = String(seconds).padStart(2, '0')
        let minutes = Math.trunc(displaytime / 60) % 60
        minutes = String(minutes).padStart(2, '0')
        clock.innerHTML = `${minutes}:${seconds}`
    } else {
        clock.innerHTML = `00:00`
        clearInterval(interval)
        interval = null
        skipper = true
        finished = true
        dots.style.animationName = null
        if (wait){
        nextButton.removeAttribute("hidden")
    }
        stopButton.setAttribute("hidden",true)
        resumeButton.setAttribute("hidden",true)
        var pausa = "della pausa"
        var studio = "dello studio"
        var notifmsg
        if (alternator) {
             notifmsg = `Il timer ${pausa} è scaduto, ora di far partire il timer ${studio}`
        } else {
             notifmsg = `Il timer ${studio} è scaduto, ora di far partire il timer ${pausa}`
        }
        if (document.visibilityState == "hidden") {
        notif = new Notification ("Selfie Timer", {body: notifmsg} )
        window.addEventListener("visibilitychange", closeNotif, true)
    }
    }
}

// Funzione che fa passare al ciclo successivo, ogni ciclo si alterna tra studio e pausa e questa funzione aggiorna la variabile wait a seconda del ciclo appena concluso
function next() {
    if (started) {
        if (cycles > 0) {
            if (finished) {
                offset = 0
                starttime = Date.now();
                if (alternator) {
                    wait = study
                    alternator = false
                } else {
                    wait = pause
                    alternator = true
                }
                cycles--
                finished = false
                clock.innerHTML = `${String(wait).padStart(2, '0')}:00`
            } else {
                alert("timer non concluso")
            }
            stop()


            document.getElementById("currentcycle").innerHTML = Math.trunc(cycles / 2) + 1
            skipButton.removeAttribute("hidden")
        } else {
            document.getElementById("currentcycle").innerHTML = 0
            wait = null
            endButton.removeAttribute("hidden")
        }
    }
    nextButton.setAttribute("hidden",true)
    
}

// funzione che permette di reinizializzare la pagina allo stato iniziale quando si conclude il ciclo finale, riabilita il pulsante di inizio e disabilita tutti gli altri
function end() {
    if (started) {
        cycles = 0
        study = 0
        pause = 0
        wait = null
        finished = true
        started = false
        document.getElementById("currentcycle").innerHTML = "Press start"
        skip()
        stopButton.setAttribute("hidden",true)
        startButton.removeAttribute("hidden")
        endButton.setAttribute("hidden",true)
        nextButton.setAttribute("hidden",true)
        resumeButton.setAttribute("hidden",true)
        restartButton.setAttribute("hidden",true)
    }
}

// funzione che fa ritornare all'inizio del ciclo di studio
function restart () {
    var sum
    if (alternator) {
        sum = 2
    } else {
        sum = 1
        alternator = true
    }
    cycles = cycles + sum
    wait = 0
    tick()
    next()
    endButton.setAttribute("hidden",true)
}

function closeNotif () {
            if (document.visibilityState === "visible") {
                notif.close()
                document.removeEventListener("visibilitychange",closeNotif,true)
            }
        }
