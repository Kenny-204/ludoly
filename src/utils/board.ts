export function getCellPosition(index: number) {
  if (index >= 0 && index <= 5) {
    return {
      gridColumnStart: 7,
      gridColumnEnd: 8,
      gridRowStart: 1 + index,
      gridRowEnd: 2 + index,
    };
  }
  if (index >= 6 && index <= 10) {
    const offset = index - 6;

    return {
      gridColumnStart: 6 - offset,
      gridColumnEnd: 7 - offset,
      gridRowStart: 7,
      gridRowEnd: 8,
    };
  }

  if (index >= 11 && index <= 13) {
    const offset = index - 12;
    return {
      gridColumnStart: 1,
      gridColumnEnd: 2,
      gridRowStart: 8 + offset,
      gridRowEnd: 9 + offset,
    };
  }

  if (index >= 14 && index <= 18) {
    const offset = index - 14;
    return {
      gridColumnStart: 2 + offset,
      gridColumnEnd: 3 + offset,
      gridRowStart: 9,
      gridRowEnd: 10,
    };
  }
  if (index >= 19 && index <= 23) {
    const offset = index - 19;
    return {
      gridColumnStart: 7,
      gridColumnEnd: 8,
      gridRowStart: 10 + offset,
      gridRowEnd: 11 + offset,
    };
  }

  if (index >= 24 && index <= 26) {
    const offset = index - 25;
    return {
      gridColumnStart: 8 + offset,
      gridColumnEnd: 9 + offset,
      gridRowStart: 15,
      gridRowEnd: 16,
    };
  }
  if (index >= 27 && index <= 31) {
    const offset = index - 27;
    return {
      gridColumnStart: 9,
      gridColumnEnd: 10,
      gridRowStart: 14 - offset,
      gridRowEnd: 15 - offset,
    };
  }
  if (index >= 28 && index <= 36) {
    const offset = index - 28;
    return {
      gridColumnStart: 6 + offset,
      gridColumnEnd: 7 + offset,
      gridRowStart: 9,
      gridRowEnd: 10,
    };
  }

  if (index >= 37 && index <= 39) {
    const offset = index - 37;
    return {
      gridColumnStart: 15,
      gridColumnEnd: 16,
      gridRowStart: 9 - offset,
      gridRowEnd: 10 - offset,
    };
  }
  if (index >= 40 && index <= 44) {
    const offset = index - 40;
    return {
      gridColumnStart: 14 - offset,
      gridColumnEnd: 15 - offset,
      gridRowStart: 7,
      gridRowEnd: 8,
    };
  }
  if (index >= 45 && index <= 50) {
    const offset = index - 45;
    return {
      gridColumnStart: 9,
      gridColumnEnd: 10,
      gridRowStart: 6 - offset,
      gridRowEnd: 7 - offset,
    };
  }
  if (index == 51) {
    return {
      gridColumnStart: 8,
      gridColumnEnd: 9,
      gridRowStart: 1,
      gridRowEnd: 2,
    };
  }
  return {
    gridColumnStart: 1,
    gridColumnEnd: 2,
    gridRowStart: 1,
    gridRowEnd: 2,
  };
  // if (index >= 6 && index <= 12) {
  //   const offset = index - 6;
  //   return `border  col-start-${6 - offset} col-end-${8 - offset} row-start-${7} row-end-${8} `;
  // }
}

export function getHomeCellPosition(index: number) {
  if (index >= 0 && index <= 4) {
    return {
      gridRowStart: 2 + index,
      gridRowEnd: 3 + index,
      gridColumnStart: 8,
      gridColumnEnd: 9,
      backgroundColor: "green",
    };
  }
  if (index >= 5 && index <= 9) {
    const offset = index - 5;
    return {
      gridRowStart: 8,
      gridRowEnd: 9,
      gridColumnStart: 2 + offset,
      gridColumnEnd: 3 + offset,
      backgroundColor: "red",
    };
  }
  if (index >= 10 && index <= 14) {
    const offset = index - 10;
    return {
      gridRowStart: 14 - offset,
      gridRowEnd: 15 - offset,
      gridColumnStart: 8,
      gridColumnEnd: 9,
      backgroundColor: "blue",
    };
  }
  if (index >= 15 && index <= 19) {
    const offset = index - 15;
    return {
      gridRowStart: 8,
      gridRowEnd: 9,
      gridColumnStart: 14 - offset,
      gridColumnEnd: 15 - offset,
      backgroundColor: "yellow",
    };
  }

}
