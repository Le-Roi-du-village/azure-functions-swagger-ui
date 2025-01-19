# azure-functions-swagger-ui
A simple npm module that integrates Swagger UI into Azure Functions, providing a user-friendly interface to visualize and interact with your API endpoints. Perfect for documenting and testing Azure Functions with minimal setup. This package relies on the [swagger-ui-dist](https://github.com/swagger-api/swagger-ui#readme) package.


**Note:** This package is compatible with [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) ([see](#swagger-jsdoc)).
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
- `is_swagger_jsdoc_object` (boolean | Array<boolean> , optional): If true, the `doc_path` property of [swaggerOptions](#swaggeroptions) will be treated as a [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) object instead of a path/url to a Swagger/OpenAPI file ([see](#swagger-jsdoc)). It can also be an array of boolean if `doc_path` is an array of objects, in this case, `is_swagger_jsdoc_object` should specify which element of doc_path is a jsdoc object ([see](#multiple-swaggeropenapi-files-and-swagger-jsdoc)).

#### SwaggerOptions

You can customize the Swagger UI by passing the following options to the `swaggerOptions` object:

- `doc_path` (required): Path/url to Swagger/OpenAPI (YAML or JSON) file  or jsdoc object or  array of objects with path/url/jsdoc and name.
- `title` (optional): Title for Swagger UI.
- `favicon16` (optional): Path to 16x16 favicon image.
- `favicon32` (optional): Path to 32x32 favicon image.
- `css_path` (optional): Path to custom CSS file.
- `html_path` (optional): Path to custom HTML file.
- `display_topbar` (optional): 0: topbar is not displayed, 1: topbar displayed without search bar/select bar, 2: topbar displayed with search bar/select bar but without Swagger logo, 3: topbar displayed with search bar/select bar and Swagger logo. 

**Note:** When specifying paths that are not internet links, ensure that these paths are relative paths with the project root as the source.

**Note:** If you provide a list of paths in the doc_path parameter, it's recommended to set display_topbar to either 2 or 3. This ensures that the select bar will be visible, allowing users to easily navigate between the different documents.

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
swaggerUI('func2',{'doc_path':'./admin.json','title':"admin",'display_topbar':2},{route:'v2/admin/swagger',authLevel:'admin'});


```

### [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)
If you are using swagger-jsdoc, simply pass the openapiSpec into the `doc_path` parameter and set `is_swagger_jsdoc_object` to true.

```typescript
const openapiSpec = swaggerJsdoc(options);
// This will display the documentation from the openapiSpec object
// Don't forget to set the is_swagger_jsdoc_object parameter (last parameter) to true
swaggerUI('func3', {'doc_path':openapiSpec},undefined,true);
```

### Multiple Swagger/OpenAPI Files and [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)
```typescript
const openapiSpecification1 = swaggerJsdoc(options1);
const openapiSpecification2 = swaggerJsdoc(options2);

const doc_path = [
      {
        name: 'spec1',
        url: openapiSpecification1
      },
      {
        name: 'custommer',
        url: './customer.yaml'
      },
      {
        name: 'admin',
        url: './admin.json'
      },

      {
        name: 'spec2',
        url: openapiSpecification2
      },
      {
        name: 'spec3',
        url: 'https://www.my_site.com/apidoc/v2/swagger.json'
      }
]

// This will display the documentation from the list above.
// If there are swagger-jsdoc objects in the list, set the is_swagger_jsdoc_object parameter to an array of booleans specifying which URLs are swagger-jsdoc objects.
swaggerUI('func4',{doc_path:doc_path, title:'Api Doc',display_topbar:2},undefined,[true,false,false,true,false]);
```



## License

This project is licensed under the Apache 2.0 License.
