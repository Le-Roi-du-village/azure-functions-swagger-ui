import { SwaggerOptions } from "./makeHtml";
import * as path from 'path';

// Path where the swagger-ui-dist package is installed
const swagger_ui_dist_path = require("swagger-ui-dist").getAbsoluteFSPath() ;
const package_path = path.resolve(__dirname, '..', '..');


/*
    * Map of the files that are part of the swagger-ui-dist or this package
*/
const fileMap  = new Map([
    [
    'favicon-32x32.png', {
        fileName: `${swagger_ui_dist_path}/favicon-32x32.png`,
        contentType: 'image/png'
        }
    ],
    [
    'favicon-16x16.png', {
        fileName: `${swagger_ui_dist_path}/favicon-16x16.png`,
        contentType: 'image/png'
        }
    ],
    [
    'swagger-initializer.js', {
        fileName: `${package_path}/swagger-initializer.js`,
        contentType: 'application/javascript; charset=UTF-8'
        }
    ],
    [
    'index.css', {
        fileName: `${swagger_ui_dist_path}/index.css`,
        contentType: 'text/css; charset=utf-8'
        }
    ],
    [
    'swagger-ui.css', {
        fileName: `${swagger_ui_dist_path}/swagger-ui.css`,
        contentType: 'text/css; charset=utf-8'
        }
    ],
    [
    'swagger-ui-bundle.js', {
        fileName: `${swagger_ui_dist_path}/swagger-ui-bundle.js`,
        contentType: 'application/javascript; charset=UTF-8'
        }
    ],
    [
    'swagger-ui-standalone-preset.js', {
        fileName: `${swagger_ui_dist_path}/swagger-ui-standalone-preset.js`,
        contentType: 'application/javascript; charset=UTF-8'
        }
    ],
    [
    'swagger-ui.css.map', {
        fileName: `${swagger_ui_dist_path}/swagger-ui.css.map`,
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
 * @param swaggerOptions SwaggerOptions, { doc_path, title?, favicon16?, favicon32?, css_path?, display_topbar? : 0 | 1 | 2 }
 * 
 * 
 * This function updates the custom_map with the custom files specified in the swaggerOptions
 */
function updateCustomMap(name: string ,swaggerOptions: SwaggerOptions,swagger_jsdoc : boolean ) :void {
    custom_maps[name] = new Map();
    const custom_map = custom_maps[name];
    const extention = path.extname(swaggerOptions.doc_path);
    if (swagger_jsdoc){
        const base = path.basename(swaggerOptions.doc_path);
        custom_map.set(path.normalize(base), {
            fileName: swaggerOptions.doc_path,
            contentType: extention === '.json' ? 'application/json; charset=UTF-8' : (extention === '.yaml')|| (extention === '.yml') ? 'application/x-yaml; charset=UTF-8' :''
        })
        
        swaggerOptions.doc_path = base;

    }
    else{
        custom_map.set(path.normalize(swaggerOptions.doc_path), {
            fileName: swaggerOptions.doc_path,
            contentType: extention === '.json' ? 'application/json; charset=UTF-8' : (extention === '.yaml')|| (extention === '.yml') ? 'application/x-yaml; charset=UTF-8' :''
        })
    }
    if (swaggerOptions.favicon16) custom_map.set(path.normalize(swaggerOptions.favicon16), {
        fileName: swaggerOptions.favicon16,
        contentType: 'image/png'
    })
    if (swaggerOptions.favicon32) custom_map.set(path.normalize(swaggerOptions.favicon32), {
        fileName: swaggerOptions.favicon32,
        contentType: 'image/png'
    })
    if (swaggerOptions.css_path) custom_map.set(path.normalize(swaggerOptions.css_path), {
        fileName: swaggerOptions.css_path,
        contentType: 'text/css; charset=UTF-8'
    })
    if (swaggerOptions.html_path) custom_map.set('html', {
        fileName: swaggerOptions.html_path,
        contentType: 'text/html; charset=UTF-8'
    })
}


export {fileMap,custom_maps,updateCustomMap,clear_custom_maps}