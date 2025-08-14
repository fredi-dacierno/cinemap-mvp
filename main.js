// main.js

// API-Key aus Netlify (oder FAKE fallback für lokale Tests)
const apiKey = window.GOOGLE_MAPS_KEY || "FAKE";

// Maps Script dynamisch laden
const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=maps`;
script.async = true;
script.defer = true;
document.head.appendChild(script);

// Modal-Funktionen
function showModal(kino) {
  const modal = document.getElementById("kinoModal");
  document.getElementById("modalKinoName").textContent = kino.name;
  document.getElementById("modalKinoAdresse").textContent = `${kino.strasse}, ${kino.ort}`;
  document.getElementById("modalKinoPreis").textContent = `${(kino.preis_pro_monat || 0).toFixed(2)} CHF`;
  modal.style.display = "block";
}

function closeModal() {
  document.getElementById("kinoModal").style.display = "none";
}

// Map-Funktion (global verfügbar für Google Maps Callback)
window.initMap = function () {
  fetch("kino_daten.json")
    .then((response) => response.json())
    .then((data) => {
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: { lat: data[0].lat, lng: data[0].lng },
        mapId: "DEIN_MAP_ID_WENN_GESETZT" // optional
      });

      data.forEach((kino) => {
        const marker = new google.maps.Marker({
          position: { lat: kino.lat, lng: kino.lng },
          map,
          title: kino.name,
        });

        const info = new google.maps.InfoWindow({
          content: `<strong>${kino.name}</strong><br>ab CHF ${(kino.preis_pro_monat || 0).toFixed(2)}`
        });

        marker.addListener("mouseover", () => info.open(map, marker));
        marker.addListener("mouseout", () => info.close());
        marker.addListener("click", () => showModal(kino));
      });
    });
};
