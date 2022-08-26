const path = require("path");
const {parse} = require("csv-parse"); // da installare 
const fs = require("fs");
const planets =require("./planets.mongo");

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
        .on('data', async (data)=>{ //data è l'evento che emette il questa funzione. C'è anche close e error
            if(isHabitablePlanet(data)){
                savePlanet(data);
            }
        })
        .on('error', (err) => {
            console.log(err);
            reject(err);
        })
        .on('end', async () => {
            const countPlanetsFound = (await getAllPlanets()).length
            console.log(`Found ${countPlanetsFound} habitable planets`);
            resolve();
        })
    })
}

// funzione asincrona perche devo recupera tutti i dati prima di dare un risultato
// devo anche ricordare di fare asincrona anche la funzione del controller che utilizza questa funzione 
async function getAllPlanets(){
    return await planets.find({})
    //gio che passi al method viene applicato come filtro
    //filtro vuoto = tutti i record
}

async function savePlanet(planet){
    // questa cosa potrebbe dare degli errori che dobbiamo assolutamente catturare
    try {
        //upsert = insert + update
        // ci permette di inserire nuovi record solo se non esistono già
        // noi chiamiamo questa funzione nel file server.js che viene invocata ogni volta all'avvio del server
        // quindi per evitare di inserire sempre gli stessi record facciao un UPSERT
        await planets.updateOne({
            // qui seguiamo il pattern del nostro SCHEMA
            keplerName: planet.kepler_name
            }, 
            {
            keplerName: planet.kepler_name
            },
            {
            upsert: true, // per attivare le funzionaità upsert
            });
            // il primo parametro di updateOne è il documento da trovare con il filtro passato
            // il secondo è il dato che vogliamo inserire o aggiornare nel caso esista gia
    } catch (err) {
        console.error(`Could not save planet ${err}`)
    }
}

//parse();
module.exports = {
    loadPlanetsData,
    getAllPlanets,
};