"use client";

import React from 'react';
import { UserVideoPane } from '../components/UserVideoPane';

const PracticePage = () => {
    return (
      <div className="flex flex-row w-screen h-screen bg-jetBlack-500">
        <div className="relative w-3/4 m-4 rounded-lg bg-gradient-to-br from-vermillion-400 to-vermillion-600">
          {/* User Video Pane */}
          {/* Replace this placeholder with the UserVideoStream component */}
          <div className="absolute inset-0 m-1 bg-jetBlack-500 rounded-md">
            <UserVideoPane />
          </div>
        </div>
        <div className="relative w-1/4 m-4 rounded-lg bg-gradient-to-br from-vermillion-400 to-vermillion-600">
          {/* Feedback Pane */}
          {/* Replace this placeholder with the FeedbackDisplay component */}
          <div className="absolute inset-0 m-1 bg-jetBlack-500 rounded-md">
            {/* Content of the sub-component */}
          </div>
        </div>
      </div>
    );
}
  
 export default PracticePage;