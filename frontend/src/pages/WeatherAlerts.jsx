import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ShieldAlert, Send, Eye, Bell, Activity, Droplets, MapPin } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';

export function WeatherAlerts() {
  const { reports, addReport, subscription, subscribe, unsubscribe } = useApp();
  const [radarZoom, setRadarZoom] = useState(2); // Mock interaction
  const [successToast, setSuccessToast] = useState('');

  // Forms
  const {
    register: regSub,
    handleSubmit: handleSubSubmit,
    formState: { errors: subErrors },
    reset: resetSub,
  } = useForm({
    defaultValues: { method: 'Email', contact: '' },
  });

  const {
    register: regReport,
    handleSubmit: handleReportSubmit,
    formState: { errors: reportErrors },
    reset: resetReport,
  } = useForm({
    defaultValues: { location: '', type: 'Heavy Rain', severity: 'Warning', description: '' },
  });

  // Action handlers
  const onSubscribe = (data) => {
    subscribe(data.method, data.contact);
    showToast(`Successfully subscribed via ${data.method}!`);
    resetSub();
  };

  const onReport = (data) => {
    addReport({
      location: data.location,
      type: data.type,
      severity: data.severity,
      description: data.description,
    });
    showToast('Report submitted! Your notification has been logged locally.');
    resetReport();
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  return (
    <div className="space-y-8 text-left">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 glassmorphism px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium text-sm flex items-center gap-2 animate-bounce">
          <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
          {successToast}
        </div>
      )}

      {/* Header Info */}
      <div className="space-y-2">
        <Badge variant="danger">Crisis Monitor</Badge>
        <h1 className="text-3xl font-extrabold tracking-tight">Weather Alerts & Radar</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Subscribe to localized storm warnings or participate by broadcasting precipitation hazards in your neighborhood.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Alerts Feed & Subscription */}
        <div className="lg:col-span-1 space-y-6">
          {/* Subscription Card */}
          <Card className="bg-white/40 dark:bg-slate-900/30">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-sky-500" />
              Emergency Broadcasting
            </h2>

            {subscription.isSubscribed ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 text-sm">
                  <p className="text-emerald-800 dark:text-emerald-355 font-bold">Alert System Active</p>
                  <p className="text-slate-550 dark:text-slate-400 text-xs mt-1 leading-normal">
                    You will receive {subscription.method} emergency notifications on: <strong>{subscription.contact}</strong>
                  </p>
                </div>
                <Button variant="secondary" className="w-full text-xs" onClick={unsubscribe}>
                  Unsubscribe
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubSubmit(onSubscribe)} className="space-y-4">
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Delivery Method
                  </label>
                  <select
                    {...regSub('method')}
                    className="w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-900/40 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 backdrop-blur-sm transition-all focus:border-sky-500/80 focus:ring-2 focus:ring-sky-500/20 outline-none"
                  >
                    <option value="Email" className="dark:bg-slate-950">Email Alerts</option>
                    <option value="SMS" className="dark:bg-slate-950">SMS Warnings</option>
                  </select>
                </div>

                <Input
                  label="Contact Info"
                  placeholder="e.g. name@domain.com or phone number"
                  error={subErrors.contact}
                  {...regSub('contact', { required: 'This field is required' })}
                />

                <Button type="submit" variant="primary" className="w-full">
                  Activate Broadcasts
                </Button>
              </form>
            )}
          </Card>

          {/* Report Alert Card */}
          <Card className="bg-white/40 dark:bg-slate-900/30">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-500" />
              Report Local Hazard
            </h2>

            <form onSubmit={handleReportSubmit(onReport)} className="space-y-4">
              <Input
                label="Location/Sector"
                placeholder="e.g. Block C, Sector 5..."
                error={reportErrors.location}
                {...regReport('location', { required: 'Please enter location' })}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Hazard Type
                  </label>
                  <select
                    {...regReport('type')}
                    className="w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-900/40 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 backdrop-blur-sm transition-all focus:border-sky-500/80 focus:ring-2 focus:ring-sky-500/20 outline-none"
                  >
                    <option value="Flooding" className="dark:bg-slate-950">Flooding</option>
                    <option value="Heavy Rain" className="dark:bg-slate-950">Heavy Rain</option>
                    <option value="Landslide" className="dark:bg-slate-950">Landslide</option>
                    <option value="Power Outage" className="dark:bg-slate-950">Power Outage</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Severity
                  </label>
                  <select
                    {...regReport('severity')}
                    className="w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-900/40 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 backdrop-blur-sm transition-all focus:border-sky-500/80 focus:ring-2 focus:ring-sky-500/20 outline-none"
                  >
                    <option value="Info" className="dark:bg-slate-950">Low / Info</option>
                    <option value="Warning" className="dark:bg-slate-950">Warning</option>
                    <option value="Danger" className="dark:bg-slate-950">Critical</option>
                  </select>
                </div>
              </div>

              <Input
                label="Situation Details"
                placeholder="Describe current road or water levels..."
                textarea
                error={reportErrors.description}
                {...regReport('description', { required: 'Please add details' })}
              />

              <Button type="submit" variant="danger" className="w-full">
                <Send className="h-4 w-4" /> Broadcast Report
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Column: Radar Map & Feeds */}
        <div className="lg:col-span-2 space-y-6">
          {/* Radar Mock */}
          <Card className="bg-slate-950/80 text-white relative overflow-hidden h-96 border-slate-850 flex flex-col justify-between">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]" />
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#0284c7_1px,transparent_1px),linear-gradient(to_bottom,#0284c7_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Radar Sweeper Animation */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-sky-500/30 rounded-full flex items-center justify-center">
              <div className="absolute w-60 h-60 border border-sky-500/20 rounded-full" />
              <div className="absolute w-40 h-40 border border-sky-500/10 rounded-full" />
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-sky-500/15" />
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-sky-500/15" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500/0 via-sky-500/0 to-sky-500/15 animate-[spin_6s_linear_infinite]" />
            </div>

            {/* Radar status header */}
            <div className="relative p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span>
                <span className="font-semibold text-xs tracking-wider uppercase text-sky-400">
                  Radar Feed: Sector Live
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="secondary"
                  className="px-2 py-1 text-[10px] rounded-lg bg-white/5 border-none text-slate-300"
                  onClick={() => setRadarZoom((z) => (z % 3) + 1)}
                >
                  <Eye className="h-3 w-3 inline mr-1" /> Zoom (x{radarZoom})
                </Button>
              </div>
            </div>

            {/* Mock storm blobs */}
            <div className="relative flex-grow flex items-center justify-center">
              <div className="absolute top-1/3 left-1/3 p-4 bg-rose-500/20 border border-rose-500/40 rounded-full blur-sm animate-pulse flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-rose-300 drop-shadow-md">Storm Zone</span>
                <Droplets className="h-4 w-4 text-rose-300 mt-1" />
              </div>

              <div className="absolute bottom-1/4 right-1/3 p-6 bg-amber-500/10 border border-amber-500/30 rounded-full blur-[2px] animate-pulse flex flex-col items-center justify-center">
                <span className="text-[9px] font-bold text-amber-300 drop-shadow-md">Precipitation</span>
              </div>
            </div>

            {/* Radar status footer */}
            <div className="relative p-4 bg-slate-900/90 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
              <p>Simulating meteorological projection. Radar tracking active.</p>
              <Badge variant="warning">Heavy Rain Advised</Badge>
            </div>
          </Card>

          {/* Active Citizen Broadcasts feed */}
          <div className="space-y-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-sky-500" />
              Citizen Warning Feeds
            </h2>

            {reports.length === 0 ? (
              <Card className="text-center py-8 text-slate-500 bg-white/40 dark:bg-slate-900/30">
                <MapPin className="h-8 w-8 mx-auto text-slate-400 mb-2 opacity-50" />
                <p className="text-sm font-semibold">No active warnings broadcasted.</p>
                <p className="text-xs text-slate-400 dark:text-slate-550 mt-1">
                  Use the "Report Local Hazard" panel to publish storm details.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map((report) => (
                  <Card
                    key={report.id}
                    className="bg-white/50 dark:bg-slate-900/40 hover:border-slate-400/25 transition-all text-left flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-1.5 items-center">
                          <MapPin className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                          <span className="font-bold text-sm">{report.location}</span>
                        </div>
                        <Badge
                          variant={
                            report.severity === 'Danger'
                              ? 'danger'
                              : report.severity === 'Warning'
                              ? 'warning'
                              : 'info'
                          }
                        >
                          {report.severity}
                        </Badge>
                      </div>
                      <p className="text-xs font-semibold text-sky-550 dark:text-sky-400 uppercase tracking-wide">
                        {report.type}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {report.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/40 flex items-center justify-between text-xs text-slate-500">
                      <span>{new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <button
                        className="flex items-center gap-1 hover:text-sky-500 font-semibold cursor-pointer"
                        title="Flag report as helpful"
                      >
                        Helpful Alerts
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherAlerts;
