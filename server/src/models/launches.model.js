const launches = new Map();
//E come una mappatura di tutti i lanci (una dictionary)
// la cosa bella è che tiene conto dell'ordine in cui vengono inseriti i dati


let latestFlightNumber = 100

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

//settiamo la key che deve tracciare il lancio
launches.set(launch.flightNumber, launch);

// creo funzione per verificare l'esistenza di un lancio all'interno della collection launches
function existsLaunghWithId(launchId){
    return launches.has(launchId);
}

// ora potremmo recuperare il lancio in base al suo numero di volo
// launches.get(100) === launch ma noi abbiamo bisogno di esportare tutta la collection dei lanci
function getAllLaunches(){
    return Array.from(launches.values());
}

//adding a launch to the MAP
function addNewLaunche(launch){
    latestFlightNumber++;
    launches.set(
        latestFlightNumber, 
        // assegnamo i dati di default di un lancio che non devono essere chiesti quindi al client
        Object.assign(launch, {
            customers: ["Nasa", "SpaceX"],
            upcoming: true,
            success: true,
            flightNumber: latestFlightNumber,
    }));
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
    addNewLaunche,
    abortLaunchById
}