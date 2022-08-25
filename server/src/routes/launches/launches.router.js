const express = require("express");
const launchesRouter = express.Router();

const { 
    httpGetAllLaunches, 
    httpAddNewLaunch,
    httpAbortLaunch
} = require("./launches.controller");

/*
 launchesRouter.get("/launches", httpGetAllLaunches);
 launchesRouter.get("/launches", httpGetAllLaunches); 
 per non avere la ripetizione di /launches, che socuramente si ripete per ogni funzione del controller
 ho inserito questo endpoint dentro il middlewere del router
*/

launchesRouter.get("/", httpGetAllLaunches); // il math sara sia su /launches che su /launches/
launchesRouter.post("/", httpAddNewLaunch);
launchesRouter.delete("/:id", httpAbortLaunch);


module.exports = launchesRouter;