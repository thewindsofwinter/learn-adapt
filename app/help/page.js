"use client";

import React, { useEffect, useState } from 'react';

const help = () => {
 
  return (
    <div className="min-h-screen bg-gradient-to-b from-jetBlack-400 to-jetBlack-600 flex flex-col justify-center items-center">
    <h1 className="text-center text-5xl font-bold text-platinum-500 p-8">
      How to use Interview InSight
    </h1>
    <div className="container mx-auto px-8 py-4 text-white text-lg text-justify">
      <p className="mb-8">
        There are two different modes: Tutoring Practice and Interview Practice. Interview Insight works by
        giving a task to the user to answer. The user then answers the prompt, and during the presentation,
        Hume AI evaluates the users&apos; body language and vocal prosody, which the user can view to improve their
        presentation skills. The recording starts automatically.
      </p>
      <div className="mb-8 flex flex-col items-center" style={{ margin: '50px' }}>
        <p className="font-semibold">Once the user has finished the prompt, there are three buttons:</p>
        <ul className="list-disc pl-8" >
          <li style={{margin: '50px'}}><span className="text-green-500">Feedback:</span> Chat GPT gives the user feedback for their presentation.</li>
          <li style={{margin: '50px'}}><span className="text-green-500">Get AI Response:</span> Chat GPT responds to the user and asks follow-up questions.</li>
          <li style={{margin: '50px'}}><span className="text-green-500">Get Transcript:</span> Download a text transcript of the conversation between the user and the AI.</li>
        </ul>
      </div>
    </div>
  </div>

  );
};

export default help;