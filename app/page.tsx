"use client";

import React, { useState } from "react";
import RuleCreator from "@/components/RuleCreator";
import RuleCombiner from "@/components/RuleCombiner";
import RuleEvaluator from "@/components/RuleEvaluator";
import { Moon, Sun } from "lucide-react";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [darkMode, setDarkMode] = useState(true);

  const handleRuleCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-200 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Rule Engine</h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-400"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RuleCreator onRuleCreated={handleRuleCreated} darkMode={darkMode} />
          <RuleCombiner refreshTrigger={refreshTrigger} darkMode={darkMode} />
          <div className="md:col-span-2">
            <RuleEvaluator
              refreshTrigger={refreshTrigger}
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
