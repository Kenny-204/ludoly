import type { CSSProperties } from "react";

export function getCellPosition(index: number) {
  // So like what happened is i mistakenly arranged it in the wrong direction so i was lazy to rearrange it so i just reversed the direction if you're kind enough help me proper it
  if (index == 100) {
    return {
      gridColumnStart: 8,
      gridColumnEnd: 9,
      gridRowStart: 8,
      gridRowEnd: 9,
    };
  }
  const reversedIndex = index === 0 ? 0 : 52 - index;

  if (reversedIndex >= 0 && reversedIndex <= 5) {
    return {
      gridColumnStart: 7,
      gridColumnEnd: 8,
      gridRowStart: 1 + reversedIndex,
      gridRowEnd: 2 + reversedIndex,
    };
  }
  if (reversedIndex >= 6 && reversedIndex <= 10) {
    const offset = reversedIndex - 6;

    return {
      gridColumnStart: 6 - offset,
      gridColumnEnd: 7 - offset,
      gridRowStart: 7,
      gridRowEnd: 8,
    };
  }

  if (reversedIndex >= 11 && reversedIndex <= 13) {
    const offset = reversedIndex - 12;
    return {
      gridColumnStart: 1,
      gridColumnEnd: 2,
      gridRowStart: 8 + offset,
      gridRowEnd: 9 + offset,
    };
  }

  if (reversedIndex >= 14 && reversedIndex <= 18) {
    const offset = reversedIndex - 14;
    return {
      gridColumnStart: 2 + offset,
      gridColumnEnd: 3 + offset,
      gridRowStart: 9,
      gridRowEnd: 10,
    };
  }
  if (reversedIndex >= 19 && reversedIndex <= 23) {
    const offset = reversedIndex - 19;
    return {
      gridColumnStart: 7,
      gridColumnEnd: 8,
      gridRowStart: 10 + offset,
      gridRowEnd: 11 + offset,
    };
  }

  if (reversedIndex >= 24 && reversedIndex <= 26) {
    const offset = reversedIndex - 25;
    return {
      gridColumnStart: 8 + offset,
      gridColumnEnd: 9 + offset,
      gridRowStart: 15,
      gridRowEnd: 16,
    };
  }
  if (reversedIndex >= 27 && reversedIndex <= 31) {
    const offset = reversedIndex - 27;
    return {
      gridColumnStart: 9,
      gridColumnEnd: 10,
      gridRowStart: 14 - offset,
      gridRowEnd: 15 - offset,
    };
  }
  if (reversedIndex >= 32 && reversedIndex <= 36) {
    const offset = reversedIndex - 28;
    return {
      gridColumnStart: 6 + offset,
      gridColumnEnd: 7 + offset,
      gridRowStart: 9,
      gridRowEnd: 10,
    };
  }

  if (reversedIndex >= 37 && reversedIndex <= 39) {
    const offset = reversedIndex - 37;
    return {
      gridColumnStart: 15,
      gridColumnEnd: 16,
      gridRowStart: 9 - offset,
      gridRowEnd: 10 - offset,
    };
  }
  if (reversedIndex >= 40 && reversedIndex <= 44) {
    const offset = reversedIndex - 40;
    return {
      gridColumnStart: 14 - offset,
      gridColumnEnd: 15 - offset,
      gridRowStart: 7,
      gridRowEnd: 8,
    };
  }
  if (reversedIndex >= 45 && reversedIndex <= 50) {
    const offset = reversedIndex - 45;
    return {
      gridColumnStart: 9,
      gridColumnEnd: 10,
      gridRowStart: 6 - offset,
      gridRowEnd: 7 - offset,
    };
  }
  if (reversedIndex == 51) {
    return {
      gridColumnStart: 8,
      gridColumnEnd: 9,
      gridRowStart: 1,
      gridRowEnd: 2,
    };
  }

  // if (reversedIndex >= 52 && reversedIndex <= 56) {
  //   return {
  //     gridRowStart: 2 + reversedIndex - 52,
  //     gridRowEnd: 3 + reversedIndex - 52,
  //     gridColumnStart: 8,
  //     gridColumnEnd: 9,
  //     backgroundColor: "green",
  //   };
  // }
  // if (index >= 6 && index <= 12) {
  //   const offset = index - 6;
  //   return `border  col-start-${6 - offset} col-end-${8 - offset} row-start-${7} row-end-${8} `;
  // }
}

export function getHomeCellPosition(index: number) {
  if (index >= 2 && index <= 6) {
    const offset = index - 2;
    return {
      gridRowStart: 2 + offset,
      gridRowEnd: 3 + offset,
      gridColumnStart: 8,
      gridColumnEnd: 9,
      backgroundColor: "green",
    };
  }
  if (index >= 7 && index <= 11) {
    const offset = index - 7;
    return {
      gridRowStart: 8,
      gridRowEnd: 9,
      gridColumnStart: 2 + offset,
      gridColumnEnd: 3 + offset,
      backgroundColor: "red",
    };
  }
  if (index >= 12 && index <= 16) {
    const offset = index - 12;
    return {
      gridRowStart: 14 - offset,
      gridRowEnd: 15 - offset,
      gridColumnStart: 8,
      gridColumnEnd: 9,
      backgroundColor: "blue",
    };
  }
  if (index >= 17 && index <= 21) {
    const offset = index - 17;
    return {
      gridRowStart: 8,
      gridRowEnd: 9,
      gridColumnStart: 14 - offset,
      gridColumnEnd: 15 - offset,
      backgroundColor: "yellow",
    };
  }
}

export function getInitialPosition(index: number) {
  let style: CSSProperties = {
    position: "absolute",
    top: "1.25rem",
    left: "1.25rem",
  };

  if ([1, 2, 5, 6].includes(index)) {
    style = { ...style, gridRowStart: 2, gridRowEnd: 3 };
  }
  if ([3, 4, 7, 8].includes(index)) {
    style = { ...style, gridRowStart: 4, gridRowEnd: 5 };
  }
  if ([9, 10, 13, 14].includes(index)) {
    style = { ...style, gridRowStart: 11, gridRowEnd: 12 };
  }
  if ([11, 12, 15, 16].includes(index)) {
    style = { ...style, gridRowStart: 13, gridRowEnd: 14 };
  }
  if ([1, 3, 9, 11].includes(index)) {
    style = { ...style, gridColumnStart: 2, gridColumnEnd: 3 };
  }
  if ([2, 4, 10, 12].includes(index)) {
    style = { ...style, gridColumnStart: 4, gridColumnEnd: 5 };
  }
  if ([5, 7, 13, 15].includes(index)) {
    style = { ...style, gridColumnStart: 11, gridColumnEnd: 12 };
  }
  if ([6, 8, 14, 16].includes(index)) {
    style = { ...style, gridColumnStart: 13, gridColumnEnd: 14 };
  }

  return style;
}
