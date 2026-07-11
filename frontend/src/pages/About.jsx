import React from 'react';
import { Shield, BookOpen, HeartHandshake, PhoneCall } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';

export function About() {
  const steps = [
    {
      title: 'Phase 1: Pre-Monsoon Preparation',
      description:
        'Secure structural anomalies in your roof, inspect drainage channels, and assemble your emergency supply kit. Confirm that first-aid kits and backup battery generators are fully functional.',
    },
    {
      title: 'Phase 2: During Severe Storms',
      description:
        'Stay indoors. Keep tracked of meteorological alert broadcasts. Disconnect electrical sockets to safeguard appliances against voltage spikes. Stay clear of flooded roads.',
    },
    {
      title: 'Phase 3: Post-Storm Rehabilitation',
      description:
        'Exercise caution against compromised electrical poles and loose cables. Sanitize accumulated stagnant water pools to deter insect vector propagation. Log community hazards on the portal.',
    },
  ];

  const emergencyContacts = [
    { name: 'National Emergency Number', contact: '112', scope: 'General Distress' },
    { name: 'National Disaster Response Force', contact: '011-23438082', scope: 'Flood & Landslides Rescue' },
    { name: 'Red Cross Society Hotline', contact: '011-23359372', scope: 'Medical Supplies & Aid' },
    { name: 'Central Ground Water Board', contact: '1800-11-0122', scope: 'Water Supply Status' },
  ];

  return (
    <div className="space-y-12 text-left max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="space-y-2">
        <Badge variant="info">Platform Information</Badge>
        <h1 className="text-3xl font-extrabold tracking-tight">Monsoon Shield Portal</h1>
        <p className="text-slate-500 dark:text-slate-400">
          A state-of-the-art cooperative disaster warning and response interface built to connect citizens with emergency resources and live routing safety indices.
        </p>
      </div>

      {/* Mission Card */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Protecting Communities Together</h2>
          <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed">
            Monsoon Shield operates on the principle of distributed civic observation. While weather radars capture top-level atmospheric parameters, localized flooding, traffic blockages, and supply shortfalls are best reported by citizens on the ground.
          </p>
          <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed">
            By consolidating data, the portal assists regional rescue operations in identifying isolated households, enabling fast supply drops and evacuation tracking.
          </p>
        </div>
        <Card className="bg-gradient-to-br from-indigo-900/10 to-sky-900/10 dark:from-indigo-950/20 dark:to-sky-950/20 border-indigo-500/20 flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="p-3 bg-indigo-500 text-white rounded-2xl w-fit">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">Distributed Security</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                Reports submitted on our platform are verified by consensus, helping rescue personnel isolate genuine hazard coordinates.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="p-3 bg-sky-500 text-white rounded-2xl w-fit">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">Resilience & Cooperation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                By maintaining active checklists, communities reduce dependency on municipal resources during major inundation periods.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Safety Protocol Guide */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-sky-500" />
          Safety Protocol Phases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <Card
              key={step.title}
              className="bg-white/40 dark:bg-slate-900/30 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-xs font-extrabold text-sky-500 dark:text-sky-400 uppercase tracking-widest">
                  Step 0{i + 1}
                </span>
                <h3 className="font-bold text-base leading-snug">{step.title}</h3>
                <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Directory */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <PhoneCall className="h-6 w-6 text-rose-500" />
          Emergency Contact Directory
        </h2>
        <Card className="bg-white/40 dark:bg-slate-900/30 overflow-hidden p-0 border-slate-200/50 dark:border-slate-800/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-850/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Department / Organization</th>
                  <th className="px-6 py-4">Hotline Number</th>
                  <th className="px-6 py-4">Assistance Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-850/40 text-sm">
                {emergencyContacts.map((contact) => (
                  <tr
                    key={contact.name}
                    className="hover:bg-slate-100/30 dark:hover:bg-slate-900/10 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-150">
                      {contact.name}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-sky-600 dark:text-sky-450">
                      {contact.contact}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {contact.scope}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default About;
