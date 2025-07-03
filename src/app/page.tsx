'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, PlusCircle, Search } from 'lucide-react';
import type { ApiDef } from '@/lib/types';
import { useApis } from '@/hooks/use-apis';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { apis, loading } = useApis();

  const filteredApis = apis.filter((api: ApiDef) =>
    api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    api.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          API Discovery
        </h1>
        <p className="text-muted-foreground">
          Browse, discover, and manage your organization's APIs.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search APIs..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link href="/design">
              <PlusCircle />
              New API
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/4 mt-2" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="pt-4">
                    <Skeleton className="h-9 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : filteredApis.length > 0 ? (
          filteredApis.map((api) => (
            <Card key={api.id} className="flex flex-col transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl">{api.name}</CardTitle>
                <CardDescription>Version {api.version}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-4">
                <p className="text-sm text-muted-foreground flex-1">{api.description}</p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={`/apis/${api.id}`}>
                    View Documentation
                    <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-12">
            <p>No APIs found{searchQuery ? ' matching your search' : ''}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
