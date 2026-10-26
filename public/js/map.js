 
     mapboxgl.accessToken = mapToken;
     

    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: listingss.geometry.coordinates,
        zoom: 8
    });

       new mapboxgl.Marker({color: 'red'})
        .setLngLat(listingss.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset:25})
        .setHTML(
        `<h1>${listingss.location}</h1><p>Exact Location will be provided after booking!</p>`
    )
)
    
    .addTo(map);
       

