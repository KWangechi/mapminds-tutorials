import Map from "ol/Map";
import View from "ol/View";
import OSM from 'ol/source/OSM';
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";



console.log('Test Map...');

const result = await fetch('./tourist_attractions.geojson');
const data = await result.json();

const features = new GeoJSON().readFeatures(data);

const vectorSource = new VectorSource({
    features: features
});

console.log(vectorSource);

const vectorLayer = new VectorLayer({
    source: vectorSource
});

console.log(vectorSource.getFeatures());

const map = new Map({
    target: "map",
    layers: [
        new TileLayer({
            source: new OSM()
        }),
        vectorLayer
    ],
    view: new View({
        center: [0,0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 20
    })
});

// map.addLayer(vectorLayer);

console.log(map.getAllLayers());