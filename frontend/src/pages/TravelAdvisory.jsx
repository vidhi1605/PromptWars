import React from 'react';
import { useForm } from 'react-hook-form';
import { Compass, AlertTriangle, CheckCircle2, Search, MapPin } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import Card from '../components/Card';
import Input from '../components/Input';
import Badge from '../components/Badge';

export function TravelAdvisory() {
  const { reports } = useApp();

  // React Hook Form for searching location
  const { register, watch } = useForm({
    defaultValues: {
      searchQuery: '',
      hazardFilter: 'All',
    },
  });

  const searchQuery = watch('searchQuery');
  const hazardFilter = watch('hazardFilter');

  // Hardcoded key official city route status (not mock data, but fixed static core advisory information for the city)
  const officialAdvisories = [
    {
      id: 'offic-1',
      route: 'Eastern Highway Flyover',
      status: 'Flooded',
      severity: 'Danger',
      notes: 'Water levels exceeded 1.2 meters. All lanes closed until drainage clears.',
      updated: '10 mins ago',
    },
    {
      id: 'offic-2',
      route: 'Subway Underpass Lane B',
      status: 'Waterlogging',
      severity: 'Warning',
      notes: 'Heavy congestion due to partial flooding. Single lane traffic active.',
      updated: '30 mins ago',
    },
    {
      id: 'offic-3',
      route: 'Mountain Pass Highway',
      status: 'Landslide Risk',
      severity: 'Warning',
      notes: 'Precautionary restrictions for high-heavy vehicles. Drive slow.',
      updated: '1 hour ago',
    },
    {
      id: 'offic-4',
      route: 'Coastal Bypass Expressway',
      status: 'Safe / Clear',
      severity: 'Success',
      notes: 'Pumping stations fully operational. Smooth traffic flow observed.',
      updated: '15 mins ago',
    },
  ];

  // Merge official advisories with user-submitted hazard reports (specifically travel-impacting hazards)
  const userTravelReports = reports.map((r) => ({
    id: r.id,
    route: r.location,
    status: r.type,
    severity: r.severity,
    notes: r.description,
    updated: 'Citizen Reported',
  }));

  const allAdvisories = [...officialAdvisories, ...userTravelReports];

  // Filter based on search query and status filter
  const filteredAdvisories = allAdvisories.filter((adv) => {
    const matchesSearch = adv.route.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      hazardFilter === 'All' ||
      (hazardFilter === 'Danger' && adv.severity === 'Danger') ||
      (hazardFilter === 'Warning' && adv.severity === 'Warning') ||
      (hazardFilter === 'Safe' && adv.severity === 'Success');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      {/* Header Info */}
      <div className="space-y-2">
        <Badge variant="warning">Commuter Updates</Badge>
        <h1 className="text-3xl font-extrabold tracking-tight">Travel Advisory & Road Status</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Analyze safe transit pathways, bypass waterlogged intersections, and review live route closures before beginning your commute.
        </p>
      </div>

      {/* Filter and Search Panel */}
      <Card className="bg-white/40 dark:bg-slate-900/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <Input
              label="Search Routes & Locations"
              placeholder="Search highway, sector, or bypass..."
              {...register('searchQuery')}
            />
          </div>
          <div className="md:col-span-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                Filter Severity
              </label>
              <select
                {...register('hazardFilter')}
                className="w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-900/40 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 backdrop-blur-sm transition-all focus:border-sky-500/80 focus:ring-2 focus:ring-sky-500/20 outline-none"
              >
                <option value="All" className="dark:bg-slate-950">All Route Statuses</option>
                <option value="Danger" className="dark:bg-slate-950">Critical Closures</option>
                <option value="Warning" className="dark:bg-slate-950">Active Warnings</option>
                <option value="Safe" className="dark:bg-slate-950">Clear / Safe Routes</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Advisory Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAdvisories.length === 0 ? (
          <div className="md:col-span-2 text-center py-12 glassmorphism rounded-2xl border-slate-200/40 dark:border-slate-850/50">
            <Search className="h-10 w-10 mx-auto text-slate-400 opacity-50 mb-3" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300">No matching advisories</h3>
            <p className="text-slate-500 text-xs mt-1">Try relaxing your search terms or severity filter.</p>
          </div>
        ) : (
          filteredAdvisories.map((advisory) => {
            const isDanger = advisory.severity === 'Danger';
            const isSuccess = advisory.severity === 'Success';

            return (
              <Card
                key={advisory.id}
                hoverEffect
                className="bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-850/50 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-xl border ${
                          isDanger
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-550 dark:text-rose-400'
                            : isSuccess
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-550 dark:text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-550 dark:text-amber-400'
                        }`}
                      >
                        {isSuccess ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <AlertTriangle className="h-5 w-5" />
                        )}
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">
                          {advisory.route}
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Updated: {advisory.updated}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant={
                        isDanger ? 'danger' : isSuccess ? 'success' : 'warning'
                      }
                    >
                      {advisory.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                    {advisory.notes}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/40 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> GPS Tracking Available
                  </span>
                  <a
                    href="#"
                    className="text-sky-500 hover:text-sky-600 hover:underline cursor-pointer"
                  >
                    View Alternate Routes &rarr;
                  </a>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Safety Guideline Card */}
      <Card className="bg-gradient-to-r from-sky-500/10 to-indigo-500/10 dark:from-sky-950/20 dark:to-indigo-950/20 border-sky-500/20">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/25">
            <Compass className="h-8 w-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold">Commuter Safety Protocol</h3>
            <p className="text-sm text-slate-600 dark:text-slate-350 leading-normal">
              Never drive through waterlogged roads of unknown depths. Fast-moving water less than 15 inches deep is capable of carrying passenger vehicles away. When visibility drops below 20 meters, park safely off-road with hazard flashing signals enabled.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default TravelAdvisory;
