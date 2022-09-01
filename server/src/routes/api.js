const express = require("express");


//Router
const planetsRouter = require("./planets/planets.router");
const launchesRouter = require('./launches/launches.router');

const api = express.Router();

api.use("/planets",planetsRouter);
// per non ripetere ad ogni funzione del controller che è riferita a questo endpoint
// posso inserire nel middlewer del router l'endpoint stesso
api.use('/launches',launchesRouter);

module.exports = api;

// questo sara il file dell'api per la versione 1