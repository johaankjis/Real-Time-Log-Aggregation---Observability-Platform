"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  Filter,
  Info,
  Search,
  XCircle,
} from "lucide-react"

type LogLevel = "error" | "warn" | "info" | "debug"

interface LogEntry {
  id: string
  timestamp: number
  level: LogLevel
  service: string
  message: string
  metadata?: Record<string, unknown>
  traceId?: string
  spanId?: string
}

const mockLogs: LogEntry[] = generateMockLogs(100)

export function LogViewer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [selectedService, setSelectedService] = useState<string>("all")
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = selectedLevel === "all" || log.level === selectedLevel
    const matchesService = selectedService === "all" || log.service === selectedService
    return matchesSearch && matchesLevel && matchesService
  })

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedLogs)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedLogs(newExpanded)
  }

  const services = Array.from(new Set(mockLogs.map((log) => log.service)))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Log Aggregation</h2>
          <p className="text-muted-foreground mt-1">Centralized logging across all services</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-destructive" />
              Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLogs.filter((l) => l.level === "error").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLogs.filter((l) => l.level === "warn").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLogs.filter((l) => l.level === "info").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              Debug
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLogs.filter((l) => l.level === "debug").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs by message or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Log Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="w-full md:w-[180px]">
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

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedLevel("all")
                setSelectedService("all")
              }}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Log Stream */}
      <Card>
        <CardHeader>
          <CardTitle>Log Stream ({filteredLogs.length} entries)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="stream" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b px-6">
              <TabsTrigger value="stream">Stream View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>

            <TabsContent value="stream" className="m-0">
              <ScrollArea className="h-[600px]">
                <div className="p-4 space-y-2">
                  {filteredLogs.map((log) => (
                    <LogEntryCard
                      key={log.id}
                      log={log}
                      isExpanded={expandedLogs.has(log.id)}
                      onToggle={() => toggleExpanded(log.id)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="table" className="m-0">
              <ScrollArea className="h-[600px]">
                <div className="p-4">
                  <LogTable logs={filteredLogs} />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function LogEntryCard({
  log,
  isExpanded,
  onToggle,
}: {
  log: LogEntry
  isExpanded: boolean
  onToggle: () => void
}) {
  const levelConfig = {
    error: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
    warn: { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    info: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10" },
    debug: { icon: CheckCircle2, color: "text-muted-foreground", bg: "bg-muted" },
  }

  const config = levelConfig[log.level]
  const Icon = config.icon

  return (
    <div className={`border rounded-lg p-3 ${config.bg} hover:bg-accent/50 transition-colors cursor-pointer`}>
      <div className="flex items-start gap-3" onClick={onToggle}>
        <div className="mt-0.5">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
        <Icon className={`h-4 w-4 mt-0.5 ${config.color}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {log.level.toUpperCase()}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {log.service}
            </Badge>
            <span className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</span>
            {log.traceId && (
              <Badge variant="outline" className="text-xs font-mono">
                trace:{log.traceId.slice(0, 8)}
              </Badge>
            )}
          </div>
          <p className="text-sm mt-1 font-mono">{log.message}</p>

          {isExpanded && log.metadata && (
            <div className="mt-3 p-3 bg-background rounded border">
              <p className="text-xs font-semibold mb-2">Metadata</p>
              <pre className="text-xs font-mono overflow-x-auto">{JSON.stringify(log.metadata, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LogTable({ logs }: { logs: LogEntry[] }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3 text-sm font-medium">Timestamp</th>
            <th className="text-left p-3 text-sm font-medium">Level</th>
            <th className="text-left p-3 text-sm font-medium">Service</th>
            <th className="text-left p-3 text-sm font-medium">Message</th>
            <th className="text-left p-3 text-sm font-medium">Trace ID</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={log.id} className={index % 2 === 0 ? "bg-card" : "bg-muted/30"}>
              <td className="p-3 text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</td>
              <td className="p-3">
                <Badge variant="outline" className="text-xs">
                  {log.level}
                </Badge>
              </td>
              <td className="p-3 text-sm">{log.service}</td>
              <td className="p-3 text-sm font-mono max-w-md truncate">{log.message}</td>
              <td className="p-3 text-xs font-mono text-muted-foreground">
                {log.traceId ? log.traceId.slice(0, 12) : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function generateMockLogs(count: number): LogEntry[] {
  const services = ["api-gateway", "auth-service", "payment-service", "user-service", "notification-service"]
  const levels: LogLevel[] = ["error", "warn", "info", "debug"]
  const messages = [
    "Request processed successfully",
    "Database connection established",
    "Failed to authenticate user",
    "Payment transaction completed",
    "Cache miss for key",
    "Rate limit exceeded",
    "Invalid request parameters",
    "Service health check passed",
    "Background job started",
    "Email notification sent",
  ]

  const logs: LogEntry[] = []
  const now = Date.now()

  for (let i = 0; i < count; i++) {
    const level = levels[Math.floor(Math.random() * levels.length)]
    logs.push({
      id: `log-${i}`,
      timestamp: now - i * 60000,
      level,
      service: services[Math.floor(Math.random() * services.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      metadata:
        Math.random() > 0.5
          ? {
              userId: `user-${Math.floor(Math.random() * 1000)}`,
              requestId: `req-${Math.random().toString(36).substr(2, 9)}`,
              duration: Math.floor(Math.random() * 1000),
            }
          : undefined,
      traceId: Math.random() > 0.3 ? `trace-${Math.random().toString(36).substr(2, 16)}` : undefined,
      spanId: Math.random() > 0.3 ? `span-${Math.random().toString(36).substr(2, 12)}` : undefined,
    })
  }

  return logs
}
