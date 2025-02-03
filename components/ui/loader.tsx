import { josephinBold } from "./fonts";

const Loader = () => {
  return (
    <>
      <div id={`loading ${josephinBold.className}`}>
        <div className={`dice `}>
          <div className="front">1</div>
          <div className="back">6</div>
          <div className="left">2</div>
          <div className="right">5</div>
          <div className="top">3</div>
          <div className="bottom">4</div>
        </div>
        <p className={`border border-yellow-200 p-3 rounded-sm `}>LOADING</p>
      </div>
    </>
  );
};

export default Loader;
