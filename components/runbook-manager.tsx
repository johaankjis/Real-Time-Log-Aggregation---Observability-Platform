"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, ChevronRight, Clock, Edit, Plus, Search, Tag } from "lucide-react"

interface Runbook {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  lastUpdated: number
  author: string
  steps: RunbookStep[]
}

interface RunbookStep {
  id: string
  title: string
  description: string
  command?: string
  expectedResult?: string
}

const mockRunbooks: Runbook[] = [
  {
    id: "rb-1",
    title: "High Error Rate Response",
    description: "Steps to diagnose and resolve high error rates in production services",
    category: "Incident Response",
    tags: ["errors", "production", "critical"],
    lastUpdated: Date.now() - 86400000,
    author: "DevOps Team",
    steps: [
      {
        id: "step-1",
        title: "Check Error Logs",
        description: "Review recent error logs to identify the root cause",
        command: 'kubectl logs -l app=api-gateway --tail=100 | grep "ERROR"',
        expectedResult: "Identify error patterns and affected endpoints",
      },
      {
        id: "step-2",
        title: "Verify Service Health",
        description: "Check if all service instances are healthy",
        command: "kubectl get pods -n production",
        expectedResult: "All pods should be in Running state",
      },
      {
        id: "step-3",
        title: "Check Dependencies",
        description: "Verify external dependencies (database, cache, APIs) are responding",
        expectedResult: "All dependencies should respond within acceptable timeframes",
      },
      {
        id: "step-4",
        title: "Scale if Needed",
        description: "If traffic spike is causing errors, scale up the service",
        command: "kubectl scale deployment api-gateway --replicas=10",
        expectedResult: "Additional pods should start and distribute load",
      },
    ],
  },
  {
    id: "rb-2",
    title: "Database Connection Pool Exhaustion",
    description: "Resolve database connection pool issues",
    category: "Database",
    tags: ["database", "connections", "performance"],
    lastUpdated: Date.now() - 172800000,
    author: "Database Team",
    steps: [
      {
        id: "step-1",
        title: "Check Active Connections",
        description: "Query the database to see current connection count",
        command: "SELECT count(*) FROM pg_stat_activity;",
        expectedResult: "Compare against max_connections setting",
      },
      {
        id: "step-2",
        title: "Identify Long-Running Queries",
        description: "Find queries that are holding connections",
        command: "SELECT pid, now() - query_start as duration, query FROM pg_stat_activity WHERE state = 'active';",
        expectedResult: "List of active queries with durations",
      },
      {
        id: "step-3",
        title: "Increase Pool Size",
        description: "Temporarily increase connection pool size",
        command: "Update application config: DB_POOL_SIZE=50",
        expectedResult: "More connections available for the application",
      },
    ],
  },
  {
    id: "rb-3",
    title: "High CPU Usage Investigation",
    description: "Diagnose and resolve high CPU utilization",
    category: "Performance",
    tags: ["cpu", "performance", "optimization"],
    lastUpdated: Date.now() - 259200000,
    author: "SRE Team",
    steps: [
      {
        id: "step-1",
        title: "Identify Top Processes",
        description: "Find processes consuming the most CPU",
        command: "top -b -n 1 | head -20",
        expectedResult: "List of processes sorted by CPU usage",
      },
      {
        id: "step-2",
        title: "Check Application Metrics",
        description: "Review application-level metrics for anomalies",
        expectedResult: "Identify if specific endpoints or operations are causing high CPU",
      },
      {
        id: "step-3",
        title: "Profile the Application",
        description: "Enable profiling to identify hot code paths",
        command: "Enable profiler endpoint: /debug/pprof/profile",
        expectedResult: "CPU profile data for analysis",
      },
    ],
  },
]

export function RunbookManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedRunbook, setSelectedRunbook] = useState<Runbook | null>(null)

  const filteredRunbooks = mockRunbooks.filter((runbook) => {
    const matchesSearch =
      searchQuery === "" ||
      runbook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      runbook.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      runbook.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || runbook.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(mockRunbooks.map((r) => r.category)))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Runbook Library</h2>
          <p className="text-muted-foreground mt-1">Documented procedures for incident response and operations</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Runbook
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Total Runbooks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRunbooks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recently Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockRunbooks.filter((r) => Date.now() - r.lastUpdated < 604800000).length}
            </div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Runbook List */}
        <Card>
          <CardHeader>
            <CardTitle>Runbooks</CardTitle>
            <CardDescription>Browse and search operational procedures</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 border-b space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search runbooks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    size="sm"
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <ScrollArea className="h-[600px]">
              <div className="p-4 space-y-2">
                {filteredRunbooks.map((runbook) => (
                  <div
                    key={runbook.id}
                    onClick={() => setSelectedRunbook(runbook)}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors hover:bg-accent ${
                      selectedRunbook?.id === runbook.id ? "bg-accent border-primary" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium mb-1">{runbook.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{runbook.description}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {runbook.category}
                          </Badge>
                          {runbook.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Runbook Details */}
        <Card>
          <CardHeader>
            <CardTitle>Runbook Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRunbook ? (
              <ScrollArea className="h-[700px] pr-4">
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold">{selectedRunbook.title}</h3>
                      <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    </div>
                    <p className="text-muted-foreground mb-3">{selectedRunbook.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Updated {new Date(selectedRunbook.lastUpdated).toLocaleDateString()}
                      </span>
                      <span>By {selectedRunbook.author}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {selectedRunbook.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Steps */}
                  <div>
                    <h4 className="font-semibold mb-4">Procedure Steps</h4>
                    <div className="space-y-4">
                      {selectedRunbook.steps.map((step, index) => (
                        <div key={step.id} className="border rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium mb-1">{step.title}</h5>
                              <p className="text-sm text-muted-foreground mb-3">{step.description}</p>

                              {step.command && (
                                <div className="mb-3">
                                  <p className="text-xs font-medium mb-1">Command:</p>
                                  <div className="bg-muted rounded p-2">
                                    <code className="text-xs font-mono">{step.command}</code>
                                  </div>
                                </div>
                              )}

                              {step.expectedResult && (
                                <div>
                                  <p className="text-xs font-medium mb-1">Expected Result:</p>
                                  <p className="text-xs text-muted-foreground">{step.expectedResult}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-[700px] text-muted-foreground">
                Select a runbook to view details
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
