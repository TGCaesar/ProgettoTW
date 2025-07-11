// Elementi dell'oggetto notes:
// type: tipo dell'oggettio, per oggetti notes è 0/null/false, per le liste è 1/true
// creator: username dell'utente che ha creato il documento
// title: titolo
// body: corpo
// create_date: data in cui il documento è stato creato
// last_change: data dell'ultima modifica
// labels: categorie a scelta (più di un elemento)
// permission: può essere "public", "private", "whitelist"
// whitelist: lista di username di utenti che possono vedere il documento
// list: array contenente tutti i valori della lista
// list[i].body: stringa di testo assiociata ad ogni elemento
// list[i].done: valore booleano che indica se l'elemento all'index i è completato
// list[i].expiry: un valore opzionale che contiene la data di scandenza dell'elemento i della lista


// Qui definisco tutte le variabili globali e elementi dell HTML che verrano poi chiamate durante lo svolgimento delle varie funzioni
const params = new URLSearchParams(window.location.search);
let user = params.get("usr");


const MarkedBody = document.getElementById("markedBody")
MarkedBody.appendChild(document.createTextNode(null))
const Marker = document.getElementById("marker")

const TitleDiv = document.getElementById("titleDiv")
const permDiv = document.getElementById("permDiv")

const body = document.getElementById("body")
const title = document.getElementById("title")
const add = document.getElementById("new")
const BlackBox = document.getElementById("BlackBox")
const doc_card = document.getElementById("doc-display")
const selction = document.getElementById("load-sort")
var sorter = selction.value
const labelContainer = document.getElementById("label-select")
const WLContainer = document.getElementById("WL-select")
const permSelection = document.getElementById("permission-select")
var permission = permSelection.value

const card_creator = document.getElementById("creatorDiv")

const whitelist = []

document.getElementById("search").addEventListener("click", loadLabel)

const labels = []


add.addEventListener("click", create)
document.getElementById("x").addEventListener("click", display_close)
BlackBox.addEventListener("click", display_close)
document.getElementById("make-new").addEventListener("click", open_new_doc)

const update = document.getElementById("update")
update.addEventListener("click", send)
const Remove = document.getElementById("remove")
Remove.addEventListener("click", Remover)

const copy = document.getElementById("copyDoc")
copy.addEventListener("click", makeCopy)



const listContainer = document.getElementById("list-container")
const listArray = []



// La funzione Create legge i valori del documento aperto e poi crea una chiamata POST per salvare il documento nel server
// La chiamata ritorna poi l'identificatore del documento creato e vengono nascosti i pulsanti appropriati per passare all'interfaccia di modifica del documento
// Esistono un paio di condizionali if per prevenire la creazione di un documento vuoto che può causare errori
function create() {
        let document = {
            type: doc_card.getAttribute("list"),
            title: title.value,
            body: body.value,
            user: user,
            labels: labels,
            list: listArray,
            permission: permission,
            whitelist: whitelist
        }
        if (document.type){
        if (listArray.length==0) {
            alert("Non si può salvare un documento vuoto")
            return null
        }
    } else {
        if (document.body == null) {
            alert("Non si può salvare un documento vuoto")
            return null
        }
    }
        console.log(document)
        $.post('http://localhost:5050/create', document, function (data) {
            if (data) {
                doc_card.setAttribute('id', data)
                update.removeAttribute("hidden")
                add.setAttribute("hidden", true)
                Remove.removeAttribute("hidden")
            } else {
                //caso di errore
                alert("errore di server")
            }
        }
        )
    

}

// La funzione send è simile alla funzione Create, con la differenza che non c'è bisogno di includere nella richiesta l'autore del documento e il tipo del documento (lista o documento di testo), dato che questi valori non possono essere modificati
// Inoltre la chiamata non ha bisogno di inviare nessun dato oltre alla conferma di successo, a differenza della richiesta create che deve ricevere l'identificatore generato dall'API MongoDB
function send() {
    let doc = {
        body: document.getElementById("body").value,
        title: document.getElementById("title").value,
        id: doc_card.id,
        list: listArray,
        labels: labels,
        permission: permission,
        whitelist: whitelist
    }
    if (doc_card.getAttribute("list")){
        if (listArray.length==0) {
            alert("Non si può salvare un documento vuoto")
            return null
        }
    } else {
        if (doc.body == null) {
            alert("Non si può salvare un documento vuoto")
            return null
        }
    }

    $.post('http://localhost:5050/update', doc, function (data, success) {
        if (!success) {
            alert("errore di server")
        }
    })
}

