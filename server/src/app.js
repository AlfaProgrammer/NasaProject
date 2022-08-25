const express = require('express');
const cors = require('cors');
const path = require("path")
const morgan = require("morgan");

//Router
const planetsRouter = require("./routes/planets/planets.router");
const launchesRouter = require('./routes/launches/launches.router');

const app = express();
// utilizziamo subito questo middlewere per garantire un Parsing
// dei dati che ci arrivano dal client
// app.use(cors()); per permettere a tutti i siti
app.use(cors({
    origin: "http://localhost:3000"
}));

app.use(morgan('combined'));


app.use(express.json());
app.use(express.static(path.join(__dirname,'..','public')));

app.use("/planets",planetsRouter);
// per non ripetere ad ogni funzione del controller che è riferita a questo endpoint
// posso inserire nel middlewer del router l'endpoint stesso
app.use('/launches',launchesRouter);

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})

module.exports = app;