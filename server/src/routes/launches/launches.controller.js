const {getAllLaunches, scheduleNewLaunch, existsLaunghWithId, abortLaunchById} = require("../../models/launches.model");

async function httpGetAllLaunches(req, res){
    //sfortunatamente la nostra MAP dei lanci non è compatibile con JSON, non possiamo trasformarla direttamente
    // quindi non possiamo fare semplicemente questa cosa 
    // return resizeBy.status(200).json(); 
    // siccome pero noi vogliamo solo i valori delle key dentro la collection MAP
    // dobbiamo accedere ai valori del Map launches "launches.values() " che ci restituisce un
    //oggetto iterabile che quindi possiamo trasformare in array compatibile con JSON
    return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res){
//req.body viene popolato dal middleware inserito nell'app express app.use(express.json());
    const launch = req.body;
    // per trasformare la data da stringa come arriva dal JSON in una data vera facciamo così 

    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
        return res.status(400).json({ // client error (generic bad request)
            error: "Missing required launch property"
        }); 
    }

    launch.launchDate = new Date(launch.launchDate); // questo comprenderebbe anche gli errori di formato
    // se passassi a new Date una stringa dal formato sbagliato, mi restituirebbe un errore "Invalid Date"
    // che io posso sfruttare per fare la validazione
    
    // if(launch.launchDate.toString() === "Invalid Date"){
    //     return res.status(400).json({ 
    //         error: "Invalid launch date"
    //     })
    // }

    // OPPURE PIù SEMPLICEMENTE POSSO FARE ANCHE COSÌ 
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            error: "Invalid launch date"
        });
    }
    
    await scheduleNewLaunch(launch);
    //dobbimao rispontere al client con dei dati anche se è una POST request
    return res.status(201).json(launch);
}

function httpAbortLaunch(req, res){
    // recuperiamo l'id dal URL

    //ATTENZIONE CHE req.params.id è UNA STRINGA e quando cercherai di usarla ti dara errore
    const launchId = +req.params.id; 
    // modi per trasformarlo in numero 
    // const launchId = +req.params.id; con il segno più 
    // const launchId = Number(req.params.id);

    // anche qui dobbiamo fare dei controlli, che ci vengono facili perché abbiamo creato la funzione 
    // dentro il model che verifica l'esistenza di un lancio
    if(!existsLaunghWithId(launchId)){
        return res.status(404).json({
            error: "Launch not found"
        });
    }
    // altrimenti faccio l'abort
    const aborted = abortLaunchById(launchId);
    return res.status(200).json(aborted);


}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
};