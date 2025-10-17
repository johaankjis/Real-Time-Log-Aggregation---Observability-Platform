import { DashboardLayout } from "@/components/dashboard-layout"
import { SLODashboard } from "@/components/slo-dashboard"

export default function SLOPage() {
  return (
    <DashboardLayout>
      <SLODashboard />
    </DashboardLayout>
  )
}
