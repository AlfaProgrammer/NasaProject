// cerchiamo di tenere separate le configurazioni del server 
// da quelle delle funzionalità dell'app express
// quindi creo un server dal buit in package http e gli passo l'istanza dell'app express

// richiediamo prima i package necessari 
const http = require("http");

require("dotenv").config(); // popola l'oggetto process.env con i valori presenti nel file .env
// se lo mettiamo sopra tutto sara disponibile anche per tutti i moduli che importiamo sotto

const app = require("./app"); // passo l'app gia costruita dentro un altro file.
// non gli sto passando l'istanza vuota risultato di express()
const { loadPlanetsData } = require("./models/planets.model");
const { mongoConnect } = require("./services/mongo");
const { loadLaunchData } = require("./models/launches.model");


const PORT = process.env.PORT || 8000;


// creiamo il server
const server = http.createServer(app); 
// passiamo al server l'applicazione express



async function startServer(){
    await mongoConnect();

    await loadPlanetsData(); // prima aspetterà che questa Promise venga risolta prima di partire con 
    //il server.listen

    //loading SpaceX data
    await loadLaunchData();

    server.listen(PORT, ()=> {
        console.log(`Accedi al server http://localhost:${PORT}`)    
    });
}

startServer()
/***Facendo in questo modo possiamo gestire la nostra app in un altro file che chiameremo app.js */
/*ABBIAMO SPOSTATO TUTTE LE FUNZIONALITA DI MONGOOSE IN server/src/services/mongo.js */
/*Eliminando anche la call al package mongoose perche qui non ci serve più */