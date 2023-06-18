import { features } from "../constants";
import styles, { layout } from "../style";
import Buttont from "./Buttont";


const Business = () =>  (
  <section id="features" className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        TEACHING PRACTICE <br className="sm:block hidden" />
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        There are two different modes: Tutoring Practice and Interview Practice.
        Interview Insight works by giving a task to the user to answer. The user then answers the prompt, and during the presentation, Hume AI evaluates the users' body language and vocal prosody, which the user can view to improve their presentation skills. 
      </p>

      <Buttont styles={`mt-10`} />
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

export default Business;