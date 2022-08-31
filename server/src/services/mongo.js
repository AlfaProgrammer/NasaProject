// dentro server/src/services/mongo.js
// portiamo qui tutto il codice che usa mongoose dentro server.js 
const mongoose = require('mongoose');

require("dotenv").config(); // importo url da env
const MONGO_URL = process.env.MONGO_URL;

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
});

async function mongoConnect(){
    await mongoose.connect(MONGO_URL, { // settimao questo oggetto OBBLIGATORIO per non avere errori
        useNewUrlParser: true, //determina come verra parsata la stringa MONGO_URL
        // useFindAndModify: false, //disabilita i metodi datati per aggiornare i dati in Mongo
        // useCreateIndex: true, //Perche utilizzi questa fn CreateIndex invece di una più vecchia EnsureIndex
        useUnifiedTopology: true,// Utilizzera i modi aggiornati per parlare ai cluster di MongoDB
    });
    // Tutte queste sopra sono opzioni nel MongoDB Driver che Mongoose utilizza per connettersi al DB
    // MongoDB driver è l'API ufficiale che Node utilizza per comunicare con MongoDB
    // ci connettiamo al db prima di richiedere qualsiasi dato 
}

async function mongoDisconnect(){
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect
};