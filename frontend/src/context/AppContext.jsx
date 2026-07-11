import React, { useEffect, useState, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { AppContext } from './AppContextObject.js';
import { getPreparednessPlan } from '../services/apiService';

export function AppProvider({ children }) {
  // Theme state: dark or light
  const [theme, setTheme] = useLocalStorage('monsoon_theme', 'dark');

  // Interactive Checklist state
  const [checklist, setChecklist] = useLocalStorage('monsoon_checklist', [
    // Pre-populate with standard template items (not mock data, but essential app configuration templates)
    { id: '1', text: 'Stock up 3 days of clean drinking water (3 liters per person/day)', category: 'Food & Water', completed: false },
    { id: '2', text: 'Prepare non-perishable canned food and manual can opener', category: 'Food & Water', completed: false },
    { id: '3', text: 'First-aid kit with antiseptic, bandages, and essential personal medicines', category: 'Medical', completed: false },
    { id: '4', text: 'Waterproof pouch for identity cards, insurance, and medical documents', category: 'Documents', completed: false },
    { id: '5', text: 'Fully charged power banks and spare batteries', category: 'Equipment', completed: false },
    { id: '6', text: 'Flashlight or LED lantern and emergency whistle', category: 'Equipment', completed: false },
  ]);

  // Citizen Alerts/Reports state (travel and weather warnings reported by users)
  const [reports, setReports] = useLocalStorage('monsoon_reports', []);

  // Alert Subscription state
  const [subscription, setSubscription] = useLocalStorage('monsoon_subscription', {
    isSubscribed: false,
    method: '',
    contact: '',
  });

  // AI Planner state
  const [plannerLoading, setPlannerLoading] = useState(false);
  const [plannerPlan, setPlannerPlan] = useState(null);
  const [plannerError, setPlannerError] = useState(null);
  const activeRequestRef = useRef(null);

  // Sync theme class to document body
  useEffect(() => {
    const root = window.document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Checklist actions
  const addChecklistItem = (text, category) => {
    const newItem = {
      id: Date.now().toString(),
      text,
      category,
      completed: false,
    };
    setChecklist((prev) => [...prev, newItem]);
  };

  const toggleChecklistItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteChecklistItem = (id) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const resetChecklist = () => {
    setChecklist([]);
  };

  // Report actions
  const addReport = (report) => {
    const newReport = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      upvotes: 0,
      ...report,
    };
    setReports((prev) => [newReport, ...prev]);
  };

  const upvoteReport = (id) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, upvotes: report.upvotes + 1 } : report
      )
    );
  };

  // Subscription actions
  const subscribe = (method, contact) => {
    setSubscription({
      isSubscribed: true,
      method,
      contact,
    });
  };

  const unsubscribe = () => {
    setSubscription({
      isSubscribed: false,
      method: '',
      contact: '',
    });
  };

  // AI Planner actions
  const generatePreparednessPlan = async ({ location, householdSize, specialRequirements }) => {
    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
    }

    setPlannerLoading(true);
    setPlannerError(null);
    setPlannerPlan(null);

    const controller = new AbortController();
    activeRequestRef.current = controller;

    try {
      const plan = await getPreparednessPlan(
        { location, householdSize, specialRequirements },
        controller.signal
      );
      setPlannerPlan(plan);
    } catch (err) {
      if (err.message !== 'Plan generation cancelled.') {
        setPlannerError(err.message || 'Failed to generate preparedness plan.');
      }
    } finally {
      if (activeRequestRef.current === controller) {
        setPlannerLoading(false);
        activeRequestRef.current = null;
      }
    }
  };

  const cancelPlannerRequest = () => {
    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
      setPlannerLoading(false);
      setPlannerError('Generation was cancelled.');
      activeRequestRef.current = null;
    }
  };

  const clearPlanner = () => {
    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
      activeRequestRef.current = null;
    }
    setPlannerPlan(null);
    setPlannerError(null);
    setPlannerLoading(false);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        checklist,
        addChecklistItem,
        toggleChecklistItem,
        deleteChecklistItem,
        resetChecklist,
        reports,
        addReport,
        upvoteReport,
        subscription,
        subscribe,
        unsubscribe,
        plannerLoading,
        plannerPlan,
        plannerError,
        generatePreparednessPlan,
        cancelPlannerRequest,
        clearPlanner,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// useApp hook is moved to src/hooks/useApp.js to optimize Fast Refresh support.
