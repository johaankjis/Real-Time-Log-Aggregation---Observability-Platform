"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react"

const services = [
  { name: "API Gateway", status: "healthy", uptime: "99.99%", latency: "45ms" },
  { name: "Auth Service", status: "healthy", uptime: "99.97%", latency: "32ms" },
  { name: "Database Primary", status: "healthy", uptime: "100%", latency: "12ms" },
  { name: "Cache Layer", status: "warning", uptime: "99.85%", latency: "8ms" },
  { name: "Message Queue", status: "healthy", uptime: "99.99%", latency: "15ms" },
  { name: "Search Index", status: "healthy", uptime: "99.92%", latency: "78ms" },
  { name: "CDN", status: "healthy", uptime: "100%", latency: "23ms" },
  { name: "Analytics Pipeline", status: "degraded", uptime: "98.50%", latency: "234ms" },
]

export function SystemHealthGrid() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div key={service.name} className="flex items-start gap-3 rounded-lg border border-border p-3 bg-card">
              <div className="mt-0.5">
                {service.status === "healthy" && <CheckCircle2 className="h-4 w-4 text-chart-3" />}
                {service.status === "warning" && <AlertCircle className="h-4 w-4 text-chart-3" />}
                {service.status === "degraded" && <XCircle className="h-4 w-4 text-chart-4" />}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{service.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{service.uptime}</span>
                  <span>•</span>
                  <span>{service.latency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
