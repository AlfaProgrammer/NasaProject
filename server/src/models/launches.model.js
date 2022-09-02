const axios = require("axios");

const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

// const launches = new Map();
//E come una mappatura di tutti i lanci (una dictionary)
// la cosa bella è che tiene conto dell'ordine in cui vengono inseriti i dati

//////////////////////// Serviva per il HARDCODING //////////////////////////////////////////////////
// // definiamo prima i dati necessari di un lancio di cui tenere traccia
// const launch = { //segnamo le corrispondenzae con la risposta dell'api SpaceX
//     flightNumber: 100, //flight_number
//     mission: "Mission Name", //name
//     rocket: "RocketName", // rocket.name 
//     launchDate: new Date('December 27, 2030'), //date_local
//     target: "Kepler-442 b", // non ci sono corrispondenze
//     customers: ['Nasa', 'SpaceX'], //payload.customers for each payload (e un altra collection relazionata al lancio )
//     upcoming: true, //upcoming
//     success: true // success
// };
// saveLaunch(launch);

//////////////////////// Serviva per il HARDCODING //////////////////////////////////////////////////


// creo funzione per verificare l'esistenza di un lancio all'interno della collection launches
// function existsLaunghWithId(launchId){
//     return launches.has(launchId);
// }

//replico la funzionalita della funzione sopra però facendo la verifica sul DB
async function existsLaunchWithId(launchId){
    return await findLaunch({
        //noi consideriamo l'id come il flightNumber
        flightNumber: launchId
    });
}


async function findLaunch(filter){
    return await launchesDatabase.findOne(filter);
}

async function getAllLaunches(skip, limit){ // con parametri di paginazione
    return await launchesDatabase
    .find({},{"_id": 0, "__v": 0,})
    .sort({flightNumber: 1})// perche tutti i documenti siano nell ordine che decidiamo
    .skip(skip) // il numero di record da saltare prima di iniziare a recuperare i successivi 50.
    //con limite di 50 record per pagina, sulla prima pagina non devo saltare record, per restituire la seconda pagina devo saltarne 50,
    // per la terza 100 e cosi via
    .limit(limit);/*sempre funzione di mongoose*/
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
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

// creo funzione che aggiunge un lancio al DB
async function scheduleNewLaunch(launch){ // qui ha più senso fare questa verifica
    const planet = await planets.findOne({ // per non restituire una lista ma un singolo oggetto
        keplerName: launch.target
    });
    //vogliamo salvare un nuovo lancio solo se esiste il pianeta tra quelli abitabili
    if (!planet){
        // non abbiamo la possibilita di dare suna risposta al client da qui
        // non c'è accesso a req o res (non siamo nel controller). Lanciamo quindi un errore
        throw new Error("No matching planet found");
    }

    const newFlightNumber = await getLatestFlightNumber() + 1 ;

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ["Nasa", "SpaceX"],
        flightNumber: newFlightNumber
    })

    await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId){
    // invece di rimuovere un dato lo segnamo come abortet
    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;

    // DOPO MONGODB//////
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    })
    // non usiamo upsert peche facciamo già un check prima se il record esiste
    // non c'è bisogno di quella funzionalità 
    return aborted.ok === 1 && aborted.nModified === 1;
}

// loading data from SpaceX API
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches(){
    console.log("Downloading SpaceX data");
    const response = await axios.post(SPACEX_API_URL, {
        // qui inseriamo la query come oggetto che verrà poi trasformato in JSON invece che query params
        query: {},
        options: {
            pagination: false,
            populate: [ //popola il seguente path
                {
                    path: "rocket", //collection name
                    select: { // value to select from this collection
                        "name": 1,
                    }
                },
                {
                    path: "payloads", // il payload stesso è un array che contiene un array di customers
                    select: {
                        customers: 1 // saranno un array
                    }
                }
            ]
        }
    });

    if(response.status !== 200){
        console.log("Problem downloading launch data!");
        throw new Error("Launch data download failde");
    }

    const launchDocs = response.data.docs; //docs è la risposta del API (array)

    for(const launchDoc of launchDocs){
        const payloads = launchDoc['payloads']; // è un array nidificato che dobbiamo trasformare in un singolo array

        const customers = payloads.flatMap( (payload) => {
            return payload['customers'];
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc["name"],
            rocket: launchDoc["rocket"]["name"],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc["success"],
            customers: customers
        };

        console.log(`${launch.flightNumber}, ${launch.mission}`)
        // vedremo solo i primi 10 risultati del fetching sul API xke sta paginando la lista di lanci ritornando 10 lanci per pagina
        //dobbiamo cambiare la paginazione        

        await saveLaunch(launch); // essendo che questi lanci di spacex sono senza destinazione
        // dobbiamo modificare lo chema togliendo il target required
        // e anche la verifica dell'esistenza di tale parametro alla registrazione/salvataggio di un lancio
    }   
}

async function loadLaunchData(){
    // prima di richiedere il download dei dati controlliamo sul nostro DB
    // se uno dei dati che l'api mi restituisce è presente nel mio DB c'è una forte possibilità che ci siano tutti
    // fare questa verifica ci può evitare di far fare del lavoro inutile sia al mio che al server che gestise l'API
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: "Falcon 1",
        mission: "FalconSat"
    });

    if(firstLaunch){
        console.log("Launch data already loaded !")
        return;
    } else {
        await populateLaunches();
    }
    
}

module.exports={
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
    loadLaunchData
}