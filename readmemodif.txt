Using these above import statement directly creates the Azure Function for you. However, if you prefer to handle things yourself, you can use the `swagger_ui_handler` combined with `makeHtml` and `updateCustomMap`:

```typescript
import { app, HttpFunctionOptions } from "@azure/functions";
import {makeHtml,SwaggerOptions} from 'azure-functions-swagger-ui/src/makeHtml'
import swagger_ui_handler from 'azure-functions-swagger-ui/src/handler'
import {updateCustomMap} from 'azure-functions-swagger-ui/src/fileMap'

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