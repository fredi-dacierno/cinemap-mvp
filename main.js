// main.js

// Modal-Logik
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

// Map-Init
function initMap() {
  fetch("kino_daten.json")
    .then(response => response.json())
    .then(data => {
      const center = { lat: data[0].lat, lng: data[0].lng };
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center,
        mapId: "AIzaSyDU3IzdHnU-gNY3AWMhcfbGj35cPTDJ134"
      });

      data.forEach(kino => {
        const marker = new google.maps.Marker({
          position: { lat: kino.lat, lng: kino.lng },
          map,
          title: kino.name,
        });

        const info = new google.maps.InfoWindow({
          content: `<strong>${kino.name}</strong><br>${(kino.preis_pro_monat || 0).toFixed(2)} CHF`,
        });

        marker.addListener("mouseover", () => info.open(map, marker));
        marker.addListener("mouseout", () => info.close());
        marker.addListener("click", () => showModal(kino));
      });
    });
}

// Expose initMap globally for Google callback
window.initMap = initMap;