// La funzione load è la funzione essenziale della pagina appunti, è la funzione che permette di visualizzare i documenti creati
// Al suo fulcro la funzione crea un oggetto contente l'utente, la query della ricerca (che può essere anche nulla) e le specifica dell'ordine e genera una richiesta al server
// La funzione per inserire gli oggetti ottenuti in risposta è scritta separatamente per rendermi più semplice lavorarci
function load() {
    
    document.getElementById("docList").innerHTML = null
    var packet = {
        sender: user,
        query: {}
    }
    var options = {}
    var sort = {}
    if (document.getElementById("order").checked) {
        sort[sorter] = -1
    } else {
        sort[sorter] = 1
    }
    options["sort"] = sort
    packet["options"] = options
    $.post('http://localhost:5050/load', packet, function (data, status) {
        if (data) {
            doc_display(data, "docList")



        } else {
            alert("errore di server")
        }
    })

}


// Questa è la funzione che si occupa di inserire gli elementi all'interno della pagina html, troncando il titolo a 40 caratteri e il corpo a 200, com richiesto dalle specifiche del progetto
// Dato che la quantità di documenti mostrabile è variabile ho dovuto usare la funzione createElement per generare ogni documento, poi ho usato setAttribute per applicare le classi appropriate di Bootstrap e del mio codice css per creare una pagina reattiva e esteticamente appropriata
function doc_display(data, location) {
    var cell
    var title
    var body
    var author
    for (let i = 0; i < data.length; i++) {
        console.log(data[i].title)
        var row
        if (data[i].title.length > 40) {
            title = document.createTextNode(data[i].title.slice(0, 36) + '...')
        } else {
            title = document.createTextNode(data[i].title)
        }
        if (data[i].body.length > 200) {
            body = document.createTextNode(data[i].body.slice(0, 196) + '...')
        } else {
            body = document.createTextNode(data[i].body)
        }

        author = document.createTextNode(data[i].creator)
        let t = document.createElement("div")
        let a = document.createElement("div")
        let b = document.createElement("div")
        t.setAttribute("class", "card-title")
        a.setAttribute("class", "card-author")
        b.setAttribute("class", "card-body")
        t.appendChild(title)
        a.appendChild(author)

        if (data[i].type) {
            for (let j = 0; (j < data[i].list.length) & (j < 5); j++) {
                let l = document.createElement("div")
                l.appendChild(document.createTextNode(data[i].list[j].body))
                b.appendChild(l)
            }
        } else {
            b.appendChild(body)
            b.innerHTML = marked.parseInline(b.innerHTML)
        }
        let col = document.createElement("div")
        col.setAttribute("class", "col-md-4 col-sm-6")
            document.getElementById(location).appendChild(col)

        cell = document.createElement("div")
        cell.setAttribute("class", "card h-100")
        cell.setAttribute("_id", data[i]._id)

        col.appendChild(cell)
        cell.appendChild(t)
        cell.appendChild(a)
        cell.appendChild(b)
        cell.addEventListener('click', function () {
            open_doc(this.getAttribute('_id'))
        })

    }
}

// Le funzioni display_open e display_close semplicemente applicano o rimuovono l'attributo hidden da doc_card e BlackBox, rispettivamente il pannello che contiene l'interfaccia di modifica e visualizzazione dei documenti e un oggetto nero parzialmente opaco che mette fuori fuoco il resto della pagina
// display_close inoltre annulla tutti i valori relativi al documento aperto, è un processo ridondante dato che vengono sovrascritti ogni volta che si apre un documento ma l'ho fatto per prevenire possibili errori che potrei non aver considerato 

function display_open() {
    BlackBox.removeAttribute("hidden")
    doc_card.removeAttribute("hidden")
}

function display_close() {
    BlackBox.setAttribute("hidden", true)
    doc_card.setAttribute("hidden", true)
    body.innerHTML = null
    MarkedBody.innerHTML = null
    body.value = null
    title.value = null
    MarkedBody.innerHTML = null
    labels.length = 0
    document.getElementById("label-input").value = null
    labelContainer.innerHTML = null
    document.getElementById("WL-input").value = null
    whitelist.length = 0
    WLContainer.innerHTML = null
    listArray.length = 0
    listContainer.innerHTML = null
    document.getElementById("list-input").value = null
}

