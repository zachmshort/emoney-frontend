import { josephinBold } from "../ui/fonts";

const DiceLoader = () => {
  return (
    <div id="loading" className={`${josephinBold.className}`}>
      <div className="dice">
        <div className="front">1</div>
        <div className="back">6</div>
        <div className="left">2</div>
        <div className="right">5</div>
        <div className="top">3</div>
        <div className="bottom">4</div>
      </div>
      <p
        className={`color !text-xl border-yellow-100 border h-12 w-[200px] justify-center flex items-center rounded-sm`}
      >
        LOADING
      </p>
    </div>
  );
};
export default DiceLoader;
