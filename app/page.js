"use client";

import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react';

export default function Home() {
  const [inputValue, setInputValue] = useState('Help a student understand AI double descent.');

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-jetBlack-400 to-jetBlack-600 text-platinum-500">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Interview InSight!</h1>
        <p className="text-lg mb-8">Explore and practice with us.</p>
        
        <div className="pb-4">
          <p>I want to... <input
              className="w-96 p-2 text-jetBlack-500 ml-4"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            /></p>
        </div>

        <div className="flex flex-row gap-x-4">
          <div className="border w-fit text-vermillion-400 hover:text-vermillion-600 border-vermillion-400 hover:border-vermillion-600 rounded p-2 m-auto">
            <Link
              href={{
                pathname: "/practice",
                state: { task: inputValue} // your data array of objects
              }}
            >
              Go to Teaching Practice
            </Link>
          </div>
          <div className="border w-fit text-vermillion-400 hover:text-vermillion-600 border-vermillion-400 hover:border-vermillion-600 rounded p-2 m-auto">
            <Link
              href={{
                pathname: "/interview",
                state: { task: inputValue} // your data array of objects
              }}
            >
              Go to Interview Preparation
            </Link>
          </div>
          <div className="border w-fit text-vermillion-400 hover:text-vermillion-600 border-vermillion-400 hover:border-vermillion-600 rounded p-2 m-auto">
            <Link
              href={{
                pathname: "/pitch",
                state: { task: inputValue} // your data array of objects
              }}
            >
              Go to Practice Pitch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}