// La funzione open_doc viene eseguita ogni volta che si clicca sulla card associata ad un documento ed apre su doc_card l'intero documento
// La più grande complicazione riguardante questa funzione è il caricare le liste, dato che hanno lunghezza variabile e richiedono l'inclusione di pulsanti e calendario per ogni elemento e richiedono l'utilizzo di createElement e setAttribute per inserire questi nel DOM dell'html
// Inoltre bisogna considerare se il documento è dell'utente della pagina oppure no, e disattivare o riattivare e mostrare o nascondere gli elementi dell'interfaccia a seconda del caso
function open_doc(id) {
    console.log(id)
    packet = {
        id: id,
    }
    $.post('http://localhost:5050/singledoc', packet, function (data, status) {
        if (data) {
            body.value = data.body
            title.value = data.title
            card_creator.textContent = data.creator
            MarkedBody.innerHTML = body.value
            MarkedBody.innerHTML = marked.parse(MarkedBody.innerHTML)
            doc_card.setAttribute('id', id)
            labelContainer.innerHTML = null
            labels.length = 0
            document.getElementById("label-input").value = null
            if (data.labels) {
                labels.length = data.labels.length
                for (let i = 0; i < labels.length; i++) {
                    labels[i] = data.labels[i]
                    let option = document.createElement("option")
                    option.appendChild(document.createTextNode(data.labels[i]))
                    labelContainer.appendChild(option)
                }
            }
            if (data.type) {
                listArray.length = data.list.length
                for (let i = 0; i < listArray.length; i++) {
                    listArray[i] = data.list[i]
                    let text = listArray[i].body
            objectLabel = document.createElement("div")
            objectLabel.appendChild(document.createTextNode(text))
            listCheck = document.createElement("input")
            listCheck.setAttribute("class", "form-check-input")
            listCheck.setAttribute("type", "checkbox")
            listCheck.setAttribute("value", i)
            listCheck.checked = listArray[i].done
            listCheck.addEventListener("change", function () {
                let j = this.getAttribute("value")
                console.log(this)
                if (this.checked){
                listArray[j].done = true
            } else {
                listArray[j].done = null
            }
                console.log(this.checked)
                console.log(listArray)
            })
            newRow = document.createElement("div")
            newRow.setAttribute("class", "row")
            newRow.setAttribute("value", i)
            col1 = document.createElement("div")
            col1.setAttribute("class", "col-4")
            col2 = document.createElement("div")
            col2.setAttribute("class", "col-8")
            newRow.setAttribute("id", `row-${i}`)
            calendar = document.createElement("input")
            calendar.setAttribute("type", "datetime-local")
            calendar.setAttribute("id", `calendar-${i}`)
            calendar.setAttribute("class","cal")
            calendar.setAttribute("value", i)
            btn = document.createElement("button")
            btn.innerHTML = "Aggiungi scadenza"
            btn.setAttribute("class", "btn")
            btn.setAttribute("type", "button")
            btn.setAttribute("id", `cal-add-btn-${i}`)
            btn.setAttribute("value", i)
            btn.setAttribute("style", "border: 1px solid black")
            btn.addEventListener("click", function () {
                let j = this.value
                let cal = document.getElementById(`calendar-${j}`)
                console.log(cal.value)
                let date = Date.parse(cal.value)
                console.log(date - Date.now())
                if (Date.now() < date) {
                    cal.setAttribute("disabled", true)
                    document.getElementById(`cal-rem-btn-${j}`).removeAttribute("hidden")
                    this.setAttribute("hidden", true)
                    listArray[j].expiry = cal.value
                } else {
                    alert("Data inserita non valida")
                }
                console.log(listArray)
            })
            btn1 = document.createElement("button")
            btn1.innerHTML = "Rimuovi scadenza"
            btn1.setAttribute("class", "btn")
            btn1.setAttribute("type", "button")
            btn1.setAttribute("id", `cal-rem-btn-${i}`)
            btn1.setAttribute("value", i)
            btn1.setAttribute("hidden", true)
            btn1.setAttribute("style", "border: 1px solid black")
            btn1.addEventListener("click", function () {
                let j = this.value
                let cal = document.getElementById(`calendar-${j}`)
                cal.removeAttribute("disabled")
                listArray[j].expiry = null
                document.getElementById(`cal-add-btn-${j}`).removeAttribute("hidden")
                this.setAttribute("hidden", true)
            })
            btn2 = document.createElement("button")
            btn2.innerHTML = "Elimina elemento"
            btn2.setAttribute("class", "btn")
            btn2.setAttribute("type", "button")
            btn2.setAttribute("id", `del-btn-${i}`)
            btn2.setAttribute("value", i)
            btn2.setAttribute("style", "border: 1px solid black")
            btn2.addEventListener("click", function () {
                console.log(this)
                let k = this.value
                console.log(k)
                delete listArray[k]
                listArray.length = listArray.length - 1
                listContainer.removeChild(document.getElementById(`row-${k}`))
                for (let j = k; j < (listArray.length - 1); j++) {
                    listArray[j] = listArray[j + 1]
                    document.getElementById(`row-${j + 1}`).setAttribute("value", j)
                    document.getElementById(`row-${j + 1}`).setAttribute("id", `row-${j}`)
                    document.getElementById(`del-btn-${j + 1}`).setAttribute("value", j)
                    document.getElementById(`del-btn-${j + 1}`).setAttribute("id", `del-btn-${j}`)
                }

            })
            newRow.appendChild(col1)
            newRow.appendChild(col2)
            col1.appendChild(listCheck)
            col1.appendChild(objectLabel)
            col2.appendChild(calendar)
            col2.appendChild(btn)
            col2.appendChild(btn1)
            col2.appendChild(btn2)
            if (data.list[i].expiry) {
                calendar.value = data.list[i].expiry
                calendar.setAttribute("disabled",true)
                btn.setAttribute("hidden",true)
                btn1.removeAttribute("hidden")
            }
            listContainer.appendChild(newRow)
                }
            } else {

            }


            document.getElementById("WL-input").value = null
            permSelection.value = data.permission
            whitelist.length = 0
            if (data.whitelist) {
                whitelist.length = data.whitelist.length
                for (let i = 0; i < whitelist.length; i++) {
                    whitelist[i] = data.whitelist[i]
                    let option = document.createElement("option")
                    option.appendChild(document.createTextNode(data.whitelist[i]))
                    WLContainer.appendChild(option)
                }
            }
            if (user != data.creator) {
                if (data.type) {
                    Marker.setAttribute("hidden", true)
                    body.setAttribute("hidden", true)
                    MarkedBody.innerHTML = null
                    MarkedBody.textContent = body.value
                    MarkedBody.innerHTML = marked.parse(MarkedBody.innerHTML)
                    MarkedBody.setAttribute("hidden",true)
                    TitleDiv.textContent = title.value
                    TitleDiv.removeAttribute("hidden")
                    title.setAttribute("hidden", true)
                    add.setAttribute("hidden", true)
                    update.setAttribute("hidden", true)
                    copy.removeAttribute("hidden")
                    Remove.setAttribute("hidden", true)
                    document.getElementById("WL-input").setAttribute("hidden", true)
                    document.getElementById("label-input").setAttribute("hidden", true)
                    permSelection.setAttribute("hidden", true)
                    permDiv.textContent = permSelection.options[permSelection.selectedIndex].text
                    permDiv.setAttribute("hidden",true)
                    document.getElementById("label-remove").setAttribute("hidden", true)
                    document.getElementById("label-add").setAttribute("hidden", true)
                    document.getElementById("WL-remove").setAttribute("hidden", true)
                    document.getElementById("WL-add").setAttribute("hidden", true)
                    listContainer.removeAttribute("hidden")
                    document.getElementById("list-buttons").setAttribute("hidden",true)
                } else {
                    Marker.setAttribute("hidden", true)
                    body.setAttribute("hidden", true)
                    MarkedBody.innerHTML = null
                    MarkedBody.textContent = body.value
                    MarkedBody.innerHTML = marked.parse(MarkedBody.innerHTML)
                    MarkedBody.removeAttribute("hidden")
                    TitleDiv.textContent = title.value
                    TitleDiv.removeAttribute("hidden")
                    title.setAttribute("hidden", true)
                    add.setAttribute("hidden", true)
                    update.setAttribute("hidden", true)
                    copy.removeAttribute("hidden")
                    Remove.setAttribute("hidden", true)
                    document.getElementById("WL-input").setAttribute("hidden", true)
                    document.getElementById("label-input").setAttribute("hidden", true)
                    permSelection.setAttribute("hidden", true)
                    permDiv.textContent = permSelection.options[permSelection.selectedIndex].text
                    permDiv.removeAttribute("hidden")
                    document.getElementById("label-remove").setAttribute("hidden", true)
                    document.getElementById("label-add").setAttribute("hidden", true)
                    document.getElementById("WL-remove").setAttribute("hidden", true)
                    document.getElementById("WL-add").setAttribute("hidden", true)
                    listContainer.setAttribute("hidden", true)
                    document.getElementById("list-buttons").setAttribute("hidden",true)
                }

            } else {
                if (data.type) {
                    Marker.setAttribute("hidden",true)
                    update.removeAttribute("hidden")
                    add.setAttribute("hidden", true)
                    copy.setAttribute("hidden", true)
                    Remove.removeAttribute("hidden")
                    body.setAttribute("hidden", true)
                    MarkedBody.innerHTML = null
                    MarkedBody.textContent = body.value
                    MarkedBody.innerHTML = marked.parse(MarkedBody.innerHTML)
                    MarkedBody.setAttribute("hidden",true)
                    TitleDiv.setAttribute("hidden", true)
                    title.removeAttribute("hidden")
                    document.getElementById("WL-input").removeAttribute("hidden")
                    document.getElementById("label-input").removeAttribute("hidden")
                    permSelection.removeAttribute("hidden")
                    permDiv.setAttribute("hidden", true)
                    document.getElementById("label-remove").removeAttribute("hidden")
                    document.getElementById("label-add").removeAttribute("hidden")
                    document.getElementById("WL-remove").removeAttribute("hidden")
                    document.getElementById("WL-add").removeAttribute("hidden")
                    listContainer.removeAttribute("hidden")
                    document.getElementById("list-buttons").removeAttribute("hidden")
                } else {
                    Marker.removeAttribute("hidden")
                    update.removeAttribute("hidden")
                    add.setAttribute("hidden", true)
                    copy.setAttribute("hidden", true)
                    Remove.removeAttribute("hidden")
                    body.setAttribute("hidden", true)
                    MarkedBody.innerHTML = null
                    MarkedBody.textContent = body.value
                    MarkedBody.innerHTML = marked.parse(MarkedBody.innerHTML)
                    MarkedBody.removeAttribute("hidden")
                    TitleDiv.setAttribute("hidden", true)
                    title.removeAttribute("hidden")
                    document.getElementById("WL-input").removeAttribute("hidden")
                    document.getElementById("label-input").removeAttribute("hidden")
                    permSelection.removeAttribute("hidden")
                    permDiv.setAttribute("hidden", true)
                    document.getElementById("label-remove").removeAttribute("hidden")
                    document.getElementById("label-add").removeAttribute("hidden")
                    document.getElementById("WL-remove").removeAttribute("hidden")
                    document.getElementById("WL-add").removeAttribute("hidden")
                    listContainer.setAttribute("hidden", true)
                    document.getElementById("list-buttons").setAttribute("hidden",true)
                }

            }
        } else {
            alert("errore di server")
        }
    })
    display_open()

}

