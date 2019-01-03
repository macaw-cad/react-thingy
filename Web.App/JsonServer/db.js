const mockFolder = './mock-data/';
const fs = require('fs');
let routes = {};

fs.readdirSync(mockFolder).forEach(file => {
    const contents = fs.readFileSync(`${mockFolder}${file}`, 'utf8');
    const cleanFilename = file.replace('.json', '');

    routes[cleanFilename] = JSON.parse(contents);
});

module.exports = function () {
    return routes;
}