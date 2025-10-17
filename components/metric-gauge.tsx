"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface MetricGaugeProps {
  title: string
  value: number
  max: number
  unit: string
  icon: LucideIcon
  color: string
}

export function MetricGauge({ title, value, max, unit, icon: Icon, color }: MetricGaugeProps) {
  const percentage = (value / max) * 100
  const isWarning = percentage > 70
  const isCritical = percentage > 85

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className={`h-4 w-4 text-${color}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">{value.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              / {max} {unit}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isCritical ? "bg-destructive" : isWarning ? "bg-yellow-500" : `bg-${color}`
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}% utilized</p>
        </div>
      </CardContent>
    </Card>
  )
}
