'use client';

import * as React from 'react';
import { useApiAnalytics } from '@/hooks/use-api-analytics';
import { useApis } from '@/hooks/use-apis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AreaChart, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"


const getMethodClass = (method: string) => {
  switch (method) {
    case 'GET': return 'bg-sky-500 hover:bg-sky-600';
    case 'POST': return 'bg-green-500 hover:bg-green-600';
    case 'PUT': return 'bg-orange-500 hover:bg-orange-600';
    case 'DELETE': return 'bg-red-500 hover:bg-red-600';
    case 'PATCH': return 'bg-yellow-500 hover:bg-yellow-600 text-black';
    default: return 'bg-gray-500 hover:bg-gray-600';
  }
};

export default function MonitoringPage() {
  const { logs, loading: analyticsLoading } = useApiAnalytics();
  const { apis, loading: apisLoading } = useApis();
  
  const loading = analyticsLoading || apisLoading;

  const { totalCalls, uniqueUsers, apiUsage, recentCalls, chartData } = React.useMemo(() => {
    if (loading || !logs.length || !apis.length) {
      return { totalCalls: 0, uniqueUsers: 0, apiUsage: [], recentCalls: [], chartData: [] };
    }

    const apiMap = new Map(apis.map(api => [api.id, api.name]));
    
    const totalCalls = logs.length;
    const uniqueUsers = new Set(logs.map(log => log.userId)).size;

    const usage: Record<string, { count: number; name: string }> = {};
    logs.forEach(log => {
      if (!usage[log.apiId]) {
        usage[log.apiId] = { count: 0, name: apiMap.get(log.apiId) || 'Unknown API' };
      }
      usage[log.apiId].count++;
    });

    const apiUsage = Object.entries(usage)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count);

    const chartData = apiUsage.slice(0, 5).map(api => ({
        name: api.name.length > 15 ? `${api.name.substring(0, 15)}...` : api.name,
        calls: api.count,
    }));
      
    const recentCalls = logs.slice(0, 10).map(log => ({
      ...log,
      apiName: apiMap.get(log.apiId) || 'Unknown API',
    }));

    return { totalCalls, uniqueUsers, apiUsage, recentCalls, chartData };
  }, [logs, apis, loading]);
  
  const chartConfig = {
    calls: {
      label: "API Calls",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

  if (loading) {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-5 w-1/2 mt-2" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                <Skeleton className="h-80" />
                <Skeleton className="h-80" />
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
            <h1 className="font-headline text-3xl font-bold tracking-tight">API Monitoring</h1>
            <p className="text-muted-foreground">
            View analytics and usage statistics for your APIs.
            </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total API Calls</CardTitle>
                    <AreaChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalCalls}</div>
                    <p className="text-xs text-muted-foreground">in session history</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{uniqueUsers}</div>
                    <p className="text-xs text-muted-foreground">actively making calls</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Most Popular API</CardTitle>
                    <AreaChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold truncate">{apiUsage[0]?.name || 'N/A'}</div>
                    <p className="text-xs text-muted-foreground">{apiUsage[0]?.count || 0} calls</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Top APIs by Usage</CardTitle>
                    <CardDescription>APIs with the most calls in this session.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-64">
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="calls" fill="var(--color-calls)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent API Calls</CardTitle>
                    <CardDescription>A live feed of the latest simulated API calls.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>API</TableHead>
                                <TableHead>Endpoint</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="text-right">Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentCalls.map(log => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-medium">{log.apiName}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Badge className={getMethodClass(log.endpointMethod)}>{log.endpointMethod}</Badge>
                                            <span className="font-mono text-xs">{log.endpointPath}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{log.userId}</TableCell>
                                    <TableCell className="text-right text-muted-foreground text-xs">
                                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
