"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, CheckCircle2, Clock, Plus, Target, TrendingDown, TrendingUp, XCircle } from "lucide-react"
import { MetricChart } from "@/components/metric-chart"

interface SLO {
  id: string
  name: string
  service: string
  target: number
  current: number
  type: "availability" | "latency" | "error-rate"
  window: "7d" | "30d" | "90d"
  errorBudget: number
  errorBudgetRemaining: number
  status: "healthy" | "warning" | "critical"
}

const mockSLOs: SLO[] = [
  {
    id: "slo-1",
    name: "API Availability",
    service: "api-gateway",
    target: 99.9,
    current: 99.95,
    type: "availability",
    window: "30d",
    errorBudget: 43.2,
    errorBudgetRemaining: 38.7,
    status: "healthy",
  },
  {
    id: "slo-2",
    name: "Payment Latency P95",
    service: "payment-service",
    target: 500,
    current: 287,
    type: "latency",
    window: "7d",
    errorBudget: 100,
    errorBudgetRemaining: 72.3,
    status: "healthy",
  },
  {
    id: "slo-3",
    name: "Auth Error Rate",
    service: "auth-service",
    target: 0.5,
    current: 0.82,
    type: "error-rate",
    window: "30d",
    errorBudget: 100,
    errorBudgetRemaining: 23.4,
    status: "warning",
  },
  {
    id: "slo-4",
    name: "User Service Availability",
    service: "user-service",
    target: 99.95,
    current: 99.87,
    type: "availability",
    window: "30d",
    errorBudget: 21.6,
    errorBudgetRemaining: 4.2,
    status: "critical",
  },
]

