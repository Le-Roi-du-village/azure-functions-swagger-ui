import { app, HttpFunctionOptions } from "@azure/functions";
import swagger_ui_handler from './src/handler'
import { SwaggerOptions, makeHtml} from "./src/makeHtml";
import {  updateCustomMap } from "./src/fileMap";
import jsdoc from "./src/jsdoc";
import { deleteTmpDir } from "./src/tmp_path";

/**
 * 
 * @param name The name of the function. This will be the route unless a route is explicitly configured in the `HttpTriggerOptions`, default is 'swagger_ui'
 * @param swaggerOptions SwaggerOptions, { doc_path, title?, favicon16?, favicon32?, css_path?, display_topbar? : 0 | 1 | 2 | 3}
 * @param httpFunctionOptions HttpFunctionOptions, azure function options
 * @param is_swagger_jsdoc_object boolean | Array<boolean>, set to true if the doc_path is a swagger-jsdoc object or boolean array of the same length as doc_path specifying which doc_path is a swagger-jsdoc object
 * 
 * This function creates a new http function with the specified name and options.
 * 
  * Set options.route to the route where you want to access the Swagger UI without parameters. For example: 'apidocs', and '/{file?}' will be added automatically.
 * https://github.com/Le-Roi-du-village/azure-functions-swagger-ui#other-example


 */
export default function ( name : string = 'swagger_ui' ,swaggerOptions : SwaggerOptions ,httpFunctionOptions?: Partial<HttpFunctionOptions>,is_swagger_jsdoc_object : boolean | Array<boolean>= false): void {
    if (!swaggerOptions.doc_path) throw new Error('doc_path is required in swaggerOptions see https://github.com/Le-Roi-du-village/azure-functions-swagger-ui#other-example');
    if ( Array.isArray(swaggerOptions.doc_path) && is_swagger_jsdoc_object && (!Array.isArray(is_swagger_jsdoc_object) || (swaggerOptions.doc_path.length !== is_swagger_jsdoc_object.length))) throw  new Error('If doc_path is an array and is_swagger_jsdoc_object is define, it must be an array of the same length , see https://github.com/Le-Roi-du-village/azure-functions-swagger-ui#multiple-swaggeropenapi-files-and-swagger-jsdoc.');
    if (httpFunctionOptions){
        if (httpFunctionOptions.route){
            httpFunctionOptions.route = httpFunctionOptions.route.endsWith('/') ? `${httpFunctionOptions.route}{*file}` :`${httpFunctionOptions.route}/{*file}`
        }
        else{
            httpFunctionOptions.route = `${name}/{*file}`;
        }
        if (!httpFunctionOptions.methods) httpFunctionOptions.methods = ['GET'];

        httpFunctionOptions.handler = swagger_ui_handler;
    }
    else{
        httpFunctionOptions = {route: `${name}/{*file}`,handler :swagger_ui_handler, methods: ['GET']};
    }
        
    
    if (is_swagger_jsdoc_object) jsdoc(name,swaggerOptions,is_swagger_jsdoc_object);
    updateCustomMap(name, swaggerOptions,is_swagger_jsdoc_object);
    if (!swaggerOptions.html_path) makeHtml(name, swaggerOptions,httpFunctionOptions.route as string);
    app.http(name,httpFunctionOptions as HttpFunctionOptions);
    [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
        process.on(eventType, deleteTmpDir.bind(null));
    });

}

export {swagger_ui_handler,SwaggerOptions}


  
