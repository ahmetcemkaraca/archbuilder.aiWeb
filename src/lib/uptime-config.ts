/**
 * Uptime Monitoring Configuration
 * External monitoring service integration config
 */

export interface UptimeConfig {
  providers: {
    uptimeRobot?: {
      enabled: boolean;
      monitorId?: string;
      apiKey?: string;
      checkInterval: number; // minutes
    };
    pingdom?: {
      enabled: boolean;
      checkId?: string;
      apiKey?: string;
      checkInterval: number; // minutes
    };
    statusPage?: {
      enabled: boolean;
      pageId?: string;
      incidents: boolean;
    };
  };
  alerts: {
    email: string[];
    slack?: {
      webhookUrl: string;
      channel: string;
    };
    discord?: {
      webhookUrl: string;
    };
  };
  checks: {
    http: {
      url: string;
      expectedStatus: number;
      timeout: number; // seconds
      followRedirects: boolean;
    }[];
    dns: {
      hostname: string;
      expectedIps: string[];
    }[];
    ssl: {
      hostname: string;
      warningDays: number; // warn before expiry
    }[];
  };
}

export const defaultUptimeConfig: UptimeConfig = {
  providers: {
    uptimeRobot: {
      enabled: false,
      checkInterval: 5 // 5 minutes
    },
    pingdom: {
      enabled: false,
      checkInterval: 1 // 1 minute
    },
    statusPage: {
      enabled: false,
      incidents: true
    }
  },
  alerts: {
    email: [process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@archbuilder.ai'],
    slack: process.env.SLACK_WEBHOOK_URL ? {
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
      channel: '#alerts'
    } : undefined
  },
  checks: {
    http: [
      {
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://archbuilder.ai',
        expectedStatus: 200,
        timeout: 30,
        followRedirects: true
      },
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://archbuilder.ai'}/sitemap.xml`,
        expectedStatus: 200,
        timeout: 10,
        followRedirects: false
      },
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://archbuilder.ai'}/robots.txt`,
        expectedStatus: 200,
        timeout: 10,
        followRedirects: false
      }
    ],
    dns: [
      {
        hostname: 'archbuilder.ai',
        expectedIps: [] // Will be populated based on hosting provider
      }
    ],
    ssl: [
      {
        hostname: 'archbuilder.ai',
        warningDays: 30 // Warn 30 days before SSL expiry
      }
    ]
  }
};

/**
 * Status page incident types
 */
export interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  impact: 'none' | 'minor' | 'major' | 'critical';
  components: string[]; // affected components
  updates: {
    timestamp: string;
    status: string;
    message: string;
  }[];
  createdAt: string;
  resolvedAt?: string;
}

/**
 * System status interface
 */
export interface SystemStatus {
  overall: 'operational' | 'degraded' | 'partial_outage' | 'major_outage';
  components: {
    [key: string]: {
      status: 'operational' | 'degraded_performance' | 'partial_outage' | 'major_outage';
      description: string;
      lastChecked: string;
    };
  };
  incidents: Incident[];
  uptime: {
    last24h: number; // percentage
    last7d: number;
    last30d: number;
    last90d: number;
  };
}

/**
 * Uptime monitoring utilities
 */
export class UptimeMonitor {
  private config: UptimeConfig;

  constructor(config: UptimeConfig = defaultUptimeConfig) {
    this.config = config;
  }

  /**
   * Create UptimeRobot monitor configuration
   */
  generateUptimeRobotConfig(): Record<string, unknown> | null {
    if (!this.config.providers.uptimeRobot?.enabled) return null;

    return {
      friendly_name: 'ArchBuilder.AI Website',
      url: this.config.checks.http[0]?.url,
      type: 1, // HTTP(s)
      interval: this.config.providers.uptimeRobot.checkInterval * 60, // convert to seconds
      timeout: this.config.checks.http[0]?.timeout || 30,
      http_method: 1, // GET
      http_username: '',
      http_password: '',
      alert_contacts: this.config.alerts.email.map(email => ({
        type: 2, // Email
        value: email,
        threshold: 0,
        recurrence: 0
      })),
      custom_http_headers: JSON.stringify({
        'User-Agent': 'ArchBuilder.AI-Monitor/1.0'
      }),
      ignore_ssl_errors: 0
    };
  }

  /**
   * Create Pingdom check configuration
   */
  generatePingdomConfig(): Record<string, unknown> | null {
    if (!this.config.providers.pingdom?.enabled) return null;

    return {
      name: 'ArchBuilder.AI Website',
      host: new URL(this.config.checks.http[0]?.url || '').hostname,
      type: 'http',
      paused: false,
      resolution: this.config.providers.pingdom.checkInterval,
      sendnotificationwhendown: 2, // after 2 failed checks
      notifyagainevery: 0,
      notifywhenbackup: true,
      tags: ['archbuilder', 'production', 'website'],
      probe_filters: ['region:EU', 'region:NA'],
      userids: [],
      teamids: [],
      integrationids: [],
      custom_message: 'ArchBuilder.AI website monitoring alert',
      http: {
        url: this.config.checks.http[0]?.url,
        encryption: true,
        port: 443,
        username: '',
        password: '',
        shouldcontain: 'ArchBuilder.AI',
        shouldnotcontain: 'Error',
        postdata: '',
        requestheaders: {
          'User-Agent': 'Pingdom.com_bot_version_1.4_(http://www.pingdom.com/)'
        }
      }
    };
  }

