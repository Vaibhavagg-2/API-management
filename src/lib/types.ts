export interface ApiDef {
  id: string;
  name: string;
  version: string;
  description: string;
  endpoints: Endpoint[];
  schemas: Record<string, SchemaObject>;
}

export interface Endpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  summary: string;
  description: string;
  parameters: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, ResponseObject>;
}

export interface Parameter {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description: string;
  required: boolean;
  schema: SchemaObject;
}

export interface RequestBody {
  description: string;
  required: boolean;
  content: {
    'application/json': {
      schema: SchemaObject;
    };
  };
}

export interface ResponseObject {
  description: string;
  content?: {
    'application/json': {
      schema: SchemaObject;
    };
  };
}

export interface SchemaObject {
  type: 'object' | 'string' | 'integer' | 'array' | 'boolean' | 'number';
  properties?: Record<string, SchemaObject>;
  items?: SchemaObject;
  example?: any;
  description?: string;
  required?: string[];
  $ref?: string;
}

export interface ApiCallLog {
  id: string;
  apiId: string;
  endpointPath: string;
  endpointMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  userId: string;
  timestamp: string; // ISO string
}
