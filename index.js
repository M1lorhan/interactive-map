let selectEl = document.querySelector('select')
let listEl = document.querySelector('ul')

let map = L.map('map').setView([51.005, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

navigator.geolocation.getCurrentPosition((position) => {
    //gettimg the location
    //position = (coords: (latitide, longitude, accuracy))
    let {coords: {latitude, longitude}} = position
    console.log('it works:', [latitude, longitude])
    map.setView([latitude, longitude])

    L.marker([latitude, longitude]).addTo(map)
        .bindPopup("You are here")
        .openPopup();
}, (error) => {
    console.error('Error getting location:', error);
});

function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}
map.on('click', onMapClick);

document.querySelector('button').addEventListener('click', (event) => {
    const categoryID = selectEl.value
    
    const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'fsq328xpwLkPJoyRxXENC4P83jiIMJNxTTDaH5eKXrXBPjg=',
    },
};

fetch(`https://api.foursquare.com/v3/places/search?categories=${categoryID}&sort=DISTANCE&limit=5`, options)
        .then(response => response.json())
        .then(({results}) => {
            listEl.innerHTML = '';

            results.forEach(result => {
                const listItem = document.createElement('li');
                listItem.textContent = result.name;
                listEl.appendChild(listItem);

                if (result.geocodes && result.geocodes.main) {
                    const { latitude, longitude } = result.geocodes.main;

                    let popupContent = `<b>${result.name}</b><br>`;
                    if (result.location && result.location.address) {
                        popupContent += `Address: ${result.location.address}<br>`;
                    }

                    L.marker([latitude, longitude]).addTo(map)
                        .bindPopup(popupContent)
                        .openPopup();
                }
            });
        })
        .catch(err => console.error(err));
});