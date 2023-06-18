"use client";

import { features } from "../constants";
import styles, { layout } from "../style";
import Buttont from "./Buttont";
import React, { useState } from 'react';

const Teaching = () => {
  const [inputValue, setInputValue] = useState('Help a student understand machine learning double descent.');

  return (
    <section id="features" className={layout.section}>
      <div className={layout.sectionInfo}>
        <h2 className={styles.heading2}>
          TEACHING PRACTICE <br className="sm:block hidden" />
        </h2>
        <p className={`${styles.paragraph} max-w-[470px] mt-5 pb-4`}>
          There are two different modes: Tutoring Practice and Interview Practice.
          Interview Insight works by giving a task to the user to answer. The user then answers the prompt, and during the presentation, Hume AI evaluates the users&apos; body language and vocal prosody, which the user can view to improve their presentation skills.
        </p>

        <div className="pb-4">
          <p className="font-poppins font-normal text-dimWhite text-[18px]">
            I want to...{' '}
            <input
              className="w-96 text-primary p-2 text-jetBlack-500 ml-4 text-[12px]"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </p>
        </div>
        <Buttont styles={`mt-10`} inputValue={inputValue} />
      </div>

      <div className="relative">
        <img src="/teaching.svg" alt="teaching" className="w-[200%] h-[200%] relative z-[5] -translate-y-48 -translate-x-70" />
        {/* gradient start */}
        <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
        <div className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40" />
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
        {/* gradient end */}
      </div>
    </section>
  );
};

export default Teaching;