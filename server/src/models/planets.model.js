const path = require("path");
const {parse} = require("csv-parse"); // da installare 
const fs = require("fs");

const habitablePlanets = [];

function isHabitablePlanet(planet){
    return planet['koi_disposition'] === "CONFIRMED"
        && planet["koi_insol"] > 0.35 && planet["koi_insol"] < 1.11
        && planet["koi_prad"] < 1.6;
}

function loadPlanetsData(){

    return new Promise( (resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', "data", 'kepler_data.csv'))
        .pipe(parse({
            comment: "#",
            columns: true
        }))
        .on('data', (data)=>{ //data è l'evento che emette il questa funzione. C'è anche close e error
            if(isHabitablePlanet(data)){
                habitablePlanets.push(data)
            }
        })
        .on('error', (err) => {
            console.log(err);
            reject(err);
        })
        .on('end', () => {
            console.log(`Found ${habitablePlanets.length} habitable planets`);
            resolve();
        })
    })
}

function getAllPlanets(){
    return habitablePlanets;
}

//parse();
module.exports = {
    loadPlanetsData,
    getAllPlanets,
};