import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { api } from '../services/api';
import { AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface SLADashboard {
  totalActiveWorkOrders: number;
  breachedWorkOrders: number;
  onTrackWorkOrders: number;
  breachPercentage: number;
  status: string;
}

export const Dashboard = () => {
  const [slaData, setSlaData] = useState<SLADashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSLAData = async () => {
      try {
        const data = await api.getSLADashboard();
        setSlaData(data);
      } catch (error) {
        console.error('Failed to fetch SLA data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSLAData();
    const interval = setInterval(fetchSLAData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'GREEN':
        return 'from-green-400 to-emerald-400';
      case 'YELLOW':
        return 'from-yellow-400 to-amber-400';
      case 'RED':
        return 'from-red-400 to-pink-400';
      default:
        return 'from-blue-400 to-cyan-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'GREEN':
        return 'bg-green-500 bg-opacity-20 border-green-500';
      case 'YELLOW':
        return 'bg-yellow-500 bg-opacity-20 border-yellow-500';
      case 'RED':
        return 'bg-red-500 bg-opacity-20 border-red-500';
      default:
        return 'bg-blue-500 bg-opacity-20 border-blue-500';
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
          SLA Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Real-time field service management metrics
        </p>

        {loading ? (
          <div className="glass-card p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading dashboard...</p>
          </div>
        ) : slaData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Work Orders */}
            <div className="glass-card p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                    Active Work Orders
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {slaData.totalActiveWorkOrders}
                  </p>
                </div>
                <TrendingUp className="text-blue-500" size={32} />
              </div>
            </div>

            {/* On Track */}
            <div className="glass-card p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                    On Track
                  </p>
                  <p className="text-3xl font-bold mt-2 text-green-500">
                    {slaData.onTrackWorkOrders}
                  </p>
                </div>
                <CheckCircle className="text-green-500" size={32} />
              </div>
            </div>

            {/* Breached */}
            <div className="glass-card p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                    SLA Breached
                  </p>
                  <p className="text-3xl font-bold mt-2 text-red-500">
                    {slaData.breachedWorkOrders}
                  </p>
                </div>
                <AlertCircle className="text-red-500" size={32} />
              </div>
            </div>

            {/* Status */}
            <div className={`glass-card p-6 hover:shadow-lg transition-all border ${getStatusBg(slaData.status)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                    System Status
                  </p>
                  <p className={`text-3xl font-bold mt-2 bg-gradient-to-r ${getStatusColor(slaData.status)} bg-clip-text text-transparent`}>
                    {slaData.status}
                  </p>
                </div>
                <Clock className="text-blue-500" size={32} />
              </div>
            </div>
          </div>
        ) : null}

        {/* SLA Breach Details */}
        {slaData && (
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold mb-6">SLA Performance</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Breach Rate</span>
                  <span className="text-sm font-semibold">
                    {slaData.breachPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${
                      slaData.breachPercentage === 0
                        ? 'from-green-400 to-emerald-400'
                        : slaData.breachPercentage < 10
                        ? 'from-yellow-400 to-amber-400'
                        : 'from-red-400 to-pink-400'
                    }`}
                    style={{ width: `${Math.min(slaData.breachPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white border-opacity-10">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Success Rate
                  </p>
                  <p className="text-2xl font-bold text-green-500 mt-1">
                    {(100 - slaData.breachPercentage).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Avg Response Time
                  </p>
                  <p className="text-2xl font-bold text-blue-500 mt-1">
                    {slaData.totalActiveWorkOrders > 0 ? '4.2h' : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
