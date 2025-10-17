import { DashboardLayout } from "@/components/dashboard-layout"
import { TraceViewer } from "@/components/trace-viewer"

export default function TracesPage() {
  return (
    <DashboardLayout>
      <TraceViewer />
    </DashboardLayout>
  )
}
