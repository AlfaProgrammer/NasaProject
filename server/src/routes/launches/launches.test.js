const request = require("supertest");
// const { response } = require("../../app");
const app = require("../../app"); //app express
//questa parte ci fa capire quanto sia importante avere il server separato dall'app
// ora possiamo utilizzare l'app anche in altri file 
// non devi preoccuparti di importare il module perche JEST si occupa di trovarle da solo quando va a leggere il file
// il test viene definito nella callback di describe
// che chiama la funzione test che definisce tutti i casi del nostro test
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

const { // QUESTO PER RIUSCIRE A FARE I CI/CD WOrkflow
    loadPlanetsData,
} = require('../../models/planets.model');  

// ora creiamo un ambiente per il test con mongoDB
describe("Launches API", () => {
    //impostiamo un setup statement da eseguire prima dei test
    //quindi noi ci vogliamo collegare al DB
    beforeAll(async () => {
        await mongoConnect();
        await loadPlanetsData(); // QUESTO PER RIUSCIRE A FARE I CI/CD WOrkflow
        // ricorda che il workflow connette i dati ad un DB hostato da GIT creato e distrutto solo per il test
        // motivo per cui quel db non disporrà della collection di pianeti per eseguire i test JEST
    });

    afterAll(async() => {
        await mongoDisconnect();
    });

    describe("test GET /launches", () => {
        test("It should respond with 200 success", async () => {
            const response = await request(app)
                .get("/v1/launches")
                .expect("Content-Type", /json/ )// o una stringa o una regex
                .expect(200);
        });
    }) 
    
    describe("test POST /launch", () => {
        // qui posso inserire i dati da riutilizzare per il mio test
        const completeLaunchData = {
            mission: "USS Enterprise",
            rocket: "NCC 1701-D",
            target: "Kepler-62 f",
            launchDate: "January 4, 2028",
        }
    
        const launchDataWithoutDate = {
            mission: "USS Enterprise",
            rocket: "NCC 1701-D",
            target: "Kepler-62 f",
        }
    
        const launchDataWithoutInvalidDate = {
            mission: "USS Enterprise",
            rocket: "NCC 1701-D",
            target: "Kepler-62 f",
            launchDate: "This is not a date",
        }
    
        test("It should respond with 201 created", async () => {
            const response = await request(app)
            .post("/v1/launches")
            .send(completeLaunchData)// per simulare l'invio di dati da POST request
            .expect("Content-Type", /json/ )
            .expect(201);
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            // facciamo questa cosa perché con il test non si riesce a fare il match della data in entrata
            // con quella in uscita. 
            // la si va quindi a fare il controllo separatamente 
            expect(responseDate).toBe(requestDate);
    
            // Per controllare il BODY della POST REQUEST dobbiamo usare le assertions del API expect di JEST
            // facciamo il controllo sul lancio senza la data 
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });
    
        test("It should catch missing required properties", async () => {
            const response = await request(app)
            .post("/v1/launches")
            .send(launchDataWithoutDate)
            .expect("Content-Type", /json/ )
            .expect(400); // xke manca un dato
    
            expect(response.body).toStrictEqual({
                error: "Missing required launch property"
            });
        });
    
        test("It should catch invalid dates", async () => {
            const response = await request(app)
            .post("/v1/launches")
            .send(launchDataWithoutInvalidDate)
            .expect("Content-Type", /json/ )
            .expect(400); // xke manca un dato
    
            expect(response.body).toStrictEqual({
                error: "Invalid launch date"
            });
        });
    });
});