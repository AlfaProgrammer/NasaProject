const mongoose = require("mongoose");

const planetsSchema = new mongoose.Schema({
    // l'ideale sarebbe avere il nome uguale a quello usato nel frontend
    // client/src/pages/Launch.js quindi ....
    keplerName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Planet", planetsSchema);