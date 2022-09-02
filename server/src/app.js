const express = require('express');
const cors = require('cors');
const path = require("path")
const morgan = require("morgan");

const api = require("./routes/api")

const app = express();
// utilizziamo subito questo middlewere per garantire un Parsing
// dei dati che ci arrivano dal client
// app.use(cors()); per permettere a tutti i siti
app.use(cors({
    origin: "http://localhost:3000" // permetto al front end di fare richiest al mio backend
}));

app.use(morgan('combined'));


app.use(express.json()); // mi inserisce body nella chiamata post
app.use(express.static(path.join(__dirname,'..','public')));

app.use("/v1", api); // api = file dell'api //v1 = parametro dell url 
//posso avere quante versioni voglio
// app.use("/v2", v2Router); // api = file dell'api //v1 = parametro dell url 

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})

module.exports = app;