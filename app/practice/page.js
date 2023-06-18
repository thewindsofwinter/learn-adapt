"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicVideoPane = dynamic(() => import('../components/UserVideoPane').then((module) => module.default), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable server-side rendering for this component
});

const PracticePage = () => {
  const [isComponentLoaded, setIsComponentLoaded] = useState(false);
  const task = "Go on a date with a cute engineering girl at a nice restaurant.";

  useEffect(() => {
    setIsComponentLoaded(true);
  }, []);

  return (
    <>
      {isComponentLoaded && 
      <div className="w-screen h-screen bg-jetBlack-500">
        <h1 className="text-center text-platinum-500 text-3xl font-bold p-4 pt-16">Task: {task}</h1>
        <DynamicVideoPane task={task} />
      </div>
      }
    </>
  );
};

export default PracticePage;