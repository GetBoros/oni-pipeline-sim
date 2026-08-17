//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';

import AScene_Menu from '../Scenes/Scene_Menu.js';
import AScene_Main from '../Scenes/Scene_Main.js';
import AScene_HUD from '../Scenes/Scene_HUD.js';
import AScene_Test_Physics from '../Scenes/Scene_Test_Physics.js';
import AScene_Game from '../Scenes/Scene_Game.js'
//------------------------------------------------------------------------------------------------------------
const Game_Config =
{// Engine and viewport initialization configurations.

    type: Phaser.WEBGL,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#bb6363',
    // pixelArt: true,  // Force nearest-neighbor filtering globally (removes tile seams)
    // roundPixels: true,  // Force integer rounding of screen rendering coordinates
    scale:
    {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
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