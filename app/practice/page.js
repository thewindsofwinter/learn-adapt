"use client";

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

const DynamicVideoPane = dynamic(() => import('../components/UserVideoPane').then((module) => module.default), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable server-side rendering for this component
});

const PracticePage = () => {
  const [isComponentLoaded, setIsComponentLoaded] = useState(false);
  const taskRef = useRef("");

  useEffect(() => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const task = searchParams.get('task');

    // console.log('task:', task);
    
    if (task == null || task === "") {
      taskRef.current = "Describe the theoretical foundations of double descent and its importance in machine learning.";
    } else {
      taskRef.current = task;
    }
  }, []);

  const taskPrefix = "You are a student. A teacher has been tasked with the following: ";
  const taskSuffix = ". You should ask questions and act confused. Previous conversation: ";

  useEffect(() => {
    setIsComponentLoaded(true);
  }, []);

  return (
    <>
      {isComponentLoaded && 
      <div className="w-screen h-full bg-gradient-to-b from-jetBlack-400 to-jetBlack-600">
        <h1 className="text-center text-platinum-500 text-3xl font-bold p-4 pt-16">Task: {taskRef.current}</h1>
        <DynamicVideoPane taskPrefix={taskPrefix} task={taskRef.current} taskSuffix={taskSuffix} />
      </div>
      }
    </>
  );
};

export default PracticePage;