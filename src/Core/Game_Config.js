//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';

import AScene_Menu from '../Scenes/Scene_Menu.js';
import AScene_Main from '../Scenes/Scene_Main.js';
import AScene_HUD from '../Scenes/Scene_HUD.js';
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
    scene: [AScene_Main, AScene_Menu, AScene_HUD]
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default Game_Config;
//------------------------------------------------------------------------------------------------------------