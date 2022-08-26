const mongoose = require("mongoose");

const launchesSchema = new mongoose.Schema({
    flightNumber:{ // oltre il type possiamo inserire tutte le validazioni necessarie
        type: Number,
        required: true,
        default: 100,
        // min: 100,
        // maz: 999, ecc ecc
        
    },

    launchDate: {type: Date, required: true},
    mission: {type: String, required: true},
    rocket: {type: String, required: true},
  // pensandola in termini SQL target sarebbe su una tabella diversa
    // quindi avremmo bisogno di una foreign key per avvedervi. 
    // che si puo utilizzare ma non è il massimo
    // target: {
    //     type: mongoose.ObjectId, // SE VOLESSIMO USARE UN APPROCCIO CON FK
    //     ref: "Planet"
    // }
    // E PREFERIBILE NON FORZARE UN UTILIZZO SIMILE AL SLQ XKE MongoDB NON SUPPORTA COSE come JOIN
    // Quindi per fare una join dovremmo essere noi a scrivere tutto il codice

    // QUINDI FAREMO il NoSQL Approach ovviamente
    target: {
        type: String, // è semplicemente una stringa in MongoDB
        required: true,
    },

    upcoming: {
        type: Boolean,
        required: true
    },
    success:{
        type: Boolean,
        required: true,
        default: true
    },
    customers:[ String ],// un array di stringhe

    
});
//Connects launchesSchema with the "launches" collection
module.exports = mongoose.model('Launch'/*lo fa diventare plurale low case*/, launchesSchema);
// questo statement si chiama COMPILING THE MODEL
  