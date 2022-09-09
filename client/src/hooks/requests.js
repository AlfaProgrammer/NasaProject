const API_URL = "v1"; // il front end vive sullo stesso indirizzo del server quando online

async function httpGetPlanets() {
  // dobbiamo ricordarci che sono su2 PORT differenti
  const response = await fetch(`${API_URL}/planets`);
  return await response.json(); // perché la risposta del endpoint che andiamo a 
  // richiedere è in formato json
  // Load planets and return as JSON.
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`);
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort( (a, b) => { //sort ce li mette solo in ordine 
    return a.flightNumber - b.flightNumber;
  });
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  // metto tutto dentro il try catch perché se il server non risponde 
  // non avrò nessun tipo di riscontro (server down per esempio)
  try {
    return await fetch(`${API_URL}/launches`,{
      method: "post",
      headers: {
        "Content-Type": "application/json" // altrimenti il body non è comprensibile
      },
      //dobbiamo passare al body del post i dati da portare al server
      // Esso deve essere una string JSON
      body: JSON.stringify(launch),  
    })
  } catch (err) {
    return {
      ok: false
    }
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    }); 
  } catch (err) {
    console.log(err);
    return {
      ok: false,
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};