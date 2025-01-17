import { app, HttpFunctionOptions } from "@azure/functions";
import swagger_ui_handler from './src/handler'
import { SwaggerOptions, makeHtml ,deleteHtml} from "./src/makeHtml";
import { updateCustomMap } from "./src/fileMap";
import jsdoc from "./src/jsdoc";

/**
 * 
 * @param name The name of the function. This will be the route unless a route is explicitly configured in the `HttpTriggerOptions`, default is 'swagger_ui'
 * @param swaggerOptions SwaggerOptions, { doc_path, title?, favicon16?, favicon32?, css_path?, display_topbar? : 0 | 1 | 2 }
 * @param httpFunctionOptions HttpFunctionOptions, azure function options
 * @param swagger_jsdoc boolean, set to true if the doc_path is a jsdoc object default is false
 * 
 * This function creates a new http function with the specified name and options.
  * Set options.route to the route where you want to access the Swagger UI without parameters. For example: 'apidocs', and '/{file?}' will be added automatically.
 */
export default function ( name : string = 'swagger_ui' ,swaggerOptions : SwaggerOptions ,httpFunctionOptions?: Partial<HttpFunctionOptions>,swagger_jsdoc : boolean = false): void {
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
    if (swagger_jsdoc){
        
    }
    if (swagger_jsdoc) jsdoc(name,swaggerOptions);
    updateCustomMap(name, swaggerOptions,swagger_jsdoc);
    if (!swaggerOptions.html_path) makeHtml(name, swaggerOptions,httpFunctionOptions.route as string);
    app.http(name,httpFunctionOptions as HttpFunctionOptions);
    [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
        process.on(eventType, deleteHtml.bind(null));
    });
}

export {swagger_ui_handler,SwaggerOptions}


  
