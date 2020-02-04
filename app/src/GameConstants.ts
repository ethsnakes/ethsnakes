// definiciones de TypeScript
// https://github.com/ethereum/web3.js/blob/c0e727eac7c16826c39fd43a03a4930b5ff6fff8/packages/web3/types.d.ts

export class GameConstants {

    public static readonly VERSION = "0.0";
    public static readonly DEVELOPMENT = false;
    public static readonly DEBUG_MODE = false;
    public static readonly VERBOSE = false;

    public static readonly GAME_WIDTH = 1000;
    public static readonly GAME_HEIGHT = 800;

    public static readonly CONTRACT_ADDRESS = "0x18572FD0f44B51F67zf16c5f1dc3c6653C554963";

    public static readonly BOT = "bot";
    public static readonly PLAYER = "player";

    public static readonly BOARD_ELEMENTS: {in: number, out: number, id: number, anims?: number[]} [] = [

        // ESCALERAS
        {in: 4, out: 14, id: 1, anims: [0]},
        {in: 8, out: 32, id: 2, anims: [1]},
        {in: 20, out: 38, id: 3, anims: [2]},
        {in: 28, out: 84, id: 4, anims: [3, 4, 5]},
        {in: 40, out: 59, id: 5, anims: [6]},
        {in: 58, out: 83, id: 6, anims: [7]},
        {in: 72, out: 93, id: 7, anims: [8]},
        
        // serpientes
        {in: 15, out: 3, id: 5},
        {in: 31, out: 9, id: 8},
        {in: 44, out: 26, id: 2},
        {in: 62, out: 19, id: 3},
        {in: 74, out: 70, id: 7},
        {in: 85, out: 33, id: 4},
        {in: 91, out: 71, id: 6},
        {in: 98, out: 80, id: 1}
    ];

    public static readonly STAKES_IN_ETH = [0.01, 0.02, 0.05, 0.1, 0.2];

    public static readonly SAVED_GAME_DATA_KEY = "snake-and-ladders-data";
}
