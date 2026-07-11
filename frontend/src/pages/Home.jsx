import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  CheckSquare,
  Compass,
  HelpCircle,
  ArrowRight,
  Activity,
  Bell,
  Sparkles,
  MapPin,
  Users,
  FileText,
  Loader2,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Package,
  Route,
  ShieldCheck,
  Cloud,
  X,
} from 'lucide-react';
import { useApp } from '../hooks/useApp';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { cn } from '../utils/cn';

// ---------------------------------------------------------------------------
// AI Preparedness Planner Widget
// ---------------------------------------------------------------------------
function AIPlannerWidget() {
  const {
    plannerLoading: loading,
    plannerPlan: plan,
    plannerError: error,
    generatePreparednessPlan,
    cancelPlannerRequest,
    clearPlanner,
  } = useApp();

  const [form, setForm] = useState({ location: '', householdSize: '', specialRequirements: '' });
  const [expandedSections, setExpandedSections] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Auto-expand all sections when plan is loaded
  useEffect(() => {
    if (plan) {
      setExpandedSections({
        checklist: true,
        evacuation: true,
        safety: true,
        kit: true,
      });
    }
  }, [plan]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.location.trim() || !form.householdSize) return;
    generatePreparednessPlan({
      location: form.location,
      householdSize: Number(form.householdSize),
      specialRequirements: form.specialRequirements,
    });
  };

  const handleRetry = () => {
    generatePreparednessPlan({
      location: form.location,
      householdSize: Number(form.householdSize),
      specialRequirements: form.specialRequirements,
    });
  };

  const handleClear = () => {
    clearPlanner();
    setForm({ location: '', householdSize: '', specialRequirements: '' });
    setExpandedSections({});
  };

  const riskColors = {
    Low: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    Moderate: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    High: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    Critical: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  };

  const priorityColors = {
    High: 'text-rose-400 bg-rose-500/10',
    Medium: 'text-amber-400 bg-amber-500/10',
    Low: 'text-emerald-400 bg-emerald-500/10',
  };

  return (
    <section className="space-y-6">
      <div className="text-left space-y-1">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <h2 className="text-2xl font-bold tracking-tight">AI Preparedness Planner</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Generate a personalized monsoon preparedness plan powered by Gemini AI.
        </p>
      </div>

      {/* Glassmorphic planner card */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/60 glassmorphism-card">
        {/* Decorative gradient orbs */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-8">
          {/* Form */}
          <AnimatePresence mode="wait">
            {!plan && !loading && (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <MapPin className="h-3.5 w-3.5" />
                      Location
                    </label>
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="e.g. Mumbai, Maharashtra"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm transition-all duration-200 outline-none border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <Users className="h-3.5 w-3.5" />
                      Household Size
                    </label>
                    <input
                      name="householdSize"
                      type="number"
                      min="1"
                      max="50"
                      value={form.householdSize}
                      onChange={handleChange}
                      placeholder="e.g. 4"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm transition-all duration-200 outline-none border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <FileText className="h-3.5 w-3.5" />
                    Special Requirements
                    <span className="text-slate-400 dark:text-slate-600 font-normal normal-case tracking-normal">(optional)</span>
                  </label>
                  <textarea
                    name="specialRequirements"
                    value={form.specialRequirements}
                    onChange={handleChange}
                    rows={2}
                    placeholder="e.g. 2 elderly family members, 1 infant, pet dog…"
                    className="w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm transition-all duration-200 outline-none border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400 resize-none"
                  />
                </div>

                {/* Error display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/5 border border-rose-500/15 dark:bg-rose-950/20">
                        <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-2">
                          <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">{error}</p>
                          <Button
                            variant="secondary"
                            className="text-xs py-1.5 px-3"
                            onClick={handleRetry}
                          >
                            <RefreshCw className="h-3 w-3" /> Retry Generation
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full sm:w-auto"
                  disabled={!form.location.trim() || !form.householdSize}
                >
                  <Sparkles className="h-4 w-4" />
                  Generate AI Plan
                </Button>
              </motion.form>
            )}

            {/* Loading state */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 space-y-5"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl animate-pulse" />
                  <Loader2 className="relative h-12 w-12 text-indigo-500 animate-spin" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                    Generating your plan…
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Gemini AI is analyzing monsoon data for {form.location}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  className="text-xs"
                  onClick={cancelPlannerRequest}
                >
                  Cancel
                </Button>
              </motion.div>
            )}

            {/* Results */}
            {plan && !loading && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <ShieldCheck className="h-6 w-6 text-indigo-500" />
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                        {plan.planTitle || 'Your Preparedness Plan'}
                      </h3>
                    </div>
                    {plan.riskLevel && (
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border',
                          riskColors[plan.riskLevel] || riskColors.Moderate
                        )}
                      >
                        <Activity className="h-3 w-3" />
                        {plan.riskLevel} Risk
                      </span>
                    )}
                  </div>
                  <Button variant="secondary" className="text-xs shrink-0" onClick={handleClear}>
                    <X className="h-3.5 w-3.5" /> New Plan
                  </Button>
                </div>

                {/* Weather Summary */}
                {plan.weatherSummary && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-sky-500/5 border border-sky-500/15 dark:bg-sky-950/20">
                    <Cloud className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {plan.weatherSummary}
                    </p>
                  </div>
                )}

                {/* Collapsible Sections */}
                <div className="space-y-3">
                  {/* Checklist */}
                  {plan.checklist?.length > 0 && (
                    <CollapsibleSection
                      title="Preparedness Checklist"
                      icon={<CheckSquare className="h-4 w-4 text-emerald-500" />}
                      count={plan.checklist.length}
                      expanded={expandedSections.checklist}
                      onToggle={() => toggleSection('checklist')}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {plan.checklist.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2.5 p-3 rounded-lg bg-white/30 dark:bg-slate-900/20 border border-slate-200/40 dark:border-slate-800/40"
                          >
                            <span
                              className={cn(
                                'shrink-0 mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded',
                                priorityColors[item.priority] || priorityColors.Medium
                              )}
                            >
                              {item.priority}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">
                                {item.item}
                              </p>
                              {item.category && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                  {item.category}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleSection>
                  )}

                  {/* Evacuation Steps */}
                  {plan.evacuationSteps?.length > 0 && (
                    <CollapsibleSection
                      title="Evacuation Steps"
                      icon={<Route className="h-4 w-4 text-amber-500" />}
                      count={plan.evacuationSteps.length}
                      expanded={expandedSections.evacuation}
                      onToggle={() => toggleSection('evacuation')}
                    >
                      <ol className="space-y-2">
                        {plan.evacuationSteps.map((step, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm">
                            <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 font-bold text-xs border border-amber-500/20">
                              {i + 1}
                            </span>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pt-0.5">
                              {step}
                            </p>
                          </li>
                        ))}
                      </ol>
                    </CollapsibleSection>
                  )}

                  {/* Safety Guidelines */}
                  {plan.safetyGuidelines?.length > 0 && (
                    <CollapsibleSection
                      title="Safety Guidelines"
                      icon={<ShieldAlert className="h-4 w-4 text-sky-500" />}
                      count={plan.safetyGuidelines.length}
                      expanded={expandedSections.safety}
                      onToggle={() => toggleSection('safety')}
                    >
                      <ul className="space-y-2">
                        {plan.safetyGuidelines.map((guideline, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm">
                            <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-500" />
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                              {guideline}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </CollapsibleSection>
                  )}

                  {/* Emergency Kit */}
                  {plan.emergencyKit?.length > 0 && (
                    <CollapsibleSection
                      title="Emergency Kit"
                      icon={<Package className="h-4 w-4 text-rose-500" />}
                      count={plan.emergencyKit.length}
                      expanded={expandedSections.kit}
                      onToggle={() => toggleSection('kit')}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {plan.emergencyKit.map((kitItem, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/30 dark:bg-slate-900/20 border border-slate-200/40 dark:border-slate-800/40"
                          >
                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                              {kitItem.item}
                            </span>
                            <span className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full shrink-0 ml-2">
                              {kitItem.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CollapsibleSection>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Collapsible Section Component
// ---------------------------------------------------------------------------
function CollapsibleSection({ title, icon, count, expanded, onToggle, children }) {
  return (
    <div className="rounded-xl border border-slate-200/40 dark:border-slate-800/40 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/20 dark:bg-slate-900/10 hover:bg-white/40 dark:hover:bg-slate-900/20 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">({count})</span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Home Page
// ---------------------------------------------------------------------------
export function Home() {
  const navigate = useNavigate();
  const { checklist, reports, subscription } = useApp();

  // Calculate checklist progress
  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const quickActions = [
    {
      name: 'Weather Feeds',
      description: 'Subscribe to alerts or report storms/flooding in your local vicinity.',
      icon: ShieldAlert,
      path: '/alerts',
      color: 'text-rose-500 bg-rose-500/10 dark:bg-rose-500/15',
    },
    {
      name: 'Emergency Checklist',
      description: 'Track and manage emergency supplies before severe precipitation starts.',
      icon: CheckSquare,
      path: '/checklist',
      color: 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15',
    },
    {
      name: 'Travel Advisories',
      description: 'Check active road closures and flood status reported by fellow citizens.',
      icon: Compass,
      path: '/travel',
      color: 'text-sky-500 bg-sky-500/10 dark:bg-sky-500/15',
    },
    {
      name: 'Safety Guide',
      description: 'Learn storm preparedness and emergency protocols.',
      icon: HelpCircle,
      path: '/about',
      color: 'text-amber-500 bg-amber-500/10 dark:bg-amber-500/15',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Premium Gradient Hero Section */}
      <section className="relative rounded-3xl overflow-hidden py-16 px-6 sm:px-12 text-center bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 dark:from-slate-950 dark:via-sky-950 dark:to-indigo-950 border border-slate-800 shadow-2xl">
        {/* Animated ambient light elements */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="warning" className="mb-4">
              Monsoon Warning System Active
            </Badge>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Monsoon Preparedness & <br />
            <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Citizen Assistance
            </span>
          </h1>

          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Stay ahead of seasonal storm hazards. Track live weather advisories, report flood threats, and verify your household checklist. Powered by civic collaboration.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button variant="primary" onClick={() => navigate('/alerts')}>
              View Weather Alerts
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="secondary" onClick={() => navigate('/checklist')}>
              Prepare Checklist
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Summary Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Checklist widget */}
        <Card hoverEffect className="flex flex-col justify-between h-full bg-white/40 dark:bg-slate-900/30">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-450 dark:text-slate-400 uppercase tracking-wider">
                My Checklist Status
              </span>
              <CheckSquare className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold">{progressPercent}%</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {completedCount} of {totalCount} completed
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
          <Button
            variant="glass"
            className="w-full mt-6 py-2 text-xs"
            onClick={() => navigate('/checklist')}
          >
            Manage Supplies
          </Button>
        </Card>

        {/* Community Alerts widget */}
        <Card hoverEffect className="flex flex-col justify-between h-full bg-white/40 dark:bg-slate-900/30">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-450 dark:text-slate-400 uppercase tracking-wider">
                Community Reports
              </span>
              <Activity className="h-5 w-5 text-rose-500" />
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold">{reports.length}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Active citizen reports
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                {reports.length > 0
                  ? 'Local warnings are actively logged. Review closures before commuting.'
                  : 'No local alerts submitted. Be the first to report hazards in your area.'}
              </p>
            </div>
          </div>
          <Button
            variant="glass"
            className="w-full mt-6 py-2 text-xs"
            onClick={() => navigate('/travel')}
          >
            Review Road Maps
          </Button>
        </Card>

        {/* Subscriptions widget */}
        <Card hoverEffect className="flex flex-col justify-between h-full bg-white/40 dark:bg-slate-900/30">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-450 dark:text-slate-400 uppercase tracking-wider">
                Emergency Alert Sub
              </span>
              <Bell className="h-5 w-5 text-sky-500" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={subscription.isSubscribed ? 'success' : 'danger'}>
                  {subscription.isSubscribed ? 'Subscribed' : 'Not Subscribed'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                {subscription.isSubscribed
                  ? `Configured to dispatch updates to: ${subscription.contact}`
                  : 'Subscribe for instant flood, landslide, and storm SMS notifications.'}
              </p>
            </div>
          </div>
          <Button
            variant="glass"
            className="w-full mt-6 py-2 text-xs"
            onClick={() => navigate('/alerts')}
          >
            Manage Notifications
          </Button>
        </Card>
      </section>

      {/* AI Preparedness Planner Widget */}
      <AIPlannerWidget />

      {/* Quick Action Navigation Grid */}
      <section className="space-y-6">
        <div className="text-left space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Citizen Core Utilities</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Select an assistance module to browse guidelines or update local parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card
              key={action.name}
              hoverEffect
              animate
              onClick={() => navigate(action.path)}
              className="flex flex-col justify-between text-left p-6 h-full cursor-pointer hover:border-sky-500/30 transition-all group"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="space-y-4">
                <div className={cn('p-3 rounded-2xl w-fit transition-transform group-hover:scale-110 duration-200', action.color)}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
                    {action.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">
                    {action.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-500 mt-6 group-hover:translate-x-1 transition-transform">
                Open Utility <ArrowRight className="h-3 w-3" />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
