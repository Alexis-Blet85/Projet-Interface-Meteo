// Charger la configuration (ville + coordonnées)
async function chargerConfig() {
    const response = await fetch("conf.json");
    return await response.json();
}

// Charger la météo via Open-Meteo
async function chargerMeteo(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`;
    const response = await fetch(url);
    return await response.json();
}

// Afficher les données météo
function afficherMeteo(ville, meteo) {
    document.getElementById("ville").textContent = ville;
    document.getElementById("temperature").textContent = meteo.temperature + "°C";

    // Conditions météo weathercode
    const conditions = {
        0: "Ciel dégagé",
        1: "Principalement clair",
        2: "Partiellement nuageux",
        3: "Nuageux",
        45: "Brume",
        48: "Brouillard",
        51: "Bruine",
        61: "Pluie",
        80: "Averses",
        71: "Neige"
    };

    document.getElementById("conditions").textContent =
        conditions[meteo.weathercode] || "Conditions inconnues";

    document.getElementById("vent").querySelector("span").textContent = meteo.windspeed + " km/h";

    document.getElementById("humidite").textContent = "Humidité : " + meteo.humidite + " %";

    // Icône météo
    const icone = document.getElementById("icone-meteo");

    if ([0, 1].includes(meteo.weathercode)) {
        icone.src = "img/soleil.png";
    } else if ([2, 3, 45, 48].includes(meteo.weathercode)) {
        icone.src = "img/nuage.png";
    } else if ([51, 61, 80].includes(meteo.weathercode)) {
        icone.src = "img/pluie.png";
    } else if (meteo.weathercode === 71) {
        icone.src = "img/neige.png";
    } else {
        icone.src = "";
    }
}

// Mettre à jour l'heure
function mettreAJourHeure() {
    const maintenant = new Date();
    const formatHeure = { hour: "2-digit", minute: "2-digit" };

    document.getElementById("heure").textContent =
        maintenant.toLocaleTimeString("fr-FR", formatHeure);
}

// Mettre à jour la date au format ../../..
function mettreAJourDate() {
    const maintenant = new Date();

    let jour = String(maintenant.getDate()).padStart(2, "0");
    let mois = String(maintenant.getMonth() + 1).padStart(2, "0");
    let annee = String(maintenant.getFullYear()).slice(2); 

    document.getElementById("date").textContent = `${jour}/${mois}/${annee}`;
}

// Mettre à jour la météo
async function majMeteo() {
    const config = await chargerConfig();
    const data = await chargerMeteo(config.latitude, config.longitude);

    // Humidité
    const humidite = data.hourly.relativehumidity_2m[0];

    const meteo = {
        temperature: data.current_weather.temperature,
        weathercode: data.current_weather.weathercode,
        windspeed: data.current_weather.windspeed,
        humidite: humidite
    };

    afficherMeteo(config.ville, meteo);
}

// Initialisation
async function init() {
    await majMeteo();          
    mettreAJourHeure();        
    mettreAJourDate();         

    setInterval(majMeteo, 3600000);     
    setInterval(mettreAJourHeure, 60000); 
}

init();

