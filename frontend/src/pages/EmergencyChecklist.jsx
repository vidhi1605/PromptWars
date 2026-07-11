import React from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Trash2, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';

export function EmergencyChecklist() {
  const {
    checklist,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
    resetChecklist,
  } = useApp();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      text: '',
      category: 'Food & Water',
    },
  });

  // Calculate metrics
  const total = checklist.length;
  const completed = checklist.filter((item) => item.completed).length;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Group checklist items by category
  const categories = ['Food & Water', 'Medical', 'Documents', 'Equipment', 'Other'];

  const onSubmit = (data) => {
    addChecklistItem(data.text, data.category);
    reset({ text: '', category: data.category }); // Reset text, keep active category selected
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-left">
      {/* Header Info */}
      <div className="space-y-2">
        <Badge variant="success">Preparation Center</Badge>
        <h1 className="text-3xl font-extrabold tracking-tight">Emergency Supply Checklist</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Make sure your household has critical supplies gathered in an accessible, waterproof container before monsoon storms disrupt utility networks.
        </p>
      </div>

      {/* Progress Card */}
      <Card className="bg-white/40 dark:bg-slate-900/30">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-500">
                Preparedness Checklist Rating
              </p>
              <h2 className="text-3xl font-black mt-1">
                {progressPercent}% Complete
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {completed} of {total} essentials secured
              </span>
              <Button
                variant="glass"
                className="p-2 border border-slate-200/50 dark:border-slate-800/80 rounded-xl"
                onClick={resetChecklist}
                title="Reset checklist"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="w-full h-3 bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-sky-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>

          {progressPercent === 100 && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
              <CheckSquare className="h-4 w-4" /> Excellent! Your primary emergency kit is fully prepared.
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form and Quick Add Column */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-white/40 dark:bg-slate-900/30">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-sky-500" />
              Add Custom Item
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Supply Name"
                placeholder="e.g. Spare medication..."
                error={errors.text}
                {...register('text', {
                  required: 'Please input supply name',
                  maxLength: { value: 60, message: 'Max 60 characters' },
                })}
              />

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                  Category
                </label>
                <select
                  {...register('category')}
                  className="w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-900/40 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 backdrop-blur-sm transition-all focus:border-sky-500/80 focus:ring-2 focus:ring-sky-500/20 outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="dark:bg-slate-950">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" variant="primary" className="w-full">
                Add to Checklist
              </Button>
            </form>
          </Card>

          <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 flex gap-3 text-xs text-amber-800 dark:text-amber-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <p className="font-bold">Pro Tip</p>
              <p className="mt-0.5 leading-normal">
                Check supply expiration dates every six months. Keep physical copies of personal documentation in waterproof bags alongside these supplies.
              </p>
            </div>
          </div>
        </div>

        {/* Checklist View Column */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-white/40 dark:bg-slate-900/30">
            <div className="divide-y divide-slate-200/50 dark:divide-slate-800/40 space-y-4">
              {categories.map((category) => {
                const categoryItems = checklist.filter((item) => item.category === category);

                return (
                  <div key={category} className="pt-4 first:pt-0">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                      {category}
                    </h3>

                    {categoryItems.length === 0 ? (
                      <p className="text-xs text-slate-400 dark:text-slate-655 italic py-1">
                        No active items in this category.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        <AnimatePresence initial={false}>
                          {categoryItems.map((item) => (
                            <motion.li
                              key={item.id}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-850/50 hover:bg-white dark:hover:bg-slate-900/60 transition-colors"
                            >
                              <div className="flex items-center gap-3 select-none flex-grow cursor-pointer" onClick={() => toggleChecklistItem(item.id)}>
                                <div
                                  className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                                    item.completed
                                      ? 'bg-sky-500 border-sky-500 text-white'
                                      : 'border-slate-300 dark:border-slate-700 hover:border-sky-500'
                                  }`}
                                >
                                  {item.completed && (
                                    <svg
                                      className="h-3.5 w-3.5 fill-current"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                    </svg>
                                  )}
                                </div>
                                <span
                                  className={`text-sm transition-all ${
                                    item.completed
                                      ? 'line-through text-slate-400 dark:text-slate-500'
                                      : 'text-slate-800 dark:text-slate-200 font-medium'
                                  }`}
                                >
                                  {item.text}
                                </span>
                              </div>

                              <button
                                onClick={() => deleteChecklistItem(item.id)}
                                className="text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                aria-label={`Delete ${item.text}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default EmergencyChecklist;