export function SLODashboard() {
  const [selectedWindow, setSelectedWindow] = useState<string>("30d")
  const [selectedService, setSelectedService] = useState<string>("all")

  const filteredSLOs = mockSLOs.filter((slo) => {
    const matchesWindow = selectedWindow === "all" || slo.window === selectedWindow
    const matchesService = selectedService === "all" || slo.service === selectedService
    return matchesWindow && matchesService
  })

  const healthySLOs = filteredSLOs.filter((s) => s.status === "healthy").length
  const warningSLOs = filteredSLOs.filter((s) => s.status === "warning").length
  const criticalSLOs = filteredSLOs.filter((s) => s.status === "critical").length

  const services = Array.from(new Set(mockSLOs.map((s) => s.service)))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SLO & SLA Management</h2>
          <p className="text-muted-foreground mt-1">Track service level objectives and error budgets</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New SLO
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Total SLOs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredSLOs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-chart-3" />
              Healthy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">{healthySLOs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Warning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{warningSLOs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-destructive" />
              Critical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalSLOs}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select value={selectedWindow} onValueChange={setSelectedWindow}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Window" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Windows</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Service" />
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
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="error-budget">Error Budget</TabsTrigger>
          <TabsTrigger value="burn-rate">Burn Rate</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {filteredSLOs.map((slo) => (
            <SLOCard key={slo.id} slo={slo} />
          ))}
        </TabsContent>

        {/* Error Budget Tab */}
        <TabsContent value="error-budget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Error Budget Overview</CardTitle>
              <CardDescription>Remaining error budget across all SLOs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSLOs.map((slo) => (
                  <div key={slo.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{slo.name}</p>
                        <p className="text-xs text-muted-foreground">{slo.service}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{slo.errorBudgetRemaining.toFixed(1)}% remaining</p>
                        <p className="text-xs text-muted-foreground">of {slo.errorBudget.toFixed(1)} min</p>
                      </div>
                    </div>
                    <Progress
                      value={slo.errorBudgetRemaining}
                      className={`h-2 ${
                        slo.errorBudgetRemaining < 20
                          ? "[&>div]:bg-destructive"
                          : slo.errorBudgetRemaining < 50
                            ? "[&>div]:bg-yellow-500"
                            : "[&>div]:bg-chart-3"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <MetricChart
              title="Error Budget Consumption"
              description="Budget usage over time"
              data={generateErrorBudgetData(30)}
              lines={[
                { key: "consumed", color: "hsl(var(--chart-4))", label: "Consumed" },
                { key: "remaining", color: "hsl(var(--chart-3))", label: "Remaining" },
              ]}
            />

            <MetricChart
              title="Error Budget by Service"
              description="Remaining budget per service"
              data={generateServiceBudgetData()}
              lines={[{ key: "budget", color: "hsl(var(--chart-1))", label: "Remaining %" }]}
            />
          </div>
        </TabsContent>

        {/* Burn Rate Tab */}
        <TabsContent value="burn-rate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Error Budget Burn Rate</CardTitle>
              <CardDescription>Rate at which error budget is being consumed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <MetricChart
                  title="Burn Rate (1h window)"
                  description="Short-term burn rate"
                  data={generateBurnRateData(24)}
                  lines={[
                    { key: "actual", color: "hsl(var(--chart-4))", label: "Actual" },
                    { key: "threshold", color: "hsl(var(--chart-5))", label: "Alert Threshold" },
                  ]}
                />

                <MetricChart
                  title="Burn Rate (6h window)"
                  description="Medium-term burn rate"
                  data={generateBurnRateData(24)}
                  lines={[
                    { key: "actual", color: "hsl(var(--chart-4))", label: "Actual" },
                    { key: "threshold", color: "hsl(var(--chart-5))", label: "Alert Threshold" },
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Burn Rate Alerts</CardTitle>
              <CardDescription>Active and recent burn rate violations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <BurnRateAlert
                  slo="Auth Error Rate"
                  severity="warning"
                  message="6h burn rate exceeds 2x threshold"
                  timestamp={Date.now() - 3600000}
                />
                <BurnRateAlert
                  slo="User Service Availability"
                  severity="critical"
                  message="1h burn rate exceeds 14x threshold"
                  timestamp={Date.now() - 1800000}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SLOCard({ slo }: { slo: SLO }) {
  const isOnTarget = slo.type === "latency" ? slo.current <= slo.target : slo.current >= slo.target
  const statusConfig = {
    healthy: { icon: CheckCircle2, color: "text-chart-3", bg: "bg-chart-3/10" },
    warning: { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    critical: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  }

  const config = statusConfig[slo.status]
  const Icon = config.icon

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {slo.name}
              <Badge variant="outline" className="text-xs">
                {slo.window}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1">{slo.service}</CardDescription>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bg}`}>
            <Icon className={`h-4 w-4 ${config.color}`} />
            <span className={`text-sm font-medium ${config.color}`}>{slo.status.toUpperCase()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Current vs Target */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Current vs Target</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {slo.current}
                {slo.type === "latency" ? "ms" : "%"}
              </span>
              <span className="text-sm text-muted-foreground">
                / {slo.target}
                {slo.type === "latency" ? "ms" : "%"}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              {isOnTarget ? (
                <>
                  <TrendingUp className="h-3 w-3 text-chart-3" />
                  <span className="text-xs text-chart-3">On target</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-destructive" />
                  <span className="text-xs text-destructive">Below target</span>
                </>
              )}
            </div>
          </div>

          {/* Error Budget */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Error Budget</p>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{slo.errorBudgetRemaining.toFixed(1)}%</span>
                <span className="text-sm text-muted-foreground">remaining</span>
              </div>
              <Progress
                value={slo.errorBudgetRemaining}
                className={`h-2 ${
                  slo.errorBudgetRemaining < 20
                    ? "[&>div]:bg-destructive"
                    : slo.errorBudgetRemaining < 50
                      ? "[&>div]:bg-yellow-500"
                      : "[&>div]:bg-chart-3"
                }`}
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">SLO Type</p>
            <Badge variant="secondary" className="text-sm">
              {slo.type.replace("-", " ").toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BurnRateAlert({
  slo,
  severity,
  message,
  timestamp,
}: {
  slo: string
  severity: "warning" | "critical"
  message: string
  timestamp: number
}) {
  return (
    <div
      className={`border rounded-lg p-3 ${severity === "critical" ? "bg-destructive/10 border-destructive" : "bg-yellow-500/10 border-yellow-500"}`}
    >
      <div className="flex items-start gap-3">
        {severity === "critical" ? (
          <XCircle className="h-5 w-5 text-destructive mt-0.5" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
        )}
        <div className="flex-1">
          <p className="font-medium text-sm">{slo}</p>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {new Date(timestamp).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}

function generateErrorBudgetData(points: number): Array<Record<string, number>> {
  const data = []
  const now = Date.now()
  let remaining = 100

  for (let i = 0; i < points; i++) {
    remaining -= Math.random() * 3
    data.push({
      timestamp: now - (points - i) * 86400000,
      consumed: 100 - remaining,
      remaining: Math.max(0, remaining),
    })
  }
  return data
}

function generateServiceBudgetData(): Array<Record<string, number>> {
  const services = ["api-gateway", "auth-service", "payment-service", "user-service"]
  return services.map((service, i) => ({
    timestamp: i,
    service,
    budget: Math.random() * 80 + 20,
  }))
}

function generateBurnRateData(points: number): Array<Record<string, number>> {
  const data = []
  const now = Date.now()

  for (let i = 0; i < points; i++) {
    data.push({
      timestamp: now - (points - i) * 3600000,
      actual: Math.random() * 10 + 1,
      threshold: 5,
    })
  }
  return data
}
