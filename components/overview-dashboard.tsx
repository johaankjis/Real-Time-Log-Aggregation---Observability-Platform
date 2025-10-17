"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertCircle, CheckCircle2, Clock, TrendingDown, TrendingUp } from "lucide-react"
import { MetricChart } from "@/components/metric-chart"
import { SystemHealthGrid } from "@/components/system-health-grid"

export function OverviewDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground mt-1">Real-time system health and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Events Ingested</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-chart-3" />
              <span className="text-chart-3">+12.5%</span> from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.23%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-chart-3" />
              <span className="text-chart-3">-45%</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142ms</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-chart-3" />
              <span className="text-chart-3">-8ms</span> from baseline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">SLO Status</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.97%</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Badge variant="secondary" className="text-xs">
                Within budget
              </Badge>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <MetricChart
          title="Request Rate (RED)"
          description="Requests per second across all services"
          data={generateTimeSeriesData(24, 1000, 3000)}
          lines={[
            { key: "requests", color: "hsl(var(--chart-1))" },
            { key: "errors", color: "hsl(var(--chart-4))" },
          ]}
        />

        <MetricChart
          title="Response Time Distribution"
          description="P50, P95, P99 latency percentiles"
          data={generateTimeSeriesData(24, 50, 500)}
          lines={[
            { key: "p50", color: "hsl(var(--chart-2))" },
            { key: "p95", color: "hsl(var(--chart-3))" },
            { key: "p99", color: "hsl(var(--chart-4))" },
          ]}
        />

        <MetricChart
          title="CPU Utilization (USE)"
          description="System resource usage across nodes"
          data={generateTimeSeriesData(24, 20, 80)}
          lines={[
            { key: "node1", color: "hsl(var(--chart-1))" },
            { key: "node2", color: "hsl(var(--chart-2))" },
            { key: "node3", color: "hsl(var(--chart-3))" },
          ]}
        />

        <MetricChart
          title="Error Budget Burn Rate"
          description="Current vs. target error budget consumption"
          data={generateTimeSeriesData(24, 0, 10)}
          lines={[
            { key: "actual", color: "hsl(var(--chart-4))" },
            { key: "threshold", color: "hsl(var(--chart-5))" },
          ]}
        />
      </div>

      {/* System Health */}
      <SystemHealthGrid />
    </div>
  )
}

function generateTimeSeriesData(points: number, min: number, max: number): Array<Record<string, number>> {
  const data = []
  const now = Date.now()
  for (let i = 0; i < points; i++) {
    const timestamp = now - (points - i) * 3600000
    data.push({
      timestamp,
      requests: Math.floor(Math.random() * (max - min) + min),
      errors: Math.floor(Math.random() * (max * 0.05)),
      p50: Math.floor(Math.random() * (max * 0.3 - min) + min),
      p95: Math.floor(Math.random() * (max * 0.6 - min * 2) + min * 2),
      p99: Math.floor(Math.random() * (max - min * 3) + min * 3),
      node1: Math.floor(Math.random() * (max - min) + min),
      node2: Math.floor(Math.random() * (max - min) + min),
      node3: Math.floor(Math.random() * (max - min) + min),
      actual: Math.random() * 8 + 1,
      threshold: 5,
    })
  }
  return data
}
