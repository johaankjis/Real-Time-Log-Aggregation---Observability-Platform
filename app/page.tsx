import { DashboardLayout } from "@/components/dashboard-layout"
import { OverviewDashboard } from "@/components/overview-dashboard"

export default function HomePage() {
  return (
    <DashboardLayout>
      <OverviewDashboard />
    </DashboardLayout>
  )
}
