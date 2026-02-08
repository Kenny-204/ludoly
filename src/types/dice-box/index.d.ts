declare module "@3d-dice/dice-box" {
  export default class DiceBox {
    constructor(options?: DiceBoxOptions);
    init(): Promise<DiceBox>;
    showResults(
      dice: (DiceRoll & { value: number })[],
      options?: RollOptions,
    ): void;
    roll(
      dice: (string | DiceRoll)[],
      options?: RollOptions,
    ): Promise<DiceRollResult[]>;
    add(
      dice: (string | DiceRoll)[],
      options?: RollOptions,
    ): Promise<DiceRollResult[]>;
    reroll(
      notation: DiceRollResult[],
      options?: RerollOptions,
    ): Promise<DiceRollResult[]>;
    remove(
      notation: DiceRollResult[],
      options?: RemoveOptions,
    ): Promise<DiceRollResult[]>;
    updateConfig(options: Partial<DiceBoxOptions>): Promise<DiceBox>;
    clear(): DiceBox;
    hide(className?: string): DiceBox;
    show(): DiceBox;
    getRollResults(): DiceRollResults[];
    onRollComplete(rollResult: DiceRollResults[]): void;
    config: DiceBoxOptions;
    isVisible: boolean;
  }

  export interface RollOptions {
    theme?: string;
    themeColor?: string;
    newStartPoint?: boolean;
  }

  export interface RerollOptions {
    remove?: boolean;
    hide?: boolean;
    newStartPoint?: boolean;
  }

  export interface RemoveOptions {
    hide?: boolean;
  }

  export interface DiceRoll {
    sides: number | string; // the type of die to be rolled. Either a number such as 20 or a die type such as "fate".
    qty?: number; // optional - the number of dice to be rolled. Defaults to 1
    modifier?: number; // optional - the modifier (positive or negative) to be added to the final results
    theme?: string; // optional - the theme's 'systemName' for this roll
    themeColor?: string; // optional - HEX value for the theme's material color
    groupId?: number; // optional - group ID for the roll
    rollId?: number; // optional - roll ID for the die
    id?: number; // optional - unique ID for the die
  }

  export interface DiceRollResult {
    groupId: number; // the roll group this die belongs to
    rollId: number; // the unique identifier for this die within the group
    sides: number; // the type of die
    theme: string; // the theme that was assigned to this die
    themeColor: string; // optional - HEX value for the theme's material color
    value: number; // the result for this die
    dieType: string; // the die type string (e.g., "d20")
    data?: unknown; // additional data for the die
    modifier?: number; // modifier applied to this die
    pos?: { x: number; y: number; z: number };
    quat?: { x: number; y: number; z: number; w: number };
    childPos?: { x: number; y: number; z: number };
    childQuat?: { x: number; y: number; z: number; w: number };
  }

  export interface DiceRollResults {
    // the roll group object
    id: number; // the id of this group - should match the groupId of rolls
    modifier: number; // the roll modifier
    qty: number; // the number of dice in this roll
    rolls: DiceRollResult[]; // an array of Die Result Objects
    sides: number; // the type of die used
    theme: string; // the theme for this group of dice
    themeColor: string; // the theme color for this group of dice
    value: number; // the sum of the dice roll results and modifier
  }

  export interface DiceBoxOptions {
    id?: string; // The ID of the canvas element.
    container?: Element | string | null; // A query selector for the DOM element to place the dice box canvas in.
    assetPath?: string; // The path to static assets needed by this module.
    origin?: string; // Sets the site origin used for constructing paths to assets.
    enableShadows?: boolean; // Do the dice cast shadows onto DiceBox mesh?
    shadowTransparency?: number; // Set the transparency of the shadows cast by the dice
    lightIntensity?: number; // Global illumination levels
    delay?: number; // delay between dice being generated
    scale?: number; // scale the dice
    theme?: string; // can be a hex color or a pre-defined theme
    preloadThemes?: string[]; // An array of themes to pre-load
    externalThemes?: { [key: string]: string }; // An object with theme system names as the key value and an external url path to theme assets
    themeColor?: string; // used for color values or named theme variants
    offscreen?: boolean; // use offscreen canvas browser feature for performance improvements
    suspendSimulation?: boolean; // Turn off the 3D simulation and use the built-in random number generator instead
    onCollision?: (body0Id: number, body1Id: number, force: number) => void; // callback function triggered on collision
    onBeforeRoll?: (notation: DiceRoll[]) => void; // callback function triggered after notation has been parsed, but before the roll starts
    onDieComplete?: (die: DiceRollResult) => void; // callback function triggered whenever an individual die has completed rolling
    onRollComplete?: (results: DiceRollResults[]) => void; // callback function triggered whenever all the dice have completed rolling
    onRemoveComplete?: (die: DiceRollResult) => void; // callback function triggered whenever a die has been removed from the scene
    onThemeConfigLoaded?: (theme: DiceBoxTheme) => void; // callback function triggered after a theme config file has been successfully fetched and parsed
    onThemeLoaded?: (theme: DiceBoxTheme) => void; // callback function triggered after a theme has finished loading all related assets
  }

  export interface DiceBoxTheme {
    author?: string; // The author of the theme
    basePath: string; // The base path for the theme assets
    diceAvailable: string[]; // An array of available dice types
    diceExtended?: { [key: string]: string }; // Extended dice types
    material?: {
      type: string; // The type of material used for the theme
      diffuseTexture?: string; // The path to the diffuse texture file
      diffuseLevel?: number; // The level of the diffuse texture
      bumpTexture?: string; // The path to the bump texture file
      bumpLevel?: number; // The level of the bump texture
    };
    meshFile?: string; // The path to the mesh file
    meshFilePath: string; // The path to the mesh file
    meshName: string; // The name of the mesh file
    name?: string; // The name of the theme
    systemName?: string; // The system name of the theme
    theme: string; // The theme name
    version?: number; // The version of the theme
    extends?: string; // Theme this theme extends
  }
}
