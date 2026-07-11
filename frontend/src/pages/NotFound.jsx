import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CloudOff, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="space-y-4"
      >
        <div className="relative inline-flex p-6 rounded-full bg-slate-200/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 border border-slate-300/30 dark:border-slate-800/80 mb-2">
          {/* Decorative raindrop particles */}
          <motion.div
            animate={{ y: [0, 15, 0], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
            className="absolute top-1/4 left-1/4 w-1 h-3 bg-sky-500 rounded-full"
          />
          <motion.div
            animate={{ y: [0, 18, 0], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, delay: 0.6 }}
            className="absolute top-1/3 right-1/4 w-1 h-3 bg-sky-500 rounded-full"
          />
          <CloudOff className="h-16 w-16 text-slate-500 dark:text-slate-400" />
        </div>

        <div className="space-y-2">
          <Badge variant="danger">404 Error</Badge>
          <h1 className="text-3xl font-extrabold tracking-tight">Route Swept Away</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            The page you are seeking has been disconnected or relocated due to storm hazards. Please check the URL or return to safety.
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <Button variant="primary" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Safety
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFound;