// Simile alla funzione precedente, però open_new_doc non deve aprire un documento esistente, quindi non neccesita una chiamata al backend e non serve considerare l'autore del documento
// Per semplicità ho differenziato open_new_doc e open_new_list dato che i documenti di testo e le liste sono incompatibili e quindi conviene avere pulsanti separati
function open_new_doc() {
    doc_card.setAttribute("list", false)
    body.value = null
    title.value = null
                card_creator.textContent = user
    
    MarkedBody.innerHTML = null
    labels.length = 0
    document.getElementById("label-input").value = null
    labelContainer.innerHTML = null
    document.getElementById("WL-input").value = null
    whitelist.length = 0
    permSelection.value = "public"
    WLContainer.innerHTML = null
    listArray.length = 0
    listContainer.innerHTML = null
    document.getElementById("list-input").value = null
    add.removeAttribute("hidden")
    update.setAttribute("hidden", true)
    Remove.setAttribute("hidden", true)
    Marker.removeAttribute("hidden")
    copy.setAttribute("hidden", true)
    body.removeAttribute("hidden")
    MarkedBody.innerHTML = null
    MarkedBody.textContent = body.value
    MarkedBody.innerHTML = marked.parse(MarkedBody.innerHTML)
    MarkedBody.setAttribute("hidden", true)
    TitleDiv.setAttribute("hidden", true)
    title.removeAttribute("hidden")
    document.getElementById("WL-input").removeAttribute("hidden")
    document.getElementById("label-input").removeAttribute("hidden")
    permSelection.removeAttribute("hidden")
    permDiv.setAttribute("hidden", true)
    document.getElementById("label-remove").removeAttribute("hidden")
    document.getElementById("label-add").removeAttribute("hidden")
    document.getElementById("WL-remove").removeAttribute("hidden")
    document.getElementById("WL-add").removeAttribute("hidden")
    listContainer.setAttribute("hidden", true)
    document.getElementById("list-buttons").setAttribute("hidden", true)
    document.getElementById("list-buttons").setAttribute("hidden",true)
    display_open()
}

