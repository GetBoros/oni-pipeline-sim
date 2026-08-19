//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';

import APortrait_Container from '../Containers/Portrait_Container';
import ADebug_Container from '../Containers/Debug_Container';

import { SSave_Data, ASave_Manager } from '../Core/Save_Manager';
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
class AScene_Game extends Phaser.Scene
{
    constructor()
    {
        super( { key: 'Scene_Game' } );

        this.Portrait_Container = null;
        this.Debug_Container = null;

        // Systems & State
        this.Save_Manager = null;
        this.Player_Data = null;
    }
}
//------------------------------------------------------------------------------------------------------------




// AScene_Game
AScene_Game.prototype.create = function()
{
    this.cameras.main.setBackgroundColor('rgba(0, 255, 0, 0.5)');  // !!! TEMP
    this.input.mouse.disableContextMenu();

    // 2.0. Initialize save subsystem and load state (BeginPlay equivalent)
    this.Save_Manager = new ASave_Manager('cultivation_save_data_v1');
    this.Player_Data = this.Save_Manager.Load(new SSave_Data() );

    this.Portrait_Container = new APortrait_Container(this, 100, 150);  // Create portrait at position
    this.Debug_Container = new ADebug_Container(this, 0, 0);

    this.Update_Layout(this.scale.width, this.scale.height);
    this.scale.on('resize', this.On_Window_Resize, this);

    window.addEventListener('beforeunload', ()=> { this.Save_Manager.Save(); } );

};
//------------------------------------------------------------------------------------------------------------
AScene_Game.prototype.On_Window_Resize = function(game_size)
{
    this.Update_Layout(game_size.width, game_size.height);
};
//------------------------------------------------------------------------------------------------------------
AScene_Game.prototype.Update_Layout = function (width, height)
{
    let padding_x = 20;
    let padding_y = 20;

    this.cameras.main.setViewport(0, 0, width, height);

    if (this.Portrait_Container !== null)
    {
        this.Portrait_Container.Update_Layout(padding_x, height / 2);
    }

    if (this.Debug_Container !== null)
    {
        this.Debug_Container.Update_Layout(width - padding_x, padding_y);
        this.Debug_Container.Update_Text(width, height);
    }
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default AScene_Game;
//------------------------------------------------------------------------------------------------------------
