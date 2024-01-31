const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 3000;


const readGeojsonFeatures = async () => {
    try {
        const data = await fs.readFile(path.join(__dirname, '../kenya_pois.geojson'), 'utf-8');
        return JSON.parse(data);
      } catch (error) {
        console.error('Error reading data from file:', error.message);
        return null;
      }
}

// API route
app.get('/api/kenya-pois', async (req, res) => {
    // allow the api to be accesses from another url
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const jsonData = await readGeojsonFeatures();

    // console.log(jsonData.features);

    if(jsonData) {
        res.json(jsonData);
    }
    else {
        res.status(500).json({message: 'Error fetching data...'});
    }
    return jsonData;

});


// start the application
app.listen(port, () => {
    console.log('Application started and running on port ' + port + '.....');
})

//export the API for Vercel to deploy
module.exports = app;