document.getElementById("make-new-list").addEventListener("click", open_new_list)
function open_new_list() {
    doc_card.setAttribute("list", true)
    body.value = null
    title.value = null
                card_creator.textContent = user
            
    MarkedBody.innerHTML = null
    labels.length = 0
    document.getElementById("label-input").value = null
    labelContainer.innerHTML = null
    document.getElementById("WL-input").value = null
    whitelist.length = 0
    permSelection.value = "public"
    WLContainer.innerHTML = null
    listArray.length = 0
    listContainer.innerHTML = null
    document.getElementById("list-input").value = null
    add.removeAttribute("hidden")
    update.setAttribute("hidden", true)
    Remove.setAttribute("hidden", true)
    Marker.setAttribute("hidden", true)
    copy.setAttribute("hidden", true)
    body.setAttribute("hidden", true)
    MarkedBody.innerHTML = null
    MarkedBody.textContent = body.value
    MarkedBody.innerHTML = marked.parse(MarkedBody.innerHTML)
    MarkedBody.setAttribute("hidden", true)
    TitleDiv.setAttribute("hidden", true)
    title.removeAttribute("hidden")
    document.getElementById("WL-input").removeAttribute("hidden")
    document.getElementById("label-input").removeAttribute("hidden")
    permSelection.removeAttribute("hidden")
    permDiv.setAttribute("hidden", true)
    document.getElementById("label-remove").removeAttribute("hidden")
    document.getElementById("label-add").removeAttribute("hidden")
    document.getElementById("WL-remove").removeAttribute("hidden")
    document.getElementById("WL-add").removeAttribute("hidden")
    listContainer.removeAttribute("hidden")
    document.getElementById("list-buttons").removeAttribute("hidden")
    display_open()
}

