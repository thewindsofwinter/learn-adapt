"use client";

import Image from 'next/image'
import React, { useState } from 'react';
import Link from 'next/link';
import styles from "./style";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Concept from "./components/Concept";
import Emotion from "./components/Emotion";
import Interview from "./components/Interview";
import Teaching from "./components/Teaching";
import Pitch from "./components/Pitch";
import Testimony from "./components/Testimony";


export default function Home() {
  const [inputValue, setInputValue] = useState('Help a student understand AI double descent.');

  return (
    <div className="bg-primary w-full overflow-hidden">
    <div className={`${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Navbar />
      </div>
    </div>

      <div className={`bg-primary ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Hero />
        </div>
      </div>
    
      <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Concept />
          <Teaching />
          <Interview />
          <Pitch />
          <Emotion />
          <Testimony />
        </div>
      </div>
    </div>
  );
}
