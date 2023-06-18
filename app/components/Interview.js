// import { apple, bill, google } from "../assets";
import styles, { layout } from "../style";
import Buttoni from "./Buttoni";

const Interview = () => (
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
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Our service converts your voice response to text and AI analyzes your responses and gives follow-up questions just like you would get at the job interview.
        After your interview, AI will give feedback on your responses.
        You can also save your entire conversation in a txt file.
      </p>

      {/* <div className="flex flex-row flex-wrap sm:mt-10 mt-6">
        <img src={apple} alt="google_play" className="w-[128.86px] h-[42.05px] object-contain mr-5 cursor-pointer" />
        <img src={google} alt="google_play" className="w-[144.17px] h-[43.08px] object-contain cursor-pointer" />
      </div> */}
        <Buttoni styles={`mt-10`} />

    </div>
  </section>
);

export default Interview;