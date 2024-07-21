const csvtojson = require('csvtojson');
const fs = require('fs');

const convertCsvToJson = async (csvFilePath, jsonFilePath) => {
  const jsonArray = await csvtojson().fromFile(csvFilePath);
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2));
};

convertCsvToJson('./data/villages.csv', './json/villages.json');