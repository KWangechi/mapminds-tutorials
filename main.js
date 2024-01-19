import Map from "ol/Map";
import View from "ol/View";
import OSM from 'ol/source/OSM';
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {Circle, Fill, Stroke, Style} from 'ol/style';




const map = new Map({
    target: "map",
    layers: [
        new TileLayer({
            source: new OSM()
        })
    ],
    view: new View({
        projection: 'EPSG:4326',
        center: fromLonLat([37.9083264, 0.1768696], 'EPSG:4326'),
        zoom: 6,
        minZoom: 2,
        maxZoom: 20
    })
});

console.log('Test Map...');

const result = await fetch('./tourist_attractions.geojson');
const data = await result.json();

let features = new GeoJSON().readFeatures(data);

// just get the 1st 1000 features
features = features.slice(0,1000);

const vectorSource = new VectorSource();

const image = new Circle({
    radius: 5,
    fill: new Fill({
        color: 'red'
    }),
    stroke: new Stroke({color: 'red', width: 1}),
  });


// style the feature
features.forEach(feature => {
    const style = new Style({
        image: image
    });

    // console.log(feature);
    vectorSource.addFeature(feature);

    feature.setStyle(style);

});


console.log(vectorSource);

const vectorLayer = new VectorLayer({
    source: vectorSource
});

console.log(vectorSource.getFeatures().length);

map.addLayer(vectorLayer);


// create an overlay to show the some info about the place
function createOverlay(map) {
    console.log('Create Overlay');
}

/**
 * 
//  * @param {Array} features 
 */
function getFeaturesByName(features) {

}
// search functionality
let searchButton = document.querySelector("#search_button");

searchButton.addEventListener('click', )

createOverlay(map);