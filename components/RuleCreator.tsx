"use client"

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface RuleCreatorProps {
  onRuleCreated: () => void;
  darkMode: boolean;
}

export default function RuleCreator({ onRuleCreated, darkMode }: RuleCreatorProps) {
  const [name, setName] = useState('');
  const [ruleString, setRuleString] = useState('');

  const validateRuleString = (rule: string): boolean => {
    // This regex pattern matches the structure of valid rule strings more accurately
    const conditionPattern = /([a-zA-Z_]\w*)\s*([><=!]+|=)\s*('[^']*'|\d+)/;
    const operatorPattern = /\s+(AND|OR)\s+/;
    
    const conditions = rule.split(operatorPattern);
    
    if (conditions.length === 0) {
      return false;
    }
    
    for (let condition of conditions) {
      condition = condition.trim();
      if (condition !== 'AND' && condition !== 'OR' && !conditionPattern.test(condition)) {
        return false;
      }
    }
    
    // Check for balanced parentheses
    let parenthesesCount = 0;
    for (let char of rule) {
      if (char === '(') parenthesesCount++;
      if (char === ')') parenthesesCount--;
      if (parenthesesCount < 0) return false;
    }
    return parenthesesCount === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRuleString(ruleString)) {
      toast.error('Invalid rule string. Please check your input and try again.');
      return;
    }
    
    try {
      const response = await fetch('/api/createRule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, ruleString }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Rule created successfully!');
        setName('');
        setRuleString('');
        onRuleCreated();
      } else {
        toast.error('Error creating rule: ' + data.message);
      }
    } catch (error) {
      toast.error('Error creating rule. Please try again later.');
    }
  };

  const baseClasses = `transition-colors duration-200 ${
    darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
  }`;

  return (
    <div className={`${baseClasses} shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4`}>
      <h2 className="text-2xl font-bold mb-6">Create Rule</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" htmlFor="name">
            Rule Name
          </label>
          <input
            className={`w-full px-3 py-2 border rounded-md ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" htmlFor="ruleString">
            Rule String
          </label>
          <textarea
            className={`w-full px-3 py-2 border rounded-md ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            id="ruleString"
            rows={4}
            value={ruleString}
            onChange={(e) => setRuleString(e.target.value)}
            placeholder="e.g., age > 30 AND department = 'Sales'"
            required
          />
        </div>
        <div className="flex items-center justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            type="submit"
          >
            Create Rule
          </button>
        </div>
      </form>
    </div>
  );
} 