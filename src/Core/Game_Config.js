//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';

import AScene_Menu from '../Scenes/Scene_Menu.js';
import AScene_Main from '../Scenes/Scene_Main.js';
import AScene_HUD from '../Scenes/Scene_HUD.js';
import AScene_Test_Physics from '../Scenes/Scene_Test_Physics.js';
import AScene_Game from '../Scenes/Scene_Game.js'
//------------------------------------------------------------------------------------------------------------
export const SAsset_Config = Object.freeze(
{// SAsset_Config: Immutable manifest of external assets (paths, keys, and texture slicing metadata).

    TILESET: Object.freeze(
    {
        KEY: 'tileset',
        PATH: `${import.meta.env.BASE_URL}assets/tileset.png`,
        FRAME_WIDTH: 64,
        FRAME_HEIGHT: 64
    } )
} );
//------------------------------------------------------------------------------------------------------------
export const ETile_Frame = Object.freeze(
{// ETile_Frame: Enum defining frame indices within the tileset spritesheet.

    EMPTY: 0,
    BROWN: 1,
    GREEN: 2,
    GOLD: 3
});
//------------------------------------------------------------------------------------------------------------
const Game_Config =
{// Engine and viewport initialization configurations.

    type: Phaser.WEBGL,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#4e4e4e',
    // pixelArt: true,  // Force nearest-neighbor filtering globally (removes tile seams)
    // roundPixels: true,  // Force integer rounding of screen rendering coordinates
    scale:
    {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%'
    },
    fps:
    {
        target: 24,
        forceSetTimeOut: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 500 },
            debug: true // Enables rendering of bounding boxes and velocity vectors
        }
    },
    scene: [/**AScene_Test_Physics, AScene_Main, AScene_Menu, AScene_HUD, */AScene_Game]
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default Game_Config;
//------------------------------------------------------------------------------------------------------------