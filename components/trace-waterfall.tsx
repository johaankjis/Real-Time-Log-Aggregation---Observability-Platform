"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  spans: Span[]
  totalDuration: number
}

export function TraceWaterfall({ trace }: { trace: Trace }) {
  const maxDuration = trace.totalDuration

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-1 pr-4">
        {trace.spans.map((span) => {
          const leftPercent = (span.startTime / maxDuration) * 100
          const widthPercent = (span.duration / maxDuration) * 100

          return (
            <div key={span.id} className="group">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {span.service}
                </Badge>
                <span className="text-xs text-muted-foreground truncate">{span.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">{span.duration}ms</span>
              </div>
              <div className="relative h-8 bg-muted rounded">
                <div
                  className={`absolute h-full rounded transition-all ${
                    span.status === "error" ? "bg-destructive" : "bg-primary"
                  } group-hover:opacity-80`}
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
