// import { apple, bill, google } from "../assets";
import styles, { layout } from "../style";

const Emotion = () => (
  <section id="product" className={layout.sectionReverse}>
    <div className={layout.sectionImgReverse}>
      <img src="/emotion.svg" alt="testimony" className="w-[90%] h-[90%] relative z-[5]" />
      {/* gradient start */}
      <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
      <div className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40" />
      <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
      {/* gradient end */}
    </div>

    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        Analysis on Your Emotions <br className="sm:block hidden" /> For Each Question
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Nervous? Bored? Anxious? Joyful? We can detect your emotions live and provide feedback on how you react.
        See how you react for each question and how others perceive you!
      </p>

      {/* <div className="flex flex-row flex-wrap sm:mt-10 mt-6">
        <img src={apple} alt="google_play" className="w-[128.86px] h-[42.05px] object-contain mr-5 cursor-pointer" />
        <img src={google} alt="google_play" className="w-[144.17px] h-[43.08px] object-contain cursor-pointer" />
      </div> */}
    </div>
  </section>
);

export default Emotion;