import * as fs from 'fs';
import * as path from 'path';
import {InvocationContext } from "@azure/functions";
import package_path from './package_path';

const html_dir = path.resolve(package_path,'html');

/**
 * Interface for Swagger UI options
 * @param doc_path // Path/url to Swagger/OpenAPI (YAML or JSON) file  or jsdoc object or  array of objects with path/url/jsdoc and name (required)
 * @param title Title for Swagger UI (optional)
 * @param favicon16 Path to 16x16 favicon image (optional)
 * @param favicon32 Path to 32x32 favicon image (optional)
 * @param css_path Path to custom CSS file (optional)
 * @param html_path Path to custom HTML file (optional)
 * @param display_topbar // 0: topbar is not displayed, 1: topbar displayed without searchbar/selectbar, 2: topbar displayed with searchbar/selectbar but without swagger logo, 3: topbar displayed with searchbar/selectbar and swagger logo (optional)
 */
export type SwaggerOptions =  {
    doc_path: string    // Path/url to Swagger/OpenAPI (YAML or JSON) file 
             | {}       // jsdoc object 
             |  Array<{ url: string | {}, name: string }> ;  // Array of objects with path/url/jsdoc and name
             //  (required)
    title?: string;  // Title for Swagger UI (optional)
    favicon16?: string;  // Path to 16x16 favicon image (optional)
    favicon32?: string;  // Path to 32x32 favicon image (optional)
    css_path?: string;  // Path to custom CSS file (optional)
    html_path?: string;  // Path to custom HTML file (optional)
    display_topbar?: 0 | 1 | 2 | 3;  // 0: topbar is not displayed, 1: topbar displayed without search bar/select bar, 2: topbar displayed with search bar/select bar but without Swagger logo, 3: topbar displayed with search bar/select bar and Swagger logo (optional)
}

/**
 * 
 * @param fileName // The name of the HTML file to be created
 * @param swaggerOptions SwaggerOptions, { doc_path, title?, favicon16?, favicon32?, css_path?, display_topbar? : 0 | 1 | 2 | 3 }
 * @param route  // The route where the Swagger UI will be available
 */
export function makeHtml(fileName:string, swaggerOptions:SwaggerOptions, route:string  ): void {
    if (Array.isArray(swaggerOptions.doc_path) && swaggerOptions.display_topbar === undefined) swaggerOptions.display_topbar = 2;
    const route_dir = path.dirname(route);
    const route_dir_last = path.basename(route_dir);
    const topbar = swaggerOptions.display_topbar ? swaggerOptions.display_topbar === 1  ?  
                  `<style>.topbar .wrapper {display: none !important;}</style>` 
                  :swaggerOptions.display_topbar === 2 ?
                  `<style> #swagger-ui > section > div.topbar > div > div > a {display: none !important;}</style>` 
                  : ''
                  :`<style>.topbar {display: none !important;}</style>` ;
    // Create the HTML template with placeholders for dynamic content
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
        <head>
        <meta charset="UTF-8">
        <title>${swaggerOptions.title || 'Swagger UI'}</title>
        <script>
            const baseElement = document.createElement('base');
            document.head.appendChild(baseElement);
            const dynamicHref = window.location.pathname.endsWith('/${route_dir}') ? './${route_dir_last}/' : '';
            baseElement.href = dynamicHref;
        </script>
        <link rel="stylesheet" type="text/css" href="./swagger-ui.css" />
        <link rel="stylesheet" type="text/css" href="index.css" />
        ${swaggerOptions.css_path ? `<link rel="stylesheet" type="text/css" href="${swaggerOptions.css_path}" />` : ''}
        <link rel="icon" type="image/png" href="${swaggerOptions.favicon16 || './favicon-16x16.png'}" sizes="16x16" />
        <link rel="icon" type="image/png" href="${swaggerOptions.favicon32 || './favicon-32x32.png'}" sizes="32x32" />
        ${topbar}
        </head>
        
        <body>
        <div id="swagger-ui"></div>
        <script src="./swagger-ui-bundle.js" charset="UTF-8"> </script>
        <script src="./swagger-ui-standalone-preset.js" charset="UTF-8"> </script>
        <script> const doc_path = ${Array.isArray(swaggerOptions.doc_path)?JSON.stringify(swaggerOptions.doc_path):`"${swaggerOptions.doc_path}"`}; </script>
        <script src="./swagger-initializer.js" charset="UTF-8"> </script>
        </body>
    </html>
    `;

    let html_path = path.join(html_dir,fileName);
    if (! html_path.endsWith('.html')) {
        html_path += '.html';
    }
    // Create the directory structure for the HTML file
    fs.mkdir(path.join(html_dir,  path.dirname(fileName) ) , { recursive: true }, (err) => {
        if (err) {
          new InvocationContext().error('Error creating HTML directory:', err);
          console.error('Error creating HTML directory:', err);
          throw err;
        } else {
          // Write the adapted HTML content to an HTML file
          fs.writeFile(html_path, htmlContent, (err) => {
            if (err) {
                new InvocationContext().error('Error writing the HTML file:', err);
                console.error('Error writing the HTML file:', err);
                throw err;

            } 
          });
        }
      });
}

export function deleteHtml(): void {
  fs.rmSync(html_dir, { recursive: true, force: true });
}
