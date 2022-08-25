const express = require("express");
const planetsRouter = express.Router();
const { // importiamo solo li method necessari dal controller
    httpGetAllPlanets
} = require("./planets.controller");

planetsRouter.get("/", httpGetAllPlanets);

module.exports = planetsRouter;