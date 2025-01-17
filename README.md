# azure-functions-swagger-ui
A simple npm module that integrates Swagger UI into Azure Functions, providing a user-friendly interface to visualize and interact with your API endpoints. Perfect for documenting and testing Azure Functions with minimal setup. This package relies on the [swagger-ui-dist](https://github.com/riyadhalnur/mongoose-softdelete) package.

## Installation

```sh
npm install azure-functions-swagger-ui
```

## Usage

### swaggerUI Function

#### Parameters

- `name` (string, optional): The name of the function. This will be the route unless a route is explicitly configured in the `HttpFunctionOptions`, default is 'swagger_ui'.
- [swaggerOptions](#swaggeroptions) (SwaggerOptions, required): Options for configuring Swagger UI.
- [httpFunctionOptions](https://github.com/Azure/azure-functions-nodejs-library/blob/v4.x/types/http.d.ts#L16) (HttpFunctionOptions, optional): Azure function options.
- `swagger_jsdoc` (boolean, optional): If true, the `doc_path` parameter will be treated as a jsdoc object instead of a path to a Swagger/OpenAPI file.

#### SwaggerOptions

You can customize the Swagger UI by passing the following options to the `swaggerOptions` object:

- `doc_path` (required): Path to Swagger/OpenAPI (YAML or JSON) file  or jsdoc object.
- `title` (optional): Title for Swagger UI.
- `favicon16` (optional): Path to 16x16 favicon image.
- `favicon32` (optional): Path to 32x32 favicon image.
- `css_path` (optional): Path to custom CSS file.
- `html_path` (optional): Path to custom HTML file.
- `display_topbar` (optional): 0 | 1 | 2 ;  0: topbar hidden, 1: topbar displayed without search bar, 2: topbar displayed with search bar (optional)


### Simple Example

```typescript
import swaggerUI from 'azure-functions-swagger-ui';

const swaggerOptions = {
  doc_path: 'path/to/your/swagger.json',
  title: 'My API Documentation',
};

swaggerUI('swagger_ui', swaggerOptions);

```
The Swagger UI will be available at `[hostname]/api/swagger_ui`.
Note that the minimum required parameter is `doc_path` from [swaggerOptions](#swaggeroptions). All other parameters are optional.

### Other Example

```typescript
import swaggerUI from 'azure-functions-swagger-ui'


// These are examples of how to use the azure-functions-swagger-ui package


// This Swagger UI will be available at the route /apidocs/manager and will display the documentation from the swagger.json file located at https://www.my_site.com/apidoc/v2/swagger.json
swaggerUI('func0',{'doc_path':'https://www.my_site.com/apidoc/v2/swagger.json','title':"manager"},{route:'apidocs/manager'});

// This Swagger UI will be available at the route /apidocs/customer and will display the documentation from the customer.yml file located at the root of the function
// The title of the page will be customer and the favicon will be the images/customer16.png and images/customer32.png, the topbar will be displayed but not the search bar
swaggerUI('func1',{'doc_path':'./customer.yml','title':"customer",'favicon16':'images\\customer16.png','favicon32':'images\\customer32.png','display_topbar':1},{route:'apidocs/customer'});

// This Swagger UI will be available at the route /v2/admin/swagger and will display the documentation from the admin.yml file located at the root of the function
// The title of the page will be admin and the topbar will be displayed and the search bar too
// The authentication level will be admin
swaggerUI('func2',{'doc_path':'./admin.yml','title':"admin",'display_topbar':2},{route:'v2/admin/swagger',authLevel:'admin'});


```

### [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc)
If you are using swagger-jsdoc, simply pass the openapiSpec into the `doc_path` parameter and set `swagger_jsdoc` to true.

```typescript
const openapiSpec = swaggerJsdoc(options);
// This will display the documentation from the openapiSpec object
// Don't forget to set the swagger_jsdoc parameter (last parameter) to true
swaggerUI('func3', {'doc_path':openapiSpec},undefined,true);
```




Using these above import statement directly creates the Azure Function for you. However, if you prefer to handle things yourself, you can use the `swagger_ui_handler` combined with `makeHtml` and `updateCustomMap`:

```typescript
import { app, HttpFunctionOptions } from "@azure/functions";
import { swagger_ui_handler, makeHtml, updateCustomMap, SwaggerOptions } from 'azure-functions-swagger-ui';

const swaggerOptions: SwaggerOptions = {
  doc_path: 'path/to/your/swagger.json',
  title: 'My API Documentation',
  display_topbar : 2 // the top bar and search will be displayed
};

updateCustomMap('func_name',swaggerOptions,false);
makeHtml('func_name',swaggerOptions, '<endpoint>/{*file}'); // don't forget to put /{*file} at the end of the route

async function my_custom_handler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Some code here

  const  my_var = swagger_ui_handler (request, context);

  // Some code here
}

app.http('func_name',{ 
  route: '<endpoint>/{*file}',
  handler: my_custom_handler,
  methods: ['GET'],
  authLevel: 'admin'
  }
);
```




## License

This project is licensed under the Apache 2.0 License.
