"use client";

import React, { useState } from 'react';
import Buttoni from './Buttoni';
import styles, { layout } from '../style';

const Interview = () => {
  const [inputValue, setInputValue] = useState('Explain how to efficiently merge k sorted linked lists.');

  return (
    <section id="product" className={layout.sectionReverse}>
      <div className={layout.sectionImgReverse}>
        <img src="/interview.svg" alt="testimony" className="w-[90%] h-[90%] relative z-[5]" />
        {/* gradient start */}
        <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
        <div className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40" />
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
        {/* gradient end */}
      </div>

      <div className={layout.sectionInfo}>
        <h2 className={styles.heading2}>
          INTERVIEW PRACTICE <br className="sm:block hidden" />
        </h2>
        <p className={`${styles.paragraph} max-w-[470px] mt-5 pb-4`}>
          Our service converts your voice response to text and AI analyzes your responses and gives follow-up questions just like you would get at the job interview.
          After your interview, AI will give feedback on your responses.
          You can also save your entire conversation in a txt file.
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
        <Buttoni styles={`mt-10`} inputValue={inputValue} />
      </div>
    </section>
  );
};

export default Interview;
