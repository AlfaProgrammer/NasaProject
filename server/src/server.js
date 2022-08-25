// cerchiamo di tenere separate le configurazioni del server 
// da quelle delle funzionalità dell'app express
// quindi creo un server dal buit in package http e gli passo l'istanza dell'app express

// richiediamo prima i package necessari 
const http = require("http");
const app = require("./app"); // passo l'app gia costruita dentro un altro file.
// non gli sto passando l'istanza vuota risultato di express()
const { palnetsModel, loadPlanetsData } = require("./models/planets.model");

const mongoose = require("mongoose");

const PORT = process.env.PORT || 8000;

const MONGO_URL = "mongodb+srv://nasa-api:QgjyByJPMBTw9moa@nasacluster.qg3zpwv.mongodb.net/nasa?retryWrites=true&w=majority";

// creiamo il server
const server = http.createServer(app); 
// passiamo al server l'applicazione express

mongoose.connection.once("open", () => {
    // mongoose.connection è un event emitter che monitora varie azioni (come open)
    // once per chiamare la callback una volta sola.
    console.log("MongoDB connection ready");
});
// gestione errori
mongoose.connection.on('error', (err) => {
    //on perche a differenza della connessione posso avere bisogno 
    // invocare più volte questa callback
    console.error(err);
})

async function startServer(){
    await mongoose.connect(MONGO_URL, { // settimao questo oggetto OBBLIGATORIO per non avere errori
        useNewUrlParser: true, //determina come verra parsata la stringa MONGO_URL
        // useFindAndModify: false, //disabilita i metodi datati per aggiornare i dati in Mongo
        // useCreateIndex: true, //Perche utilizzi questa fn CreateIndex invece di una più vecchia EnsureIndex
        useUnifiedTopology: true,// Utilizzera i modi aggiornati per parlare ai cluster di MongoDB
    });
    // Tutte queste sopra sono opzioni nel MongoDB Driver che Mongoose utilizza per connettersi al DB
    // MongoDB driver è l'API ufficiale che Node utilizza per comunicare con MongoDB
    // ci connettiamo al db prima di richiedere qualsiasi dato 

    await loadPlanetsData(); // prima aspetterà che questa Promise venga risolta prima di partire con 
    //il server.listen

    server.listen(PORT, ()=> {
        console.log(`Accedi al server http://localhost:${PORT}`)    
    });
}

startServer()
/***Facendo in questo modo possiamo gestire la nostra app in un altro file che chiameremo app.js */