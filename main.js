import Map from "ol/Map";
import View from "ol/View";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource, { VectorSourceEvent } from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Circle, Fill, Stroke, Style } from "ol/style";

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

const result = await fetch("./tourist_attractions.geojson");
const data = await result.json();

let features = new GeoJSON().readFeatures(data);

// just get the 1st 1000 features
features = features.slice(0, 1000);

const vectorSource = new VectorSource();

const image = new Circle({
  radius: 7,
  stroke: new Stroke({ color: "red", width: 2 }),
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

console.log(vectorSource);

const vectorLayer = new VectorLayer({
  source: vectorSource,
});

console.log(vectorSource.getFeatures().length);

map.addLayer(vectorLayer);

// create an overlay to show the some info about the place
function createOverlay(map) {
  console.log("Create Overlay");
}

// search functionality
let searchButton = document.querySelector("#search_button");
let search_item = document.getElementById("search");
let list = document.getElementById("ta_list");
let clearBtn = document.getElementById("close_btn");
let resetMapBtn = document.getElementById("reset_map_button");
// let closeSpan = document.getElementById("basic-addon1");


let searching = false;
let properties = [];

/**
 *
 * @param {Array} features
 */
function searchFeaturesByName(features) {
  if (properties.length > 0) {
    properties = [];
  }

  features.forEach((element) => {
    const property = element.getProperties();

    // console.log(property.name);

    if (typeof property.name == "object") {
      if (Object.values(property).includes(search_item.value)) {
        properties.push(property.amenity);

        console.log(
          "Found a match of the object!! with id: " + property.osm_id
        );
      }
    }

    if (property.name == search_item.value) {
      console.log("Found a match!! with id: " + property.osm_id);
      properties.push(property.amenity);

      // display that feature now
      // 1. First clear the vectorSource
      vectorSource.clear();

      // add the feature and zoom to it
      vectorSource.addFeature(element);

      let coordinates = element.getGeometry().getCoordinates();
      console.log(coordinates);

      map.setView(
        new View({
          projection: "EPSG:4326",
          center: fromLonLat([coordinates[0], coordinates[1]], "EPSG:4326"),
          zoom: 10,
        })
      );

      console.log(vectorSource);
    }
  });

  console.log("Searching complete...");
  console.log(properties);

  console.log(`${list} has ${list.childNodes.length} children`);

  if (list.childNodes.length > 0) {
    console.log(list.lastChild);

    list.lastChild.remove();
  }

  if (properties.length === 0) {
    search_item.style.color = "red";

    list.append("Results not found!");

    console.log(list);

    list.style.visibility = "visible";
    list.style.display = "block";
  }
  properties.forEach((p) => {

    
    const l1 = document.createElement("li");
    const l2 = document.createTextNode(`${p}`);
    l1.appendChild(l2);

    console.log(list.childNodes.length);

    list.appendChild(l1);

    list.style.visibility = "visible";
    list.style.display = "block";
  });
}

searchButton.addEventListener("click", () => {
  searching = true;

  console.log(`Searching for ${search_item.value}: ......`);

  searchFeaturesByName(features);
  searching = false;
});


// clear the input and remove the list element
clearBtn.addEventListener("click", () => {
  const childNodes = list.childNodes;
  if (childNodes.length > 1) {
    childNodes.forEach((node) => {
      node.remove();
    });
  }

  console.log(childNodes[0]);

  list.removeChild(childNodes[0]);

  console.log("DOM is cleared...");

  //clear the vector Source and add the other features
  vectorSource.clear();

//   getFeaturesByName(features);

  search_item.value = "";
});

/**
 * Reset Map to it's previous state
 */
function resetMap() {
  console.log("Map has been reset...");
//  map.getLayers()[1]
console.log(map.getLayers())
}

resetMapBtn.addEventListener("click", resetMap);


