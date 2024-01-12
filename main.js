import Map from "ol/Map";
import View from "ol/View";
import OSM from 'ol/source/OSM';
import TileLayer from "ol/layer/Tile";
import { fromLonLat, toLonLat} from "ol/proj";


new Map({
    target: "map",
    layers: [
        new TileLayer({
            source: new OSM()
        })
    ],
    view: new View({
        center: fromLonLat([37.9083264, 0.1768696]),
        zoom: 12,
        minZoom: 2,
        maxZoom: 20
    })
});

console.log('Test Map...')