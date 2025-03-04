import { SwaggerOptions } from "./makeHtml";
import * as path from 'path';
import {package_path} from './tmp_path';

// Path where the swagger-ui-dist package is installed
const swagger_ui_dist_path = require("swagger-ui-dist").getAbsoluteFSPath() ;


/*
    * Map of the files that are part of the swagger-ui-dist or this package
*/
const fileMap  = new Map([
    [
    'favicon-32x32.png', {
        fileName: path.resolve(swagger_ui_dist_path,'favicon-32x32.png'),
        contentType: 'image/png'
        }
    ],
    [
    'favicon-16x16.png', {
        fileName: path.resolve(swagger_ui_dist_path,'favicon-16x16.png'),
        contentType: 'image/png'
        }
    ],
    [
    'swagger-initializer.js', {
        fileName: path.resolve(package_path,'../swagger-initializer.js'),
        contentType: 'application/javascript; charset=UTF-8'
        }
    ],
    [
    'index.css', {
        fileName: path.resolve(swagger_ui_dist_path,'index.css'),
        contentType: 'text/css; charset=utf-8'
        }
    ],
    [
    'swagger-ui.css', {
        fileName: path.resolve(swagger_ui_dist_path,'swagger-ui.css'),
        contentType: 'text/css; charset=utf-8'
        }
    ],
    [
    'swagger-ui-bundle.js', {
        fileName: path.resolve(swagger_ui_dist_path,'swagger-ui-bundle.js'),
        contentType: 'application/javascript; charset=UTF-8'
        }
    ],
    [
    'swagger-ui-standalone-preset.js', {
        fileName: path.resolve(swagger_ui_dist_path,'swagger-ui-standalone-preset.js'),
        contentType: 'application/javascript; charset=UTF-8'
        }
    ],
    [
    'swagger-ui.css.map', {
        fileName: path.resolve(swagger_ui_dist_path,'swagger-ui.css.map'),
        contentType: 'application/json; charset=UTF-8'
        }
    ],
    
]);

// Maps of  custom files specified in SwaggerOptions
const custom_maps : {
  [key: string]: Map<string, {
    fileName: string;
    contentType: string;
}>;
} = {}

// Function to empty the custom_map
const clear_custom_maps  = function(key?: string): void {
    if (key) {
        custom_maps[key].clear();
        return;
    }
    Object.assign(custom_maps, {});
}



/**
 * 
 * @param name  string
 * @param swaggerOptions SwaggerOptions, { doc_path, title?, favicon16?, favicon32?, css_path?, display_topbar? : 0 | 1 | 2 | 3}
 * @param is_swagger_jsdoc_object boolean | Array<boolean>, set to true if the doc_path is a jsdoc object or boolean array of the same length as doc_path specifying which element of doc_path is a jsdoc object
 * 
 * 
 * This function updates the custom_map with the custom files specified in the swaggerOptions
 */
function updateCustomMap(name: string ,swaggerOptions: SwaggerOptions,is_swagger_jsdoc_object : boolean|boolean[] ) :void {
    custom_maps[name] = new Map();
    const custom_map = custom_maps[name];
    if (Array.isArray(swaggerOptions.doc_path)){
        is_swagger_jsdoc_object = is_swagger_jsdoc_object as boolean[] || new Array(swaggerOptions.doc_path.length).fill(false);
        for (let i = 0; i < swaggerOptions.doc_path.length; i++){
            const extention = path.extname(swaggerOptions.doc_path[i].url);
            if (is_swagger_jsdoc_object[i]){
                const base = path.basename(swaggerOptions.doc_path[i].url);
                custom_map.set(path.normalize(base), {
                    fileName: path.normalize(swaggerOptions.doc_path[i].url),
                    contentType: extention === '.json' ? 'application/json; charset=UTF-8' : (extention === '.yaml')|| (extention === '.yml') ? 'application/x-yaml; charset=UTF-8' :''
                })
                
                swaggerOptions.doc_path[i].url = base;
            }
            else{
                custom_map.set(path.normalize(swaggerOptions.doc_path[i].url), {
                    fileName: path.normalize(swaggerOptions.doc_path[i].url),
                    contentType: extention === '.json' ? 'application/json; charset=UTF-8' : (extention === '.yaml')|| (extention === '.yml') ? 'application/x-yaml; charset=UTF-8' :''
                })
            }
        }
    }
    else{
        const extention = path.extname(swaggerOptions.doc_path as string);
        if (is_swagger_jsdoc_object){
            const base = path.normalize(path.basename(swaggerOptions.doc_path as string));
            custom_map.set(base, {
                fileName: path.normalize(swaggerOptions.doc_path as string),
                contentType: extention === '.json' ? 'application/json; charset=UTF-8' : (extention === '.yaml')|| (extention === '.yml') ? 'application/x-yaml; charset=UTF-8' :''
            })
            
            swaggerOptions.doc_path = base;

        }
        else{
            custom_map.set(path.normalize(swaggerOptions.doc_path as string), {
                fileName: path.normalize(swaggerOptions.doc_path as string),
                contentType: extention === '.json' ? 'application/json; charset=UTF-8' : (extention === '.yaml')|| (extention === '.yml') ? 'application/x-yaml; charset=UTF-8' :''
            })
        }
    }
    
    if (swaggerOptions.favicon16) custom_map.set(path.normalize(swaggerOptions.favicon16), {
        fileName: path.normalize(swaggerOptions.favicon16),
        contentType: 'image/png'
    })
    if (swaggerOptions.favicon32) custom_map.set(path.normalize(swaggerOptions.favicon32), {
        fileName: path.normalize(swaggerOptions.favicon32),
        contentType: 'image/png'
    })
    if (swaggerOptions.css_path) custom_map.set(path.normalize(swaggerOptions.css_path), {
        fileName: path.normalize(swaggerOptions.css_path),
        contentType: 'text/css; charset=UTF-8'
    })
    if (swaggerOptions.html_path) custom_map.set('html', {
        fileName: path.normalize(swaggerOptions.html_path),
        contentType: 'text/html; charset=UTF-8'
    })
}


export {fileMap,custom_maps,updateCustomMap,clear_custom_maps}