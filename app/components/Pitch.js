import { features } from "../constants";
import styles, { layout } from "../style";
import Buttonp from "./Buttonp";


const Business = () =>  (
  <section id="features" className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        PITCHING PRACTICE <br className="sm:block hidden" />
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Practice your pitching skills and public speaking.
        Make your pitch concise, compelling, and 
      </p>

      <Buttonp styles={`mt-10`} />
    </div>

    <div className="relative">
        <img src="/pitch.svg" alt="teaching" className="w-[200%] h-[200%] relative z-[5] -translate-y-48 -translate-x-10" />
        {/* gradient start */}
        <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
        <div className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40" />
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
        {/* gradient end */}
    </div>

  </section>
);

export default Business;