// Niente di notevole, semplicemente aggiorna il valore sorter che stabilisce l'ordine in cui load dispone le card dei documenti
selction.addEventListener("change", select)

function select() {
    sorter = selction.value
}



// Remover è una semplice funzione che elimina un documento facendo una richiesta con l'identificatore del documento
// Dopo chiude il documento e ricarica tutti i documenti aperti per rimuovere ogni elemento che potrebbe riportare al documento eliminato
function Remover() {
    let packet = {
        id: doc_card.id
    }
    console.log(packet)
    $.post('http://localhost:5050/delete', packet, function (data, status) {
        if (data) {
            display_close()
            load()
        }
    })
}

// Il pulsante Marker permette di passare dalla view markup a quella normale e vice versa
Marker.addEventListener("click", () => {
    if (body.hidden) {
        body.removeAttribute("hidden")
        MarkedBody.setAttribute("hidden", true)
    } else {
        MarkedBody.innerHTML = null
        MarkedBody.textContent = body.value
        MarkedBody.innerHTML = marked.parse(MarkedBody.innerHTML)
        MarkedBody.removeAttribute("hidden")
        body.setAttribute("hidden", true)
    }
})

// label-add e label-remove sono due pulsanti che permettono di manipolare le etichette associate al documento aperto
// In realtà il form-select che mostra le etichette non è direttamente associato alle etichette del documento, ma piuttosto le funzioni manipolano l'array labels, e si assicurano che coincida sempre con il form select
document.getElementById("label-add").addEventListener("click", () => {
    let text = document.getElementById("label-input").value
    if (text) {
        if (!labels.includes(text)) {
            labels.push(text)
            newLabel = document.createElement("option")
            newLabel.appendChild(document.createTextNode(text))
            newLabel.setAttribute("value", text)
            labelContainer.appendChild(newLabel)

        }
    }
})