  /**
   * Generate monitoring script for self-hosted solutions
   */
  generateMonitoringScript(): string {
    const checks = this.config.checks.http.map(check => `
# HTTP Check: ${check.url}
curl -f -s -o /dev/null -w "%{http_code}" --max-time ${check.timeout} "${check.url}" | grep -q "${check.expectedStatus}" || echo "ALERT: ${check.url} returned non-${check.expectedStatus} status"
`).join('\n');

    const sslChecks = this.config.checks.ssl.map(ssl => `
# SSL Check: ${ssl.hostname}
expiry_date=$(echo | openssl s_client -servername ${ssl.hostname} -connect ${ssl.hostname}:443 2>/dev/null | openssl x509 -noout -dates | grep 'notAfter' | cut -d= -f2)
expiry_timestamp=$(date -d "$expiry_date" +%s)
current_timestamp=$(date +%s)
days_until_expiry=$(( ($expiry_timestamp - $current_timestamp) / 86400 ))
if [ $days_until_expiry -lt ${ssl.warningDays} ]; then
  echo "ALERT: SSL certificate for ${ssl.hostname} expires in $days_until_expiry days"
fi
`).join('\n');

    return `#!/bin/bash
# ArchBuilder.AI Uptime Monitoring Script
# Generated on: $(date)

set -e

LOG_FILE="/var/log/archbuilder-monitor.log"
ERROR_COUNT=0

log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

log "Starting uptime monitoring checks..."

${checks}

${sslChecks}

# DNS Checks
${this.config.checks.dns.map(dns => `
log "Checking DNS for ${dns.hostname}..."
nslookup ${dns.hostname} > /dev/null || { log "ALERT: DNS resolution failed for ${dns.hostname}"; ERROR_COUNT=$((ERROR_COUNT + 1)); }
`).join('\n')}

# Summary
if [ $ERROR_COUNT -eq 0 ]; then
  log "All checks passed successfully"
  exit 0
else
  log "ALERT: $ERROR_COUNT checks failed"
  
  # Send alert if configured
  ${this.config.alerts.slack ? `
  curl -X POST -H 'Content-type: application/json' \\
    --data "{\\"text\\":\\"🚨 ArchBuilder.AI Monitor Alert: $ERROR_COUNT checks failed. Check logs for details.\\"}" \\
    "${this.config.alerts.slack.webhookUrl}"
  ` : '# No Slack webhook configured'}
  
  exit 1
fi
`;
  }

  /**
   * Generate status page template
   */
  generateStatusPageTemplate(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ArchBuilder.AI System Status</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; }
        .status-indicator { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 8px; }
        .operational { background: #28a745; }
        .degraded { background: #ffc107; }
        .outage { background: #dc3545; }
        .component { background: white; border-radius: 8px; padding: 20px; margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .incident { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 15px; border-radius: 4px; }
        .uptime-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-top: 30px; }
        .stat { text-align: center; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .stat-value { font-size: 2em; font-weight: bold; color: #28a745; }
        .stat-label { color: #6c757d; margin-top: 5px; }
    </style>
    <script>
        // Auto-refresh every 30 seconds
        setTimeout(() => location.reload(), 30000);
        
        // Fetch status from health check endpoint
        async function updateStatus() {
            try {
                const response = await fetch('/api/health');
                const data = await response.json();
                
                // Update overall status
                const statusEl = document.getElementById('overall-status');
                statusEl.className = 'status-indicator ' + (data.status === 'healthy' ? 'operational' : 
                    data.status === 'degraded' ? 'degraded' : 'outage');
                
                document.getElementById('status-text').textContent = 
                    data.status === 'healthy' ? 'All Systems Operational' :
                    data.status === 'degraded' ? 'Degraded Performance' : 'System Outage';
                    
                // Update last checked time
                document.getElementById('last-updated').textContent = 
                    'Last updated: ' + new Date(data.timestamp).toLocaleString();
                    
            } catch (error) {
                console.error('Failed to fetch status:', error);
            }
        }
        
        document.addEventListener('DOMContentLoaded', updateStatus);
    </script>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ArchBuilder.AI System Status</h1>
            <div>
                <span id="overall-status" class="status-indicator operational"></span>
                <span id="status-text">All Systems Operational</span>
            </div>
            <small id="last-updated">Last updated: Loading...</small>
        </div>
        
        <div class="component">
            <h3><span class="status-indicator operational"></span>Website</h3>
            <p>Main website and static content delivery</p>
        </div>
        
        <div class="component">
            <h3><span class="status-indicator operational"></span>CDN</h3>
            <p>Content delivery network for global performance</p>
        </div>
        
        <div class="component">
            <h3><span class="status-indicator operational"></span>Analytics</h3>
            <p>Google Analytics tracking and performance monitoring</p>
        </div>
        
        <div class="uptime-stats">
            <div class="stat">
                <div class="stat-value">99.9%</div>
                <div class="stat-label">30 Days</div>
            </div>
            <div class="stat">
                <div class="stat-value">99.8%</div>
                <div class="stat-label">90 Days</div>
            </div>
            <div class="stat">
                <div class="stat-value">< 100ms</div>
                <div class="stat-label">Avg Response</div>
            </div>
            <div class="stat">
                <div class="stat-value">0</div>
                <div class="stat-label">Active Incidents</div>
            </div>
        </div>
    </div>
</body>
</html>`;
  }
}

export const uptimeMonitor = new UptimeMonitor();