"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface MetricChartProps {
  title: string
  description: string
  data: Array<Record<string, number>>
  lines: Array<{ key: string; color: string }>
}

export function MetricChart({ title, description, data, lines }: MetricChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => {
                const date = new Date(value)
                return `${date.getHours()}:00`
              }}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload) return null
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      {payload.map((entry: any) => (
                        <div key={entry.dataKey} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="text-xs text-muted-foreground">{entry.dataKey}:</span>
                          <span className="text-xs font-medium">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }}
            />
            {lines.map((line) => (
              <Line key={line.key} type="monotone" dataKey={line.key} stroke={line.color} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
