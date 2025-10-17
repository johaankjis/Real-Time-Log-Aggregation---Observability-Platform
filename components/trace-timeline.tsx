"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Span {
  id: string
  name: string
  service: string
  startTime: number
  duration: number
  status: "ok" | "error"
}

interface Trace {
  spans: Span[]
  totalDuration: number
}

export function TraceTimeline({ trace }: { trace: Trace }) {
  const sortedSpans = [...trace.spans].sort((a, b) => a.startTime - b.startTime)

  return (
    <ScrollArea className="h-[500px]">
      <div className="relative pl-8 pr-4">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        {sortedSpans.map((span, index) => (
          <div key={span.id} className="relative pb-6">
            {/* Timeline dot */}
            <div
              className={`absolute left-[13px] w-3 h-3 rounded-full border-2 ${
                span.status === "error" ? "bg-destructive border-destructive" : "bg-primary border-primary"
              }`}
            />

            {/* Content */}
            <div className="ml-6 border rounded-lg p-3 bg-card">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-medium text-sm">{span.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {span.service}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{span.duration}ms</span>
                  </div>
                </div>
                <Badge variant={span.status === "error" ? "destructive" : "secondary"} className="text-xs">
                  {span.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Started at +{span.startTime}ms</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
