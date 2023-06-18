"use client";

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

const DynamicVideoPane = dynamic(() => import('../components/UserVideoPane').then((module) => module.default), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable server-side rendering for this component
});

const PitchPage = ({ task }) => {
  const [isComponentLoaded, setIsComponentLoaded] = useState(false);
  const taskRef = useRef("");

  useEffect(() => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    let task = searchParams.get('task');

    // console.log(url);
    // console.log(searchParams);
    // console.log('task:', task);
    
    if (task == null || task == "") {
      task = "Pitch a startup to empower users' teaching skills by using AI to simulate a learner.";
    } else {
      taskRef.current = task;
    }
  }, []);

  const taskPrefix = "You are a venture capitalist looking to invest in new firms. A team has come to you to: ";
  const taskSuffix = ". You should ask sharp questions about their market, their vision, their growth plan, and"
    + " other aspects of their idea which would be relevant in predicting future commercial success.";

  useEffect(() => {
    setIsComponentLoaded(true);
  }, []);

  return (
    <>
      {isComponentLoaded && 
      <div className="w-screen h-full bg-gradient-to-b from-jetBlack-400 to-jetBlack-600">
        <h1 className="text-center text-platinum-500 text-3xl font-bold p-4 pt-16">Task: {taskRef.current}</h1>
        <DynamicVideoPane taskPrefix={taskPrefix} task={taskRef.current} taskSuffix={taskSuffix} type="pitch" />
      </div>
      }
    </>
  );
};

export default PitchPage;