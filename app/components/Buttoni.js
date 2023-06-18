import React from "react";
import Link from "next/link"

const Button = ({ styles, inputValue }) => (
  <button type="button" className={`py-4 px-6 font-poppins font-medium text-[18px] text-primary bg-blue-gradient rounded-[10px] outline-none ${styles}`}>
    <Link
      href={{
        pathname: "/interview",
        query: { task: inputValue },
      }}
    >
      Start Practicing Interviewing
    </Link>
  </button>
);

export default Button;