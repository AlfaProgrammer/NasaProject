const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

const launches = new Map();
//E come una mappatura di tutti i lanci (una dictionary)
// la cosa bella è che tiene conto dell'ordine in cui vengono inseriti i dati


// definiamo prima i dati necessari di un lancio di cui tenere traccia
const launch = {
    flightNumber: 100,
    mission: "Mission Name",
    rocket: "RocketName",
    launchDate: new Date('December 27, 2030'),
    target: "Kepler-442 b",
    customers: ['Nasa', 'SpaceX'],
    upcoming: true,
    success: true
};

saveLaunch(launch);

// creo funzione per verificare l'esistenza di un lancio all'interno della collection launches
function existsLaunghWithId(launchId){
    return launches.has(launchId);
}

// ora potremmo recuperare il lancio in base al suo numero di volo
// launches.get(100) === launch ma noi abbiamo bisogno di esportare tutta la collection dei lanci
async function getAllLaunches(){
    return await launchesDatabase.find({},{
        "_id": 0,
        "__v": 0,
    });
}

//prima faccio un sort decrescente poi ne estraggo un documento
async function getLatestFlightNumber(){
    const latestLaunch = await launchesDatabase
    .findOne()
    .sort('-flightNumber')//sort mi restituisce un ordine crescente. Con il meno sarà decrescente

    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

//upsert operation 
async function saveLaunch(launch){

    const planet = await planets.findOne({ // per non restituire una lista ma un singolo oggetto
        keplerName: launch.target
    });

    if (!planet){
        // non abbiamo la possibilita di dare suna risposta al client da qui
        // non c'è accesso a req o res (non siamo nel controller). Lanciamo quindi un errore
        throw new Error("No matching planet found");
    }

    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

// creo funzione che aggiunge un lancio al DB
async function scheduleNewLaunch(launch){
    const newFlightNumber = await getLatestFlightNumber() + 1 ;

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ["Nasa", "SpaceX"],
        flightNumber: newFlightNumber
    })

    await saveLaunch(newLaunch);
}

function abortLaunchById(launchId){
    // invece di rimuovere un dato lo segnamo come abortet
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;

    return aborted;
}

module.exports={
    existsLaunghWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById
}