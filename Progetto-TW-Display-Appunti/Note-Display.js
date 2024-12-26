//string di test
let text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut cursus risus urna. Quisque sem nunc, auctor a lorem eu, mattis molestie mi. Aliquam mauris leo, lobortis sed dictum a, pellentesque placerat libero. Donec ultricies feugiat nisl ac maximus. Nulla augue felis, tincidunt a tellus nec, aliquam tempor urna. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec vehicula blandit purus ac aliquet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae convallis neque, non congue lacus. Ut vitae sem mi. Integer eget odio quis dui pharetra ultrices eu a ligula. Quisque consequat tempor blandit. Fusce posuere non urna in dignissim. Nulla facilisi. Sed lorem mi, cursus tristique lobortis vitae, varius vel velit. Suspendisse vel dolor mi. Nunc sodales ultricies ipsum, ullamcorper dapibus lorem. In pharetra, neque nec efficitur eleifend, massa enim luctus mi, a porta quam ante sed augue. Quisque elit lectus, ultrices ac condimentum ac, gravida in erat. Donec blandit in tortor eu feugiat. Donec vitae enim eget mi imperdiet condimentum vel in nibh. Integer vulputate risus nunc, vitae lacinia ligula cursus eu. Praesent ut pharetra risus. Curabitur non varius nibh, eget convallis nibh. Quisque ut felis tempor, aliquam orci ac, laoreet diam."
//variabile che rappresenta lunghezza a cui troncare la stringa
const shortlength = 100
//id dell'elemento in cui inserire la versione troncata della stringa
const shortid = "short"
//id dell'elemento in cui inserire la versione lunga della stringa
const longid = "long"

window.onload = function () {shortprint()} 
function shortprint () {
    var paragraph
    var str
if (text.length>shortlength) {
str = text.slice(0,196)+"..."
paragraph = document.createTextNode(str)
} else {
paragraph = document.createTextNode(text)
}
document.getElementById(shortid).appendChild(paragraph)
}

//evento che stampa la versione troncata della stringa
//document.getElementById("expander").onclick = longprint
function longprint () {
    let str = document.createTextNode(text)
    
const paragraph = document.getElementById(longid)
paragraph.removeChild(paragraph.firstChild)
paragraph.appendChild(str)
alert("test")
console.log("test")
}