document.getElementById("label-remove").addEventListener("click", () => {
    if (labels != null) {
        let i = labels.indexOf(labelContainer.value)
        delete labels[i]
        for (let j = i; j < (labels.length - 1); j++) {
            labels[j] = labels[j + 1]
        }
        labels.length = labels.length - 1
        labelContainer.remove(labelContainer.selectedIndex)
    }
})

// La ricerca per etichette in realtà è abbastanza semplice, il fulcro di loadLabel è uguale a load, l'unica differenza è che legge il valore del form label-search e lo imposta come query nella ricerca, il resto è gestito nel backend dall'API di MongoDB
function loadLabel() {
    document.getElementById("docList").innerHTML = null
    if (document.getElementById("label-search").value) {
        var packet = {
            query: { labels: document.getElementById("label-search").value }
        }
    } else {
        load()
        return null
    }
    var options = {}
    var sort = {}
    if (document.getElementById("order").checked) {
        sort[sorter] = -1
    } else {
        sort[sorter] = 1
    }
    options["sort"] = sort
    packet["options"] = options
    console.log(packet)
    $.post('http://localhost:5050/load', packet, function (data, status) {
        if (data) {
            doc_display(data, "docList")



        }
    })

}




permSelection.addEventListener("change", permSelect)

function permSelect() {
    permission = permSelection.value
}


// Il funzionamento della whitelist è in tutto e per tutto uguale a quello dei label per quanto riguarda il frontend
document.getElementById("WL-add").addEventListener("click", () => {
    let text = document.getElementById("WL-input").value
    if (text) {
        if (!whitelist.includes(text)) {
            whitelist.push(text)
            newWL = document.createElement("option")
            newWL.appendChild(document.createTextNode(text))
            WLContainer.appendChild(newWL)
        }
    }
})

document.getElementById("WL-remove").addEventListener("click", () => {
    if (whitelist != null) {
        let i = whitelist.indexOf(WLContainer.value)
        delete whitelist[i]
        for (let j = i; j < (whitelist.length - 1); j++) {
            whitelist[j] = whitelist[j + 1]
        }
        whitelist.length = whitelist.length - 1
        WLContainer.remove(WLContainer.selectedIndex)
    }
})


// makeCopy è una funzione quasi uguale create, l'unica differenza è che quando viene eseguita è già aperto il documento di qualcun'altro, creando così un documento uguale in tutto tranne l'autore
function makeCopy() {
        let document = {
            type: doc_card.getAttribute("list"),
            title: title.value,
            body: body.value,
            user: user,
            labels: labels,
            list: listArray,
            permission: permission,
            whitelist: whitelist
        }
        console.log(document)
        $.post('http://localhost:5050/create', document, function (data) {
            if (data) {
                doc_card.setAttribute('id', data)
                add.setAttribute("hidden", true)
                update.removeAttribute("hidden")
                copy.setAttribute("hidden",true)
                card_creator.textContent = document.user
            } else {
                //caso di errore
                alert("errore di server")
            }
        }
        )
}


