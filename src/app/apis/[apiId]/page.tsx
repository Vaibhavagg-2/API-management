'use client';

import { notFound, useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Endpoint, Parameter, SchemaObject } from '@/lib/types';
import { useApis } from '@/hooks/use-apis';
import { Skeleton } from '@/components/ui/skeleton';
import { useApiAnalytics } from '@/hooks/use-api-analytics';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PlayCircle } from 'lucide-react';

function getMethodClass(method: string) {
  switch (method) {
    case 'GET': return 'bg-sky-500 hover:bg-sky-600';
    case 'POST': return 'bg-green-500 hover:bg-green-600';
    case 'PUT': return 'bg-orange-500 hover:bg-orange-600';
    case 'DELETE': return 'bg-red-500 hover:bg-red-600';
    case 'PATCH': return 'bg-yellow-500 hover:bg-yellow-600 text-black';
    default: return 'bg-gray-500 hover:bg-gray-600';
  }
}

function renderSchema(schema: SchemaObject, allSchemas: any, indent = 0) {
    if (schema.$ref) {
        const schemaName = schema.$ref.split('/').pop() as string;
        return <a href={`#schema-${schemaName}`} className="text-primary hover:underline">{schemaName}</a>;
    }

    if (schema.type === 'object') {
        return (
            <div className="space-y-1">
                <div>{'{'}</div>
                <div className="pl-4">
                    {schema.properties && Object.entries(schema.properties).map(([key, value], idx, arr) => (
                        <div key={key}>
                            <span className="text-pink-500">"{key}"</span>: {renderSchema(value, allSchemas, indent + 1)}
                            {idx < arr.length - 1 ? ',' : ''}
                        </div>
                    ))}
                </div>
                <div>{'}'}</div>
            </div>
        );
    }
    
    if (schema.type === 'array') {
        return (
             <div>
                {'['}
                <div className="pl-4">
                    {schema.items && renderSchema(schema.items, allSchemas, indent + 1)}
                </div>
                {']'}
            </div>
        )
    }

    return <span className="text-teal-400">{schema.type}</span>;
}


function EndpointDetails({ endpoint, apiId, allSchemas }: { endpoint: Endpoint, apiId: string, allSchemas: any }) {
  const { logApiCall } = useApiAnalytics();
  const { toast } = useToast();

  const handleTestCall = () => {
    logApiCall({
      apiId,
      endpointPath: endpoint.path,
      endpointMethod: endpoint.method,
      userId: 'user-john-doe', // Hardcoded for simulation
    });
    toast({
      title: 'API Call Simulated',
      description: `${endpoint.method} ${endpoint.path} was called.`,
    });
  };
  return (
    <div className="space-y-6 py-4">
       <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-muted-foreground flex-1">{endpoint.description}</p>
        <Button variant="outline" size="sm" onClick={handleTestCall}>
            <PlayCircle />
            Test Endpoint
        </Button>
      </div>
      
      {endpoint.parameters.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Parameters</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>In</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {endpoint.parameters.map((param: Parameter) => (
                <TableRow key={param.name}>
                  <TableCell className="font-mono">{param.name}{param.required && <span className="text-destructive">*</span>}</TableCell>
                  <TableCell>{param.in}</TableCell>
                  <TableCell className="font-mono">{param.schema.type}</TableCell>
                  <TableCell>{param.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {endpoint.requestBody && (
        <div>
            <h4 className="font-semibold mb-2">Request Body</h4>
            <pre className="w-full whitespace-pre-wrap rounded-md bg-muted p-4 text-sm font-code">
              <code>
                {renderSchema(endpoint.requestBody.content['application/json'].schema, allSchemas)}
              </code>
            </pre>
        </div>
      )}

      <div>
        <h4 className="font-semibold mb-2">Responses</h4>
        {Object.entries(endpoint.responses).map(([status, response]) => (
          <div key={status} className="mb-4">
            <h5 className="font-semibold font-mono text-sm">
                <Badge variant="outline" className={parseInt(status) >= 400 ? 'text-destructive border-destructive' : 'text-green-600 border-green-600'}>{status}</Badge> {response.description}
            </h5>
            {response.content && (
                 <pre className="w-full mt-2 whitespace-pre-wrap rounded-md bg-muted p-4 text-sm font-code">
                    <code>
                        {renderSchema(response.content['application/json'].schema, allSchemas)}
                    </code>
                </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


export default function ApiDocumentationPage() {
  const params = useParams<{ apiId: string }>();
  const { apis, loading } = useApis();

  if (loading) {
     return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-6 w-3/4 mt-2" />
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-5 w-1/2 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-5 w-1/2 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  const api = apis.find((a) => a.id === params.apiId);

  if (!api) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
            <h1 className="font-headline text-3xl font-bold tracking-tight">{api.name}</h1>
            <Badge variant="outline" className="text-base">v{api.version}</Badge>
        </div>
        <p className="text-muted-foreground max-w-3xl">{api.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>Explore the available endpoints for this API.</CardDescription>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
                {api.endpoints.map(endpoint => (
                    <AccordionItem value={endpoint.method+endpoint.path} key={endpoint.method+endpoint.path}>
                        <AccordionTrigger className="font-mono text-left text-sm hover:no-underline">
                            <div className="flex items-center gap-4">
                                <Badge className={getMethodClass(endpoint.method)}>{endpoint.method}</Badge>
                                <span>{endpoint.path}</span>
                            </div>
                            <span className="ml-auto mr-4 text-muted-foreground font-sans font-normal truncate max-w-xs">{endpoint.summary}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                           <EndpointDetails endpoint={endpoint} apiId={api.id} allSchemas={api.schemas} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Schemas</CardTitle>
          <CardDescription>Data models used in this API.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {Object.entries(api.schemas).map(([name, schema]) => (
                <div key={name} id={`schema-${name}`}>
                    <h3 className="font-bold font-mono text-primary">{name}</h3>
                     <pre className="w-full mt-2 whitespace-pre-wrap rounded-md bg-muted p-4 text-sm font-code">
                        <code>
                            {renderSchema(schema, api.schemas)}
                        </code>
                    </pre>
                </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
