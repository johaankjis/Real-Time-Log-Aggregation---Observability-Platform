import { DashboardLayout } from "@/components/dashboard-layout"
import { LogViewer } from "@/components/log-viewer"

export default function LogsPage() {
  return (
    <DashboardLayout>
      <LogViewer />
    </DashboardLayout>
  )
}
