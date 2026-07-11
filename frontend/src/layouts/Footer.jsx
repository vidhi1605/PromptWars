import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, PhoneCall, HelpCircle, FileText } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const hotlines = [
    { label: 'Disaster Management', number: '108 / 112' },
    { label: 'NDRF Control Room', number: '011-23438082' },
    { label: 'Meteorological Dept.', number: '1800-180-1717' },
    { label: 'Ambulance & Medical', number: '102' },
  ];

  return (
    <footer className="w-full border-t border-slate-200/50 dark:border-slate-800/30 bg-white/40 dark:bg-slate-950/20 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div className="flex flex-col gap-3 text-left">
            <div className="flex items-center gap-2 font-bold text-slate-850 dark:text-slate-100">
              <Shield className="h-5 w-5 text-sky-500" />
              <span>Monsoon Shield</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Empowering citizens with real-time weather analytics, collaborative flood warning feeds, and preparation guides during monsoon seasons.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3 text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Citizen Tools
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <NavLink to="/alerts" className="hover:text-sky-500 transition-colors">
                  Weather Feeds & Alerts
                </NavLink>
              </li>
              <li>
                <NavLink to="/checklist" className="hover:text-sky-500 transition-colors">
                  Emergency Supply Checklists
                </NavLink>
              </li>
              <li>
                <NavLink to="/travel" className="hover:text-sky-500 transition-colors">
                  Road Closure Reports
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Emergency Hotlines Column */}
          <div className="flex flex-col gap-3 text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-500 flex items-center gap-1.5">
              <PhoneCall className="h-4 w-4 text-rose-500" />
              Emergency Hotlines
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {hotlines.map((hotline) => (
                <div
                  key={hotline.label}
                  className="p-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 text-xs"
                >
                  <p className="text-slate-400 dark:text-slate-550 font-medium">{hotline.label}</p>
                  <p className="text-slate-800 dark:text-slate-200 font-bold mt-0.5">{hotline.number}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-800/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {currentYear} Monsoon Shield. Built for civic resilience.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline flex items-center gap-1">
              <FileText className="h-3 w-3" /> Privacy Policy
            </a>
            <a href="#" className="hover:underline flex items-center gap-1">
              <HelpCircle className="h-3 w-3" /> FAQs
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
