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
    let task = searchParams.get('task');

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
      <div className="bg-black-gradient font-poppins text-white w-screen h-full bg-gradient-to-b from-jetBlack-400 to-jetBlack-600">
        <h1 className="text-center text-platinum-500 text-3xl font-bold p-4 pt-16">Task: {taskRef.current}</h1>
        <DynamicVideoPane taskPrefix={taskPrefix} task={taskRef.current} taskSuffix={taskSuffix} />
        {/* gradient start */}
        {/* <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" /> */}
        {/* <div className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40" /> */}
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
        {/* gradient end */}
      </div>
      }
    </>
  );
};

export default PracticePage;