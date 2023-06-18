"use client";

import React from 'react';
import styles from '../style';
const Hero = () => {
  return (
    <section id="home" className={`flex md:flex-row flex-col ${styles.paddingY}`}>
      <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}>
      <div className="flex flex-row w-full justify-center">
        <div className= "flex flex-col flex-wrap justify-between items-left w-full">
          <h1 className="relative font-poppins font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100px] leading-[75px]">
            Inter
            <span className="text-gradient">View</span> <br className="sm:block hidden" /> {" "}
            In<span className="text-gradient">Sight</span>
          </h1>
          <p className={`${styles.paragraph} relative w-[470px] mt-5 text-white absolute`}>
            Get IN to your dream jobs with our service that provides you new SIGHT to VIEW your future. 
          </p>
        </div>
        <div className="relative">
          <img src="/mic.svg" alt="mic" className="w-[200%] h-[200%] relative z-[5] -translate-y-48" />
          {/* gradient start */}
          <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
          <div className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40" />
          <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
          {/* gradient end */}
        </div>
      </div>
      </div>
    </section>
  )
}

export default Hero