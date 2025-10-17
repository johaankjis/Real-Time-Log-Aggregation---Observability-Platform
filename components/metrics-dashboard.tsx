"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertCircle, Clock, Cpu, HardDrive, TrendingUp, Zap } from "lucide-react"
import { MetricChart } from "@/components/metric-chart"
import { MetricGauge } from "@/components/metric-gauge"

export function MetricsDashboard() {
  const [selectedService, setSelectedService] = useState("all")

  const services = ["api-gateway", "auth-service", "payment-service", "user-service"]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Metrics Dashboard</h2>
          <p className="text-muted-foreground mt-1">RED and USE method monitoring</p>
        </div>
        <Select value={selectedService} onValueChange={setSelectedService}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            {services.map((service) => (
              <SelectItem key={service} value={service}>
                {service}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="red" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="red">RED Metrics</TabsTrigger>
          <TabsTrigger value="use">USE Metrics</TabsTrigger>
        </TabsList>

        {/* RED Metrics Tab */}
        <TabsContent value="red" className="space-y-6">
          {/* RED Overview Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-chart-1" />
                  Request Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847 req/s</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-chart-3" />
                  <span className="text-chart-3">+8.2%</span> from baseline
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-chart-4" />
                  Error Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.18%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <Badge variant="secondary" className="text-xs">
                    Within SLO
                  </Badge>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-chart-2" />
                  Response Time (P95)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">287ms</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <span className="text-chart-3">-12ms</span> improvement
                </p>
              </CardContent>
            </Card>
          </div>

          {/* RED Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <MetricChart
              title="Request Rate"
              description="Requests per second over time"
              data={generateTimeSeriesData(48, 2000, 3500)}
              lines={[
                { key: "total", color: "hsl(var(--chart-1))", label: "Total Requests" },
                { key: "success", color: "hsl(var(--chart-3))", label: "Successful" },
              ]}
            />

            <MetricChart
              title="Error Rate"
              description="Percentage of failed requests"
              data={generateTimeSeriesData(48, 0, 2)}
              lines={[
                { key: "errors", color: "hsl(var(--chart-4))", label: "Error %" },
                { key: "threshold", color: "hsl(var(--chart-5))", label: "SLO Threshold" },
              ]}
            />

            <MetricChart
              title="Response Time Distribution"
              description="Latency percentiles (P50, P95, P99)"
              data={generateTimeSeriesData(48, 50, 800)}
              lines={[
                { key: "p50", color: "hsl(var(--chart-2))", label: "P50" },
                { key: "p95", color: "hsl(var(--chart-3))", label: "P95" },
                { key: "p99", color: "hsl(var(--chart-4))", label: "P99" },
              ]}
            />

            <MetricChart
              title="Request Duration Histogram"
              description="Distribution of request durations"
              data={generateHistogramData()}
              lines={[{ key: "count", color: "hsl(var(--chart-1))", label: "Request Count" }]}
            />
          </div>

          {/* Service Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Service Breakdown</CardTitle>
              <CardDescription>RED metrics by service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{service}</h4>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Rate</p>
                        <p className="text-lg font-semibold">{Math.floor(Math.random() * 1000 + 500)} req/s</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Errors</p>
                        <p className="text-lg font-semibold">{(Math.random() * 0.5).toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Duration (P95)</p>
                        <p className="text-lg font-semibold">{Math.floor(Math.random() * 300 + 100)}ms</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* USE Metrics Tab */}
        <TabsContent value="use" className="space-y-6">
          {/* USE Overview Gauges */}
          <div className="grid gap-4 md:grid-cols-4">
            <MetricGauge title="CPU Utilization" value={67} max={100} unit="%" icon={Cpu} color="chart-1" />
            <MetricGauge title="Memory Usage" value={4.2} max={8} unit="GB" icon={HardDrive} color="chart-2" />
            <MetricGauge title="Disk I/O" value={342} max={1000} unit="MB/s" icon={HardDrive} color="chart-3" />
            <MetricGauge title="Network" value={1.8} max={10} unit="Gbps" icon={Zap} color="chart-4" />
          </div>

          {/* USE Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <MetricChart
              title="CPU Utilization"
              description="CPU usage across all nodes"
              data={generateTimeSeriesData(48, 30, 90)}
              lines={[
                { key: "node1", color: "hsl(var(--chart-1))", label: "Node 1" },
                { key: "node2", color: "hsl(var(--chart-2))", label: "Node 2" },
                { key: "node3", color: "hsl(var(--chart-3))", label: "Node 3" },
              ]}
            />

            <MetricChart
              title="Memory Utilization"
              description="Memory usage per node"
              data={generateTimeSeriesData(48, 40, 85)}
              lines={[
                { key: "node1", color: "hsl(var(--chart-1))", label: "Node 1" },
                { key: "node2", color: "hsl(var(--chart-2))", label: "Node 2" },
                { key: "node3", color: "hsl(var(--chart-3))", label: "Node 3" },
              ]}
            />

            <MetricChart
              title="Disk I/O Operations"
              description="Read and write operations per second"
              data={generateTimeSeriesData(48, 100, 800)}
              lines={[
                { key: "read", color: "hsl(var(--chart-2))", label: "Read Ops" },
                { key: "write", color: "hsl(var(--chart-3))", label: "Write Ops" },
              ]}
            />

            <MetricChart
              title="Network Throughput"
              description="Inbound and outbound traffic"
              data={generateTimeSeriesData(48, 500, 2000)}
              lines={[
                { key: "inbound", color: "hsl(var(--chart-1))", label: "Inbound" },
                { key: "outbound", color: "hsl(var(--chart-4))", label: "Outbound" },
              ]}
            />
          </div>

          {/* Resource Saturation */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Saturation</CardTitle>
              <CardDescription>Queue depths and wait times</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <MetricChart
                  title="CPU Queue Depth"
                  description="Processes waiting for CPU time"
                  data={generateTimeSeriesData(48, 0, 10)}
                  lines={[{ key: "queue", color: "hsl(var(--chart-4))", label: "Queue Depth" }]}
                />

                <MetricChart
                  title="Disk Queue Depth"
                  description="I/O operations waiting"
                  data={generateTimeSeriesData(48, 0, 15)}
                  lines={[{ key: "queue", color: "hsl(var(--chart-4))", label: "Queue Depth" }]}
                />
              </div>
            </CardContent>
          </Card>

          {/* Error Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>System Errors</CardTitle>
              <CardDescription>Hardware and software errors</CardDescription>
            </CardHeader>
            <CardContent>
              <MetricChart
                title="Error Count"
                description="System errors over time"
                data={generateTimeSeriesData(48, 0, 5)}
                lines={[
                  { key: "hardware", color: "hsl(var(--chart-4))", label: "Hardware Errors" },
                  { key: "software", color: "hsl(var(--chart-5))", label: "Software Errors" },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
      total: Math.floor(Math.random() * (max - min) + min),
      success: Math.floor(Math.random() * (max - min) + min * 0.95),
      errors: Math.random() * 2,
      threshold: 1.0,
      p50: Math.floor(Math.random() * (max * 0.3 - min) + min),
      p95: Math.floor(Math.random() * (max * 0.6 - min * 2) + min * 2),
      p99: Math.floor(Math.random() * (max - min * 3) + min * 3),
      node1: Math.floor(Math.random() * (max - min) + min),
      node2: Math.floor(Math.random() * (max - min) + min),
      node3: Math.floor(Math.random() * (max - min) + min),
      read: Math.floor(Math.random() * (max * 0.6 - min) + min),
      write: Math.floor(Math.random() * (max * 0.4 - min) + min),
      inbound: Math.floor(Math.random() * (max - min) + min),
      outbound: Math.floor(Math.random() * (max * 0.8 - min) + min),
      queue: Math.floor(Math.random() * max),
      hardware: Math.floor(Math.random() * 3),
      software: Math.floor(Math.random() * 5),
      count: Math.floor(Math.random() * (max - min) + min),
    })
  }
  return data
}

function generateHistogramData(): Array<Record<string, number>> {
  const buckets = ["0-50ms", "50-100ms", "100-200ms", "200-500ms", "500ms+"]
  return buckets.map((bucket, i) => ({
    timestamp: i,
    bucket,
    count: Math.floor(Math.random() * 1000 + 100),
  }))
}
