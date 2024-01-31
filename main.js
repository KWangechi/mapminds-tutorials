import Map from "ol/Map";
import View from "ol/View";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource, { VectorSourceEvent } from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Circle, Stroke, Style } from "ol/style";


async function initializeMap() {
const map = new Map({
    target: "map",
    layers: [
        new TileLayer({
            source: new OSM(),
        }),
    ],
    view: new View({
        projection: "EPSG:4326",
        center: fromLonLat([37.9083264, 0.1768696], "EPSG:4326"),
        zoom: 6,
        minZoom: 2,
        maxZoom: 20,
    }),
});

console.log("Map initializing...");

const result = await fetch("/api/kenya-pois");
const data = await result.json();

// console.log(data);
let features = new GeoJSON().readFeatures(data);

// just get the 1st 1000 features
features = features.slice(0, 1000);

const vectorSource = new VectorSource();

const image = new Circle({
    radius: 7,
    stroke: new Stroke({ color: "#CF5D45", width: 1.5 }),
});

// style the feature
features.forEach((feature) => {
    const style = new Style({
        image: image,
    });

    // console.log(feature);
    vectorSource.addFeature(feature);

    feature.setStyle(style);
});

const vectorLayer = new VectorLayer({
    source: vectorSource,
});

console.log(vectorSource.getFeatures().length);

map.addLayer(vectorLayer);
}

initializeMap();
