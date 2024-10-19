"use client"

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface RuleCombinerProps {
  refreshTrigger: number;
  darkMode: boolean;
}

export default function RuleCombiner({ refreshTrigger, darkMode }: RuleCombinerProps) {
  const [rules, setRules] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);

  const fetchRules = async () => {
    try {
      const response = await fetch('/api/getRules');
      const data = await response.json();
      if (data.success) {
        setRules(data.rules);
      } else {
        toast.error('Failed to fetch rules. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching rules:', error);
      toast.error('An error occurred while fetching rules. Please try again later.');
    }
  };

  const handleCombineRules = async () => {
    if (selectedRules.length < 2) {
      toast.error('Please select at least two rules to combine.');
      return;
    }

    try {
      const response = await fetch('/api/combineRules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleIds: selectedRules }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Rules combined successfully!');
        setSelectedRules([]);
      } else {
        toast.error('Error combining rules: ' + (data.message || 'Please try again.'));
      }
    } catch (error) {
      console.error('Error combining rules:', error);
      toast.error('An error occurred while combining rules. Please try again later.');
    }
  };

  useEffect(() => {
    fetchRules();
  }, [refreshTrigger]);

  const baseClasses = `transition-colors duration-200 ${
    darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
  }`;

  return (
    <div className={`${baseClasses} shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4`}>
      <h2 className="text-2xl font-bold mb-6">Combine Rules</h2>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Rules</label>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {rules.map((rule) => (
            <div key={rule._id} className="flex items-center">
              <input
                type="checkbox"
                id={`rule-${rule._id}`}
                className="form-checkbox h-5 w-5 text-blue-500"
                value={rule._id}
                checked={selectedRules.includes(rule._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRules([...selectedRules, rule._id]);
                  } else {
                    setSelectedRules(selectedRules.filter((id) => id !== rule._id));
                  }
                }}
              />
              <label htmlFor={`rule-${rule._id}`} className="ml-2 text-sm">
                {rule.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleCombineRules}
          disabled={selectedRules.length < 2}
        >
          Combine Rules
        </button>
      </div>
    </div>
  );
}