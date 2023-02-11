const { default: axios } = require("axios");
const fs = require("fs");

console.log("Running script to generate API functions");

async function getProjects() {
    const response = await axios("https://www.exponentialhost.com/api/allProjects?projection=apiDoc,handle&pageSize=500&page=1").catch((e) => {
        throw e;
    });
    return response.data.data;
}

async function addAPIs() {
    const projects = await getProjects();
    projects.forEach((project) => {
        console.log("Process " + project.apiDoc);
        project.handleCamelCase = project.handle.replace(/-(\w)/g, ($0, $1) => { return $1.toUpperCase() });
    });

    let apisText = "module.exports = {\n";
    projects.forEach((project) => {
        apisText += `    '${project.handleCamelCase}': () => {},\n`; 
    });
    apisText += "};";

    fs.writeFile(__dirname + "/../api.js", apisText, (e) => {
        if (e) {
            throw e;
        }
        console.log("Done generating api.js");
    });
}

addAPIs();