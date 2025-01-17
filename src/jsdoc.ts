import * as path from "path";
import * as fs from 'fs';
import { InvocationContext } from "@azure/functions";
import { SwaggerOptions } from "./makeHtml";


const jsdoc_dir = path.resolve(__dirname,'..','doc');


export default  function (fileName : string,swaggerOptions : SwaggerOptions  ){
    let doc_path = path.join(jsdoc_dir,fileName);
    let data = swaggerOptions.doc_path
    if (typeof data === 'string') {
        if (! doc_path.endsWith('.yaml')) {
            doc_path += '.yaml';
        }
            
    }
    else{
        if (! doc_path.endsWith('.json')) {
            doc_path += '.json';
        }
        data = JSON.stringify(doc_path);
    }
    // Create the directory structure for the HTML file
    fs.mkdir(path.join(jsdoc_dir,  path.dirname(fileName) ) , { recursive: true }, (err) => {
        if (err) {
            new InvocationContext().error('Error creating doc directory:', err);
            console.error('Error creating doc directory:', err);
        } else {
            // Write the doc content
            fs.writeFile(doc_path, data, (err) => {
            if (err) {
                new InvocationContext().error('Error writing the doc file:', err);
                console.error('Error doc the HTML file:', err);

            } 
            });
        }
        });

    swaggerOptions.doc_path = doc_path;

}
