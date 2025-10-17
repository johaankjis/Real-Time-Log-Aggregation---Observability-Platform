"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, ChevronRight, Clock, GitBranch, Search, Zap } from "lucide-react"
import { TraceTimeline } from "@/components/trace-timeline"
import { TraceWaterfall } from "@/components/trace-waterfall"

interface Span {
  id: string
  traceId: string
  parentId?: string
  name: string
  service: string
  startTime: number
  duration: number
  status: "ok" | "error"
  tags: Record<string, string>
}

interface Trace {
  id: string
  rootSpan: string
  spans: Span[]
  totalDuration: number
  services: string[]
  timestamp: number
  status: "ok" | "error"
}

const mockTraces: Trace[] = generateMockTraces(20)

export function TraceViewer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedService, setSelectedService] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedTrace, setSelectedTrace] = useState<Trace | null>(null)

  const filteredTraces = mockTraces.filter((trace) => {
    const matchesSearch =
      searchQuery === "" ||
      trace.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trace.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesService = selectedService === "all" || trace.services.includes(selectedService)
    const matchesStatus = selectedStatus === "all" || trace.status === selectedStatus
    return matchesSearch && matchesService && matchesStatus
  })

  const allServices = Array.from(new Set(mockTraces.flatMap((t) => t.services)))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Distributed Tracing</h2>
        <p className="text-muted-foreground mt-1">Visualize request flows across microservices</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Total Traces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTraces.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(mockTraces.reduce((sum, t) => sum + t.totalDuration, 0) / mockTraces.length)}ms
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Error Traces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTraces.filter((t) => t.status === "error").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allServices.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by trace ID or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {allServices.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ok">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedService("all")
                setSelectedStatus("all")
              }}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Trace List */}
        <Card>
          <CardHeader>
            <CardTitle>Traces ({filteredTraces.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="p-4 space-y-2">
                {filteredTraces.map((trace) => (
                  <div
                    key={trace.id}
                    onClick={() => setSelectedTrace(trace)}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors hover:bg-accent ${
                      selectedTrace?.id === trace.id ? "bg-accent border-primary" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={trace.status === "error" ? "destructive" : "secondary"} className="text-xs">
                            {trace.status === "error" ? "ERROR" : "OK"}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-mono">{trace.id.slice(0, 12)}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {trace.services.map((service) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {trace.totalDuration}ms
                          </span>
                          <span>{new Date(trace.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Trace Details */}
        <Card>
          <CardHeader>
            <CardTitle>Trace Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTrace ? (
              <Tabs defaultValue="waterfall" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="waterfall" className="flex-1">
                    Waterfall
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="flex-1">
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger value="spans" className="flex-1">
                    Spans
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="waterfall" className="mt-4">
                  <TraceWaterfall trace={selectedTrace} />
                </TabsContent>

                <TabsContent value="timeline" className="mt-4">
                  <TraceTimeline trace={selectedTrace} />
                </TabsContent>

                <TabsContent value="spans" className="mt-4">
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      {selectedTrace.spans.map((span) => (
                        <div key={span.id} className="border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-sm">{span.name}</p>
                              <p className="text-xs text-muted-foreground">{span.service}</p>
                            </div>
                            <Badge variant={span.status === "error" ? "destructive" : "secondary"} className="text-xs">
                              {span.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                            <span>{span.duration}ms</span>
                            <span className="font-mono">{span.id.slice(0, 12)}</span>
                          </div>
                          {Object.keys(span.tags).length > 0 && (
                            <div className="mt-2 p-2 bg-muted rounded text-xs">
                              {Object.entries(span.tags).map(([key, value]) => (
                                <div key={key} className="flex gap-2">
                                  <span className="font-medium">{key}:</span>
                                  <span className="text-muted-foreground">{value}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center h-[500px] text-muted-foreground">
                Select a trace to view details
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function generateMockTraces(count: number): Trace[] {
  const services = ["api-gateway", "auth-service", "payment-service", "user-service", "database"]
  const operations = ["GET /users", "POST /payment", "GET /orders", "PUT /profile", "DELETE /session"]

  const traces: Trace[] = []
  const now = Date.now()

  for (let i = 0; i < count; i++) {
    const traceId = `trace-${Math.random().toString(36).substr(2, 16)}`
    const numSpans = Math.floor(Math.random() * 5) + 3
    const spans: Span[] = []
    const traceServices = new Set<string>()

    let currentTime = 0

    for (let j = 0; j < numSpans; j++) {
      const service = services[Math.floor(Math.random() * services.length)]
      traceServices.add(service)

      const span: Span = {
        id: `span-${Math.random().toString(36).substr(2, 12)}`,
        traceId,
        parentId: j > 0 ? spans[Math.floor(Math.random() * j)].id : undefined,
        name: operations[Math.floor(Math.random() * operations.length)],
        service,
        startTime: currentTime,
        duration: Math.floor(Math.random() * 200) + 10,
        status: Math.random() > 0.85 ? "error" : "ok",
        tags: {
          "http.method": ["GET", "POST", "PUT", "DELETE"][Math.floor(Math.random() * 4)],
          "http.status_code": Math.random() > 0.85 ? "500" : "200",
        },
      }

      spans.push(span)
      currentTime += span.duration
    }

    const hasError = spans.some((s) => s.status === "error")

    traces.push({
      id: traceId,
      rootSpan: spans[0].id,
      spans,
      totalDuration: Math.max(...spans.map((s) => s.startTime + s.duration)),
      services: Array.from(traceServices),
      timestamp: now - i * 120000,
      status: hasError ? "error" : "ok",
    })
  }

  return traces
}
