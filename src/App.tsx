import { useEffect, useState } from "react";
import { getCellPosition, getHomeCellPosition } from "./utils/board";
import DiceBox from "@3d-dice/dice-box";

function App() {
  const [diceBox, setDiceBox] = useState(null);
  const array = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
  ];
  const homeArray = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  ];

  useEffect(function () {
    const initDice = async () => {
      const box = new DiceBox({
        assetPath: "/assets/",
        container: "#dice-box",
        scale:9,
        themeColor:'#ffffff',
        offScreen: false,
      });
      await box.init();
      setDiceBox(box);
    };
    initDice();
  }, []);

  async function handleRoll() {
    if (diceBox) {
      diceBox.roll("2d6");
    }
  }

  return (
    <>
      <div className="h-125">
        <div className="relative mx-auto w-[45%] h-full mt-5 bg-white-700 border grid grid-cols-15 grid-rows-15">
          <div className="bg-[red] col-start-1 col-end-7 row-start-1 row-end-7 grid grid-cols-6 grid-rows-6">
            <div className="bg-white col-start-2 col-end-6 row-start-2 row-end-6 relative">
              <div className=" absolute top-3 left-3 bg-white w-11 h-11 rounded-full border-[red] border-5  "></div>
              <div className=" absolute top-3 right-3 bg-white w-11 h-11 rounded-full border-[red] border-5 "></div>
              <div className=" absolute bottom-3 left-3 bg-white w-11 h-11 rounded-full border-[red] border-5 "></div>
              <div className=" absolute bottom-3 right-3 bg-white w-11 h-11 rounded-full border-[red] border-5  "></div>
            </div>
          </div>
          <div className="bg-[green] col-start-10 col-end-17 row-start-1 row-end-7 grid grid-cols-6 grid-rows-6">
            <div className=" bg-white col-start-2 col-end-6 row-start-2 row-end-6 relative">
              <div className=" absolute top-3 left-3 bg-white w-11 h-11 rounded-full border-[green] border-5  "></div>
              <div className=" absolute top-3 right-3 bg-white w-11 h-11 rounded-full border-[green] border-5 "></div>
              <div className=" absolute bottom-3 left-3 bg-white w-11 h-11 rounded-full border-[green] border-5 "></div>
              <div className=" absolute bottom-3 right-3 bg-white w-11 h-11 rounded-full border-[green] border-5  "></div>
            </div>
          </div>
          <div className="bg-[blue] col-start-1 col-end-7 row-start-10 row-end-17 grid grid-cols-6 grid-rows-6">
            <div className=" bg-white col-start-2 col-end-6 row-start-2 row-end-6 relative">
              <div className=" absolute top-3 left-3 bg-white w-11 h-11 rounded-full border-[blue] border-5  "></div>
              <div className=" absolute top-3 right-3 bg-white w-11 h-11 rounded-full border-[blue] border-5 "></div>
              <div className=" absolute bottom-3 left-3 bg-white w-11 h-11 rounded-full border-[blue] border-5 "></div>
              <div className=" absolute bottom-3 right-3 bg-white w-11 h-11 rounded-full border-[blue] border-5  "></div>
            </div>
          </div>
          <div className="bg-[yellow] col-start-10 col-end-17 row-start-10 row-end-17 grid grid-cols-6 grid-rows-6">
            <div className=" bg-white col-start-2 col-end-6 row-start-2 row-end-6 relative">
              <div className=" absolute top-3 left-3 bg-white w-11 h-11 rounded-full border-[yellow] border-5  "></div>
              <div className=" absolute top-3 right-3 bg-white w-11 h-11 rounded-full border-[yellow] border-5 "></div>
              <div className=" absolute bottom-3 left-3 bg-white w-11 h-11 rounded-full border-[yellow] border-5 "></div>
              <div className=" absolute bottom-3 right-3 bg-white w-11 h-11 rounded-full border-[yellow] border-5  "></div>
            </div>
          </div>
          {homeArray.map((val, i) => {
            return (
              <div key={i} style={getHomeCellPosition(val)} className="border">
                {/* {val} */}
              </div>
            );
          })}
          {array.map((val, i) => {
            const color =
              val == 49
                ? "green"
                : val == 10
                  ? "red"
                  : val == 23
                    ? "blue"
                    : val == 36
                      ? "yellow"
                      : "";
            return (
              <div
                key={i}
                style={{ ...getCellPosition(val), backgroundColor: color }}
                className="border"
              >
                {/* {val} */}
              </div>
            );
          })}

          <div
            className="h-7 w-7 rounded-full top-0.5 left-1 bg-amber-300 absolute col-start-8 col-end-9 row-start-1 row-end-2 
            shadow-[0_0_15px_rgba(0,0,0,0.4)]
            "
            //  shadow-amber-200
          ></div>

          {/* col-start-7 col-end-10 row-start-7 row-end-10 */}
          <div
            className="bg-red-200 col-start-7 col-end-10 row-start-7 row-end-10 relative"
            id="dice-box"
          ></div>
        </div>
        <button onClick={handleRoll} className="w-5 h-5 border">
          roll
        </button>
      </div>
      {/* <div className="h-125">
        <div className="relative mx-auto w-[50%] h-full mt-5 bg-white-700 border">
          <div className="w-[40%] h-[40%] bg-red-500 absolute top-0 left-0"></div>
          <div className="w-[40%] h-[40%] bg-blue-500 absolute top-0 right-0"></div>
          <div className="w-[40%] h-[40%] bg-green-500 absolute bottom-0 left-0"></div>
          <div className="w-[40%] h-[40%] bg-yellow-500 absolute bottom-0 right-0"></div>
        </div>
      </div> */}
    </>
  );
}

export default App;
