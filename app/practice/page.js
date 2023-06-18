"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicVideoPane = dynamic(() => import('../components/UserVideoPane').then((module) => module.default), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable server-side rendering for this component
});

const PracticePage = () => {
  const [isComponentLoaded, setIsComponentLoaded] = useState(false);

  useEffect(() => {
    setIsComponentLoaded(true);
  }, []);

  return (
    <>
      {isComponentLoaded && <DynamicVideoPane />}
    </>
  );
};

export default PracticePage;