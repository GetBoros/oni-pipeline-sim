//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';
import AMenu_Scene from '../Scenes/Menu_Scene.js';
import AMain_Scene from '../Scenes/Main_Scene.js';
//------------------------------------------------------------------------------------------------------------
const Game_Config =
{// Engine and viewport initialization configurations.

    type: Phaser.WEBGL,
    parent: 'game-container',
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
    scene: [AMenu_Scene, AMain_Scene]
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default Game_Config;
//------------------------------------------------------------------------------------------------------------
