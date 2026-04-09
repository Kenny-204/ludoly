import { getCellPosition, getHomeCellPosition } from "../utils/board";

function Board({ children }: { children: React.ReactNode }) {
  const array = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
  ];
  const homeArray = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  ];

  return (
    <div className="h-125">
      <div className="relative mx-auto w-125 h-full mt-5 bg-white-700 border grid grid-cols-15 grid-rows-15">
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
              {val}
            </div>
          );
        })}
        {array.map((val, i) => {
          const color =
            val == 3
              ? "green"
              : val == 42
                ? "red"
                : val == 29
                  ? "blue"
                  : val == 16
                    ? "yellow"
                    : "";
          return (
            <div
              key={i}
              style={{ ...getCellPosition(val), backgroundColor: color }}
              className="border"
            >
              {val}
            </div>
          );
        })}
        {/* <div className="relative w-7 h-7  top-0.5 left-1 col-start-9 col-end-10 row-start-1 row-end-2 ">
          <div className="absolute inset-0 rounded-full bg-red-700 z-10"></div>
          {/* <div className="absolute -inset-1 rounded-full animate-spin border-2 border-yellow-400 border-dashed opacity-70 z-0"></div> */}
        {/*        </div> */}

        {/* <div
          className="h-7 w-7 rounded-full top-0.5 left-1 bg-amber-400 absolute col-start-8 col-end-9 row-start-1 row-end-2 
            shadow-[0_0_15px_rgba(0,0,0,0.4)]
            ring ring-amber-300 ring-offset-2
            "
          //  shadow-amber-200
        ></div> */}

        {/* col-start-7 col-end-10 row-start-7 row-end-10 */}
        <div
          className="bg-red-200 col-start-7 col-end-10 row-start-7 row-end-10 relative"
          id="dice-box"
        ></div>
        {children}
      </div>
    </div>
  );
}

export default Board;
