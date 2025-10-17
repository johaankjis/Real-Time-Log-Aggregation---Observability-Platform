"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Bell, BellOff, CheckCircle2, Clock, ExternalLink, Plus, Search, XCircle } from "lucide-react"

interface Alert {
  id: string
  title: string
  severity: "critical" | "warning" | "info"
  status: "firing" | "resolved" | "acknowledged"
  service: string
  timestamp: number
  description: string
  runbookUrl?: string
  acknowledgedBy?: string
}

interface AlertRule {
  id: string
  name: string
  condition: string
  severity: "critical" | "warning" | "info"
  enabled: boolean
  service: string
  notificationChannels: string[]
}

const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    title: "High Error Rate Detected",
    severity: "critical",
    status: "firing",
    service: "payment-service",
    timestamp: Date.now() - 300000,
    description: "Error rate exceeded 5% threshold for the last 10 minutes",
    runbookUrl: "/runbooks/high-error-rate",
  },
  {
    id: "alert-2",
    title: "CPU Usage Above 80%",
    severity: "warning",
    status: "acknowledged",
    service: "api-gateway",
    timestamp: Date.now() - 900000,
    description: "CPU utilization has been above 80% for 15 minutes",
    acknowledgedBy: "john@example.com",
    runbookUrl: "/runbooks/high-cpu",
  },
  {
    id: "alert-3",
    title: "Database Connection Pool Exhausted",
    severity: "critical",
    status: "firing",
    service: "user-service",
    timestamp: Date.now() - 180000,
    description: "All database connections are in use",
    runbookUrl: "/runbooks/db-pool",
  },
  {
    id: "alert-4",
    title: "Slow Response Time",
    severity: "warning",
    status: "resolved",
    service: "auth-service",
    timestamp: Date.now() - 3600000,
    description: "P95 latency exceeded 500ms threshold",
  },
]

const mockRules: AlertRule[] = [
  {
    id: "rule-1",
    name: "High Error Rate",
    condition: "error_rate > 5% for 10m",
    severity: "critical",
    enabled: true,
    service: "all",
    notificationChannels: ["slack", "pagerduty"],
  },
  {
    id: "rule-2",
    name: "High CPU Usage",
    condition: "cpu_usage > 80% for 15m",
    severity: "warning",
    enabled: true,
    service: "all",
    notificationChannels: ["slack"],
  },
  {
    id: "rule-3",
    name: "SLO Breach",
    condition: "error_budget < 10%",
    severity: "critical",
    enabled: true,
    service: "all",
    notificationChannels: ["slack", "pagerduty", "email"],
  },
]

export function AlertManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const filteredAlerts = mockAlerts.filter((alert) => {
    const matchesSearch =
      searchQuery === "" ||
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.service.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSeverity = selectedSeverity === "all" || alert.severity === selectedSeverity
    const matchesStatus = selectedStatus === "all" || alert.status === selectedStatus
    return matchesSearch && matchesSeverity && matchesStatus
  })

  const firingAlerts = mockAlerts.filter((a) => a.status === "firing").length
  const criticalAlerts = mockAlerts.filter((a) => a.severity === "critical" && a.status === "firing").length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alert Management</h2>
          <p className="text-muted-foreground mt-1">Monitor and manage system alerts</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Alert Rule
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{firingAlerts}</div>
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
            <div className="text-2xl font-bold text-destructive">{criticalAlerts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-chart-3" />
              Resolved (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAlerts.filter((a) => a.status === "resolved").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              MTTA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2m</div>
            <p className="text-xs text-muted-foreground">Mean time to acknowledge</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Active Alerts Tab */}
        <TabsContent value="active" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="firing">Firing</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedSeverity("all")
                    setSelectedStatus("all")
                  }}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alert List */}
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </TabsContent>

        {/* Alert Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Rules</CardTitle>
              <CardDescription>Configure conditions that trigger alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRules.map((rule) => (
                  <AlertRuleCard key={rule.id} rule={rule} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
              <CardDescription>Past alerts and resolutions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {mockAlerts
                    .filter((a) => a.status === "resolved")
                    .map((alert) => (
                      <AlertCard key={alert.id} alert={alert} />
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AlertCard({ alert }: { alert: Alert }) {
  const severityConfig = {
    critical: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive" },
    warning: { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500" },
    info: { icon: Bell, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500" },
  }

  const statusConfig = {
    firing: { label: "FIRING", variant: "destructive" as const },
    acknowledged: { label: "ACKNOWLEDGED", variant: "secondary" as const },
    resolved: { label: "RESOLVED", variant: "outline" as const },
  }

  const config = severityConfig[alert.severity]
  const Icon = config.icon

  return (
    <Card className={`${config.bg} ${config.border} border`}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Icon className={`h-5 w-5 ${config.color} mt-0.5`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <h4 className="font-semibold">{alert.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
              </div>
              <Badge variant={statusConfig[alert.status].variant}>{statusConfig[alert.status].label}</Badge>
            </div>

            <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(alert.timestamp).toLocaleString()}
              </span>
              <Badge variant="outline" className="text-xs">
                {alert.service}
              </Badge>
              {alert.acknowledgedBy && <span>Acked by {alert.acknowledgedBy}</span>}
            </div>

            <div className="flex items-center gap-2">
              {alert.status === "firing" && (
                <>
                  <Button size="sm" variant="outline">
                    Acknowledge
                  </Button>
                  <Button size="sm" variant="outline">
                    Resolve
                  </Button>
                </>
              )}
              {alert.runbookUrl && (
                <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                  <ExternalLink className="h-3 w-3" />
                  View Runbook
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AlertRuleCard({ rule }: { rule: AlertRule }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium">{rule.name}</h4>
            {rule.enabled ? (
              <Badge variant="secondary" className="text-xs gap-1">
                <Bell className="h-3 w-3" />
                Enabled
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs gap-1">
                <BellOff className="h-3 w-3" />
                Disabled
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground font-mono">{rule.condition}</p>
        </div>
        <Badge
          variant={rule.severity === "critical" ? "destructive" : "secondary"}
          className="text-xs uppercase shrink-0"
        >
          {rule.severity}
        </Badge>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground">Notifications:</span>
        {rule.notificationChannels.map((channel) => (
          <Badge key={channel} variant="outline" className="text-xs">
            {channel}
          </Badge>
        ))}
      </div>
    </div>
  )
}
