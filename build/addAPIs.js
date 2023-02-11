const { default: axios } = require("axios");
const async = require("async");
const fs = require("fs");

console.log("Running script to generate API functions");

async function getProjects() {
    const response = await axios("https://www.exponentialhost.com/api/allProjects?projection=apiDoc,handle&pageSize=500&page=1").catch((e) => {
        throw e;
    });
    return response.data.data;
}

const projectHandleCamelCase = {};
async function processProject(project) {
    console.log("Process " + project.apiDoc);
    project.handleCamelCase = project.handle.replace(/-(\w)/g, ($0, $1) => { return $1.toUpperCase() });
    // dedup project.handleCamelCase to ensure we don't generate two project API objects for the same project.handleCamelCase
    if (projectHandleCamelCase[project.handleCamelCase]) {
        project.handleCamelCase = project.handle;
    }
    else {
        projectHandleCamelCase[project.handleCamelCase] = 1;
    }
    const response = await axios(project.apiDoc).catch((e) => {
        throw e;
    });
    const paths = response.data.paths;
    let functions = [];
    Object.keys(paths).forEach((path) => {
        let pathCamelCase = path.replace(/(-|\/)(\w)?/g, ($0, $1, $2) => {
            return $2 ? $2.toUpperCase() : "";
        });
        let pathConfig = paths[path];
        Object.keys(pathConfig).forEach((method) => {
            functions.push({
                name: method + pathCamelCase,
                method,
                path,
                consumes: pathConfig[method].consumes
            });
        });
    });
    project.functions = functions;
}

async function addAPIs() {
    const projects = await getProjects();

    try {
        await async.eachLimit(projects, 5, processProject);
    } catch (e) {
        console.error(e);
        throw e;
    }

    let apisText = "module.exports = function (apiCall) { \n    return {\n";
    projects.forEach((project) => {
        apisText += `        '${project.handleCamelCase}': {\n`; 
        project.functions.forEach((func) => {
            apisText += `            ${func.name}: (config) => {\n`;
            if (func.consumes) {
                if (typeof func.consumes === "object") {
                    func.consumes = func.consumes[0];
                }
                apisText += `                config ||= {}; config.headers ||= {}; config.headers["content-type"] ||= "${func.consumes}";\n`;
            }
            apisText += `                return apiCall('${project.handle}', '${func.method}', '${func.path}', config);\n`;
            apisText += `            },\n`;
        });
        apisText += '        },\n';
    });
    apisText += "    }\n};";

    fs.writeFile(__dirname + "/../api.js", apisText, (e) => {
        if (e) {
            throw e;
        }
        console.log("Done generating api.js");
    });
}

addAPIs();