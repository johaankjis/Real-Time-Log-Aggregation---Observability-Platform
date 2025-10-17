# ObserveX - Real-Time Observability Platform

A modern, comprehensive observability platform for monitoring and analyzing logs, traces, and metrics in real-time. Built with Next.js and designed for scalability and performance.

## 🚀 Overview

ObserveX is a centralized observability platform that provides real-time monitoring, log aggregation, distributed tracing, and metrics visualization. It helps DevOps teams and developers maintain system health, troubleshoot issues, and optimize application performance.

## ✨ Features

### 📊 **Overview Dashboard**
- Real-time system health metrics
- Events ingestion monitoring (1.2M+ events tracked)
- Error rate analysis with trend indicators
- Average latency monitoring (142ms baseline)
- SLO/SLA compliance tracking (99.97% uptime)
- RED metrics visualization (Rate, Errors, Duration)
- Response time distribution charts (P50, P95, P99 percentiles)

### 📝 **Log Viewer**
- Real-time log aggregation and streaming
- Advanced filtering and search capabilities
- Contextual log analysis
- Log level categorization (INFO, WARN, ERROR, DEBUG)
- Service and source filtering
- Time-based log navigation

### 🔍 **Distributed Tracing**
- End-to-end request tracing
- Service dependency mapping
- Trace waterfall visualization
- Span analysis and timing breakdowns
- Error trace detection
- Performance bottleneck identification

### 📈 **Metrics Dashboard**
- System performance metrics visualization
- Custom metric charts with multiple data series
- Time-series data analysis
- Resource utilization tracking
- Interactive metric exploration
- Gauge visualizations for key indicators

### 🎯 **SLO/SLA Management**
- Service Level Objective tracking
- Error budget monitoring
- Compliance status dashboards
- Target vs actual performance visualization
- Multi-service SLO management
- Historical compliance reporting

### 🚨 **Alert Management**
- Real-time alert configuration
- Severity-based alert categorization (Critical, Warning, Info)
- Alert status tracking (Firing, Resolved, Silenced)
- Multi-channel alerting support
- Alert history and analytics
- Custom alert rules

### 📚 **Runbook Manager**
- Incident response playbooks
- Step-by-step troubleshooting guides
- Automated remediation workflows
- Documentation integration
- Runbook versioning
- Team collaboration features

## 🛠️ Technology Stack

### Frontend
- **Framework:** [Next.js 15](https://nextjs.org/) - React framework with server-side rendering
- **Language:** [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components:** [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- **Charts:** [Recharts](https://recharts.org/) - Composable charting library
- **Icons:** [Lucide React](https://lucide.dev/) - Beautiful icon library
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - Form validation

### Development Tools
- **Package Manager:** pnpm - Fast, disk space efficient package manager
- **Analytics:** [Vercel Analytics](https://vercel.com/analytics) - Performance monitoring
- **Theme:** next-themes - Dark mode support

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.x or higher
- **pnpm** 8.x or higher (or npm/yarn)

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/johaankjis/Real-Time-Log-Aggregation---Observability-Platform.git
   cd Real-Time-Log-Aggregation---Observability-Platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
pnpm build
pnpm start
```

### Linting

```bash
pnpm lint
```

## 📂 Project Structure

```
Real-Time-Log-Aggregation---Observability-Platform/
├── app/                          # Next.js app directory
│   ├── alerts/                   # Alert management page
│   ├── logs/                     # Log viewer page
│   ├── metrics/                  # Metrics dashboard page
│   ├── runbooks/                 # Runbook manager page
│   ├── slo/                      # SLO/SLA dashboard page
│   ├── traces/                   # Distributed tracing page
│   ├── layout.tsx                # Root layout component
│   ├── page.tsx                  # Overview dashboard (home page)
│   └── globals.css               # Global styles and theme variables
├── components/                   # React components
│   ├── ui/                       # Reusable UI components (buttons, cards, etc.)
│   ├── alert-management.tsx      # Alert management component
│   ├── dashboard-layout.tsx      # Main dashboard layout with navigation
│   ├── log-viewer.tsx            # Log viewing component
│   ├── metric-chart.tsx          # Metric chart visualization
│   ├── metric-gauge.tsx          # Gauge visualization component
│   ├── metrics-dashboard.tsx     # Metrics dashboard component
│   ├── overview-dashboard.tsx    # Overview dashboard component
│   ├── runbook-manager.tsx       # Runbook management component
│   ├── slo-dashboard.tsx         # SLO/SLA dashboard component
│   ├── system-health-grid.tsx    # System health grid component
│   ├── trace-timeline.tsx        # Trace timeline visualization
│   ├── trace-viewer.tsx          # Trace viewer component
│   └── trace-waterfall.tsx       # Trace waterfall chart
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions and helpers
│   └── utils.ts                  # Common utility functions
├── public/                       # Static assets
├── styles/                       # Additional stylesheets
├── components.json               # UI components configuration
├── next.config.mjs               # Next.js configuration
├── package.json                  # Project dependencies
├── postcss.config.mjs            # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🎨 Key Features in Detail

### Navigation
The platform includes a sidebar navigation with quick access to:
- **Overview** - Central dashboard with system health metrics
- **Logs** - Real-time log aggregation and search
- **Traces** - Distributed tracing and performance analysis
- **Metrics** - Custom metrics and visualizations
- **SLO/SLA** - Service level objective monitoring
- **Alerts** - Alert configuration and management
- **Runbooks** - Incident response playbooks

### Environment & Time Range Selection
- Multi-environment support (Production, Staging, Development)
- Flexible time range selection (Last 15m, 1h, 6h, 12h, 24h, 7d, 30d, Custom)
- Real-time auto-refresh capability

### Dark Mode
Built-in dark mode support with seamless theme switching for reduced eye strain during monitoring sessions.

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory for environment-specific configuration:

```env
# Add your environment variables here
NEXT_PUBLIC_API_URL=your_api_url
```

### Customization
- **Theme Colors:** Modify `app/globals.css` to customize the color palette
- **Navigation:** Update `components/dashboard-layout.tsx` to add/remove menu items
- **Time Ranges:** Customize time range options in the dashboard layout

## 🧪 Development

### Code Style
The project uses ESLint for code linting. Run the linter with:
```bash
pnpm lint
```

### TypeScript
The project is fully typed with TypeScript. Type checking is integrated into the build process.

### Component Development
- All UI components are built using Radix UI primitives for accessibility
- Components follow a consistent pattern with TypeScript interfaces
- Tailwind CSS is used for styling with the `cn()` utility for class merging

## 📊 Data Visualization

The platform includes several visualization components:
- **Line Charts** - Time-series data with Recharts
- **Gauge Charts** - Progress and percentage indicators
- **Waterfall Charts** - Trace timing visualization
- **System Health Grids** - Service status overview

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and patterns
- Add TypeScript types for all new code
- Ensure all components are accessible
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- [@johaankjis](https://github.com/johaankjis)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

**Note:** This is a demonstration platform. For production use, integrate with actual observability backends like Prometheus, Grafana, Elasticsearch, or Jaeger for data collection and storage.
