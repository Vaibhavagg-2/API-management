'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApis, type NewApiData } from '@/hooks/use-apis';
import { useRouter } from 'next/navigation';

const endpointSchema = z.object({
  path: z.string().startsWith('/', { message: 'Path must start with /' }),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  summary: z.string().min(1, 'Summary is required'),
});

const apiSchema = z.object({
  name: z.string().min(3, 'API name must be at least 3 characters'),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must be in semantic format (e.g., 1.0.0)'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  endpoints: z.array(endpointSchema).min(1, 'At least one endpoint is required'),
});

type ApiFormData = z.infer<typeof apiSchema>;

export default function DesignPage() {
  const router = useRouter();
  const { addApi } = useApis();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ApiFormData>({
    resolver: zodResolver(apiSchema),
    defaultValues: {
      name: '',
      version: '1.0.0',
      description: '',
      endpoints: [{ path: '/example', method: 'GET', summary: 'Example endpoint' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'endpoints',
  });

  const onSubmit = (data: ApiFormData) => {
    addApi(data as NewApiData);
    alert('API design created successfully!');
    router.push('/');
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">API Blueprint</h1>
        <p className="text-muted-foreground">
          Design and define your API structure, endpoints, and data models.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>API Details</CardTitle>
            <CardDescription>
              Provide the core information for your new API.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">API Name</Label>
                <Input id="name" {...register('name')} placeholder="e.g., User Management API" />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input id="version" {...register('version')} placeholder="e.g., 1.0.0" />
                {errors.version && <p className="text-sm text-destructive">{errors.version.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} placeholder="A brief description of what this API does." />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Endpoints</CardTitle>
            <CardDescription>Define the available endpoints for your API.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 items-start gap-4 rounded-lg border p-4 md:grid-cols-[1fr,150px,2fr,auto]">
                <div className="space-y-2">
                  <Label htmlFor={`endpoints.${index}.path`}>Path</Label>
                  <Input {...register(`endpoints.${index}.path`)} placeholder="/users/{id}" />
                  {errors.endpoints?.[index]?.path && <p className="text-sm text-destructive">{errors.endpoints[index]?.path?.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Method</Label>
                  <Controller
                    control={control}
                    name={`endpoints.${index}.method`}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`endpoints.${index}.summary`}>Summary</Label>
                  <Input {...register(`endpoints.${index}.summary`)} placeholder="Get a specific user" />
                   {errors.endpoints?.[index]?.summary && <p className="text-sm text-destructive">{errors.endpoints[index]?.summary?.message}</p>}
                </div>
                <Button type="button" variant="ghost" size="icon" className="self-center" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
             {errors.endpoints && <p className="text-sm text-destructive">{errors.endpoints.message}</p>}

            <Button type="button" variant="outline" onClick={() => append({ path: '', method: 'GET', summary: '' })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Endpoint
            </Button>
          </CardContent>
          <CardFooter>
            <Button type="submit">Create API</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
