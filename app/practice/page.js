"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicVideoPane = dynamic(() => import('../components/UserVideoPane').then((module) => module.default), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable server-side rendering for this component
});

const PracticePage = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isComponentLoaded, setIsComponentLoaded] = useState(false);
  const tasks = [
    "Help a student understand double descent and why it is important in Machine Learning.",
    // "Help a student prepare for a job interview. You must ask three questions. The first question to ask is tell me about yourself. After each question"
    // + "provide feedback on the student's response with how they could have improved and what they did well in.",
  ];

  const handleTaskSelection = (task) => {
    setSelectedTask(task);
    setIsComponentLoaded(true);
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-jetBlack-400 to-jetBlack-600 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        {tasks.map((task, index) => (
          <button
            key={index}
            className={`bg-transparent border border-white rounded-lg px-6 py-3 mt-4 text-white text-sm hover:bg-white hover:text-black focus:outline-none ${selectedTask === task ? 'bg-white text-black' : ''}`}
            onClick={() => handleTaskSelection(task)}
          >
            {task}
          </button>
        ))}
      </div>
      {selectedTask && <DynamicVideoPane task={selectedTask} />}
    </div>
  );
};

export default PracticePage;