const { getAllPlanets } = require('../../models/planets.model');

async function httpGetAllPlanets(req, res){
    // inseriamo il return perche così siamo sicuri che non succede altro 
    // ci viene restituito il risultato e fine     
    return res.status(200).json(await getAllPlanets());
}

module.exports = {
    httpGetAllPlanets
}