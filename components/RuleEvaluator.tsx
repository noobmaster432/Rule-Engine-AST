"use client"

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface RuleEvaluatorProps {
  refreshTrigger: number;
  darkMode: boolean;
}

export default function RuleEvaluator({ refreshTrigger, darkMode }: RuleEvaluatorProps) {
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState('');
  const [userData, setUserData] = useState('');
  const [result, setResult] = useState(null);

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

  useEffect(() => {
    fetchRules();
  }, [refreshTrigger]);

  const handleEvaluate = async () => {
    if (!selectedRule) {
      toast.error('Please select a rule to evaluate.');
      return;
    }

    if (!userData) {
      toast.error('Please enter user data to evaluate.');
      return;
    }

    try {
      const userDataObj = JSON.parse(userData);
      const response = await fetch('/api/evaluateRule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleId: selectedRule, data: userDataObj }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.result);
        toast.success('Rule evaluated successfully!');
      } else {
        toast.error('Error evaluating rule: ' + (data.message || 'Please try again.'));
      }
    } catch (error) {
      console.error('Error evaluating rule:', error);
      if (error instanceof SyntaxError) {
        toast.error('Invalid JSON data. Please check your input and try again.');
      } else {
        toast.error('An error occurred while evaluating the rule. Please try again later.');
      }
    }
  };

  const baseClasses = `transition-colors duration-200 ${
    darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
  }`;

  return (
    <div className={`${baseClasses} shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4`}>
      <h2 className="text-2xl font-bold mb-6">Evaluate Rule</h2>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" htmlFor="ruleSelect">
          Select Rule
        </label>
        <select
          id="ruleSelect"
          className={`w-full px-3 py-2 border rounded-md ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          value={selectedRule}
          onChange={(e) => setSelectedRule(e.target.value)}
        >
          <option value="">Select a rule</option>
          {rules.map((rule) => (
            <option key={rule._id} value={rule._id}>
              {rule.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" htmlFor="userData">
          User Data (JSON)
        </label>
        <textarea
          id="userData"
          className={`w-full px-3 py-2 border rounded-md ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          rows={4}
          value={userData}
          onChange={(e) => setUserData(e.target.value)}
          placeholder='{"age": 35, "department": "Sales", "salary": 60000, "experience": 3}'
        />
      </div>
      <div className="flex items-center justify-end mb-6">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleEvaluate}
          disabled={!selectedRule || !userData}
        >
          Evaluate
        </button>
      </div>
      {result !== null && (
        <div className="mt-6 p-4 rounded-md bg-opacity-20 backdrop-filter backdrop-blur-lg">
          <h3 className="text-lg font-bold mb-2">Result:</h3>
          <p className={`text-2xl font-bold ${result ? 'text-green-500' : 'text-red-500'}`}>
            {result ? 'User Eligible' : 'User Not Eligible'}
          </p>
        </div>
      )}
    </div>
  );
}