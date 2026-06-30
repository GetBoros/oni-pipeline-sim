//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';
//------------------------------------------------------------------------------------------------------------
const { SPACE, W, A, S, D } = Phaser.Input.Keyboard.KeyCodes;
//------------------------------------------------------------------------------------------------------------
class AScene_Main extends Phaser.Scene
{
    constructor()
    {
    super(
        {
            key: 'Main_Scene'
        });
    }
}
//------------------------------------------------------------------------------------------------------------




// AScene_Main
AScene_Main.prototype.create = function ()  // Begin play
{
    let key_space;

    this.scene.launch('HUD_Scene');  // Launch HUD overlay scene
    this.game.events.on('HUD_Scene_Ready', this.On_HUD_Scene_Ready, this);
    
    key_space = this.input.keyboard.addKey(SPACE);
    key_space.on('down', function (event)
    {
        console.log("Spacebar pressed");
    }, this);
};
//------------------------------------------------------------------------------------------------------------
AScene_Main.prototype.On_HUD_Scene_Ready = function (total_time, delta_time)
{
    this.game.events.emit('Main_Scene_Ready');  // Notify HUD scene that Main scene is ready

    console.log("Main scene is ready, HUD can now resize UI");
};
//------------------------------------------------------------------------------------------------------------
AScene_Main.prototype.update = function (total_time, delta_time)
{
    
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default AScene_Main;
//------------------------------------------------------------------------------------------------------------