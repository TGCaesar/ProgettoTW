const clock = document.getElementById("timer")
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

function start() {
    if (!started) {
        started = true
        cycles = (document.getElementById("cicli").value) * 2
        study = document.getElementById("studio").value
        pause = document.getElementById("pausa").value
        next()
        resume()
    }
}

function stop() {
    if (interval) {
        offset = waittime
        clearInterval(interval)
        interval = null
    }
}

function resume() {
    if (!interval) {
        starttime = Date.now()
        interval = setInterval(tick, 100)
    }
}

function skip() {
    skipper = false
    resume()
}

// function tick() {
//     let time = (Date.now() - starttime)
//     console.log(time)
//     time = Math.trunc(time / 1000)
//     let seconds = time % 60
//     seconds = String(seconds).padStart(2, '0')
//     let minutes = Math.trunc(time / 60) % 60
//     minutes = String(minutes).padStart(2, '0')
//     clock.innerHTML = `${minutes}:${seconds}`
// }

// function tick() {
//     waittime = (Date.now() - starttime) + offset
//     let displaytime = Math.trunc(wait * 60 - (waittime / 1000))
//     if (displaytime > 0 && skipper) {
//         let seconds = displaytime % 60
//         seconds = String(seconds).padStart(2, '0')
//         let minutes = Math.trunc(displaytime / 60) % 60
//         minutes = String(minutes).padStart(2, '0')
//         clock.innerHTML = `${minutes}:${seconds}`
//     } else {
//         clock.innerHTML = `00:00`
//         alert("done")
//         clearInterval(interval)
//         interval = null
//         skipper = true
//     }
// }

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
        alert("done")
        clearInterval(interval)
        interval = null
        skipper = true
        finished = true
    }
}

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
        } else {
            alert("cicli conclusi")
            document.getElementById("currentcycle").innerHTML = 0
            wait = null
        }
    }
}

function end() {
    if (started) {
        skip()
        cycles = 0
        study = 0
        pause = 0
        finished = true
        started = false
    }
}