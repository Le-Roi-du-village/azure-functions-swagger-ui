// Inspired by: https://scale-tone.github.io/2019/09/02/how-to-serve-static-content-with-azure-functions
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as fs from 'fs';
import * as util from 'util';
import { custom_maps, fileMap } from "./fileMap";
import * as path from "path";
const readFileAsync = util.promisify(fs.readFile);
const fileExistsAsync = util.promisify(fs.exists);



const package_html_path = path.resolve(__dirname, '..','html');



// When calling app.http you need to set "route"  parameter 
// to something like: "apidocs/{*file}".
// Then your swagger ui will become available at [hostname]/api/apidocs .
export default async function (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    
    const file = !!request.params.file ? path.normalize(request.params.file) : ''; // If no file is specified, default to index.html


    

    const mapEntry = fileMap.get(file); // Check if the requested file is part of the swagger-ui-dist package or this package
    
    if (!!mapEntry) {
        if (await fileExistsAsync(mapEntry.fileName)) {
            return {
                body: await readFileAsync(mapEntry.fileName),
                headers: { 'Content-Type': mapEntry.contentType }
            };


        } 
        return {
            status: 404
        };
        

    }

    const mapCustomEntry = custom_maps[context.functionName].get(file); // Check if the requested file is part of the custom files specified in the swaggerOptions
    if (!!mapCustomEntry) {
        if (await fileExistsAsync(mapCustomEntry.fileName)) {
            return {
                body: await readFileAsync(mapCustomEntry.fileName),
                headers: { 'Content-Type': mapCustomEntry.contentType }
            };


        } 
        return {
            status: 404
        };
    }

    

    // Returning index.html by default, to support client routing
    const html =  custom_maps[context.functionName].get('html');
    if (html) {
        if (await fileExistsAsync(html.fileName)) {
            return {
                body: await readFileAsync(html.fileName),
                headers: { 'Content-Type': 'text/html; charset=UTF-8' }
            };


        }
        context.error('Error reading the HTML file:', html.fileName);
        return {
            status: 404
        };
    }
    if (await fileExistsAsync(`${package_html_path}/${context.functionName}.html`)) {
        return {
            body: await readFileAsync(`${package_html_path}/${context.functionName}.html`),
            headers: { 'Content-Type': 'text/html; charset=UTF-8' }
        };


    }
    context.error('Error reading the HTML file:', `${package_html_path}/${context.functionName}.html`);
    return {
        status: 404
    };
    
};
