import * as path from "path";
import * as fs from 'fs';
import { SwaggerOptions } from "./makeHtml";
import tmp_path from './tmp_path';



const jsdoc_dir = path.resolve(tmp_path,'doc');


function array_jsdoc (fileName : string,docs_path_array : { url: string | {}, name: string }[], is_swagger_jsdoc_object : Array<boolean> ){

    const doc_path_start = path.join(jsdoc_dir,fileName);
        
    for (let i = 0; i < is_swagger_jsdoc_object.length; i++){
        if (! is_swagger_jsdoc_object[i]) continue;
        const doc = docs_path_array[i];
        let data = doc.url;
        let doc_path_full; 
        if (typeof data === 'string') {
            doc_path_full = doc_path_start + doc.name + i + '__azfsu__jsdoc.yaml';
        }else{
            doc_path_full = doc_path_start + doc.name + i + '__azfsu__jsdoc.json';
            data = JSON.stringify(data);
        }
        doc_path_full = path.normalize(doc_path_full);
        // Write the doc content
        fs.writeFile(doc_path_full, data as string, (err) => {
            if (err) {
                console.error('Error doc the HTML file:', err);
                throw err;
            }

        });
        doc.url = doc_path_full;

    }

}
function single_jsdoc (fileName : string, swaggerOptions : SwaggerOptions ){

    let doc_path = path.join(jsdoc_dir,fileName);
    let data = swaggerOptions.doc_path
    if (typeof data === 'string') {
            doc_path += '__azfsu__jsdoc.yaml';
            
    }
    else{
        doc_path += '__azfsu__jsdoc.json';
        data = JSON.stringify(data);
    }
    doc_path = path.normalize(doc_path);

    // Write the doc content
    fs.writeFile(doc_path, data as string, (err) => {
        if (err) {
            console.error('Error doc the HTML file:', err);
            throw err;

        } 
    });

    swaggerOptions.doc_path = doc_path;

}

export default function  (fileName : string,swaggerOptions : SwaggerOptions, is_swagger_jsdoc_object? : Array<boolean>| boolean): void {
    // Create the directory structure for the HTML file(s)
    try{
        fs.mkdirSync(path.join(jsdoc_dir,  path.dirname(fileName) ) , { recursive: true });
    }
    catch(err){
        console.error('Error creating doc directory:', err);
        throw err;
    };
    if ( Array.isArray(swaggerOptions.doc_path)){
        array_jsdoc(fileName,swaggerOptions.doc_path,is_swagger_jsdoc_object as Array<boolean>);
        return;
    }
    single_jsdoc(fileName,swaggerOptions);
    
    

}
