"use client";

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

const DynamicVideoPane = dynamic(() => import('../components/UserVideoPane').then((module) => module.default), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable server-side rendering for this component
});

const InterviewPage = () => {
  const taskRef = useRef("");

  useEffect(() => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    let task = searchParams.get('task');

    // console.log('task:', task);
    
    if (task == null || task === "") {
      taskRef.current = "Explain how to efficiently merge k sorted linked lists.";
    } else {
      taskRef.current = task;
    }
  }, []);

  const [isComponentLoaded, setIsComponentLoaded] = useState(false);

  const taskPrefix = "You are a technical lead in an interview, where the coding question is: ";
  const taskSuffix = ". You should delve deep into technical details of their solution, and give constraints when asked. Your goal is to evaluate"
    + " whether hiring them would be beneficial to the company.";

  useEffect(() => {
    setIsComponentLoaded(true);
  }, []);

  return (
    <>
      {isComponentLoaded && 
      <div className="w-screen h-full bg-gradient-to-b from-jetBlack-400 to-jetBlack-600">
        <h1 className="text-center text-platinum-500 text-3xl font-bold p-4 pt-16">Task: {taskRef.current}</h1>
        <DynamicVideoPane taskPrefix={taskPrefix} task={taskRef.current} taskSuffix={taskSuffix} type="interview" />
      </div>
      }
    </>
  );
};

export default InterviewPage;