// Il pulsante list-add aggiunge un elemento ai documenti di tipo lista, prima verifica che non esista già un elemento uguale e poi aggiunge un elemento all'array listArray associato, come le etichette e la whitelist
// La funzione poi deve aggiungere l'elemento anche nel corpo della doc_card, insieme ai pulsanti per manipolare l'elemento e il form calendario per mostrare la scadenza associata all'elemento
// Manca un pulsante per modificare il testo di un'elemento della lista ma non l'ho considerato necessario, inoltre ho pensato che aggiungere un pulsante in più avrebbe reso l'interfaccia troppo affollata e difficile da usare
document.getElementById("list-add").addEventListener("click", () => {
    let text = document.getElementById("list-input").value
    if (text) {
        if (!listArray.includes(text)) {
            let val = {
                body: text,
                done: null,
                expiry: null
            }
            listArray.push(val)
            objectLabel = document.createElement("div")
            objectLabel.appendChild(document.createTextNode(text))
            listCheck = document.createElement("input")
            listCheck.setAttribute("class", "form-check-input")
            listCheck.setAttribute("type", "checkbox")
            listCheck.setAttribute("value", listArray.length - 1)
            listCheck.addEventListener("change", function () {
                let i = this.getAttribute("value")
                if (this.checked){
                listArray[i].done = true
            } else {
                listArray[i].done = null
            }
                console.log(this.checked)
                console.log(listArray)
            })
            newRow = document.createElement("div")
            newRow.setAttribute("class", "row")
            newRow.setAttribute("value", listArray.length - 1)
            col1 = document.createElement("div")
            col1.setAttribute("class", "col-4")
            col2 = document.createElement("div")
            col2.setAttribute("class", "col-8")
            newRow.setAttribute("id", `row-${listArray.length - 1}`)
            calendar = document.createElement("input")
            calendar.setAttribute("type", "datetime-local")
            calendar.setAttribute("id", `calendar-${listArray.length - 1}`)
            calendar.setAttribute("value", listArray.length - 1)
            btn = document.createElement("button")
            btn.innerHTML = "Aggiungi scadenza"
            btn.setAttribute("class", "btn")
            btn.setAttribute("type", "button")
            btn.setAttribute("id", `cal-add-btn-${listArray.length - 1}`)
            btn.setAttribute("value", listArray.length - 1)
            btn.setAttribute("style", "border: 1px solid black")
            btn.addEventListener("click", function () {
                let i = this.value
                let cal = document.getElementById(`calendar-${i}`)
                console.log(cal.value)
                let date = Date.parse(cal.value)
                console.log(date - Date.now())
                if (Date.now() < date) {
                    cal.setAttribute("disabled", true)
                    document.getElementById(`cal-rem-btn-${i}`).removeAttribute("hidden")
                    this.setAttribute("hidden", true)
                    listArray[i].expiry = cal.value
                } else {
                    alert("Data inserita non valida")
                }
                console.log(listArray)
            })
            btn1 = document.createElement("button")
            btn1.innerHTML = "Rimuovi scadenza"
            btn1.setAttribute("class", "btn")
            btn1.setAttribute("type", "button")
            btn1.setAttribute("id", `cal-rem-btn-${listArray.length - 1}`)
            btn1.setAttribute("value", listArray.length - 1)
            btn1.setAttribute("hidden", true)
            btn1.setAttribute("style", "border: 1px solid black")
            btn1.addEventListener("click", function () {
                let i = this.value
                let cal = document.getElementById(`calendar-${i}`)
                cal.removeAttribute("disabled")
                listArray[i].expiry = null
                document.getElementById(`cal-add-btn-${i}`).removeAttribute("hidden")
                this.setAttribute("hidden", true)
            })
            btn2 = document.createElement("button")
            btn2.innerHTML = "Elimina elemento"
            btn2.setAttribute("class", "btn")
            btn2.setAttribute("type", "button")
            btn2.setAttribute("id", `del-btn-${listArray.length - 1}`)
            btn2.setAttribute("value", listArray.length - 1)
            btn2.setAttribute("style", "border: 1px solid black")
            btn2.addEventListener("click", function () {
                console.log(this)
                let i = this.value
                console.log(i)
                delete listArray[i]
                listArray.length = listArray.length - 1
                listContainer.removeChild(document.getElementById(`row-${i}`))
                for (let j = i; j < (listArray.length - 1); j++) {
                    listArray[j] = listArray[j + 1]
                    document.getElementById(`row-${j + 1}`).setAttribute("value", j)
                    document.getElementById(`row-${j + 1}`).setAttribute("id", `row-${j}`)
                    document.getElementById(`del-btn-${j + 1}`).setAttribute("value", j)
                    document.getElementById(`del-btn-${j + 1}`).setAttribute("id", `del-btn-${j}`)
                }

            })
            newRow.appendChild(col1)
            newRow.appendChild(col2)
            col1.appendChild(listCheck)
            col1.appendChild(objectLabel)
            col2.appendChild(calendar)
            col2.appendChild(btn)
            col2.appendChild(btn1)
            col2.appendChild(btn2)
            listContainer.appendChild(newRow)
            document.getElementById("list-input").value = null
        }
    }
    
})

