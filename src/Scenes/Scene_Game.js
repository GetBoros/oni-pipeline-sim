//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';

import APortrait_Container from '../Containers/Portrait_Container';
import ADebug_Container from '../Containers/Debug_Container';
import AText_Input_Container from '../Containers/Text_Input_Container';

import { SSave_Data, ASave_Manager } from '../Subsystems/Save_Manager';
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
        this.Name_Input_Container = null;
        this.Surn_Name_Input_Container = null;
    }
}
//------------------------------------------------------------------------------------------------------------




// AScene_Game
AScene_Game.prototype.create = function()
{
    this.input.mouse.disableContextMenu();  // Disable RMB context menu

    // 1.0. Initialize save subsystem and load state (BeginPlay equivalent)
    this.Save_Manager = new ASave_Manager('cultivation_save_data_v1');
    this.Player_Data = this.Save_Manager.Load(new SSave_Data() );

    // 2.0. Add test containers
    this.Portrait_Container = new APortrait_Container(this, 100, 150);  // Create portrait at position
    this.Debug_Container = new ADebug_Container(this, 0, 0);
    this.Name_Input_Container = new AText_Input_Container(this, this.Player_Data.Player_Name, 'Daoist name:', (new_name)=>
    {// 
        this.Player_Data.Player_Name = new_name;
        this.Save_Manager.Save(this.Player_Data);
    });
    this.Surn_Name_Input_Container = new AText_Input_Container(this, this.Player_Data.Player_Sur_Name, 'Daoist surname', (new_sur_name)=>
    {// 
        this.Player_Data.Player_Sur_Name = new_sur_name;
        this.Save_Manager.Save(this.Player_Data);
    });

    // 2.1. Update container possitions
    this.Update_Layout(this.scale.width, this.scale.height);

    // 4.0 Events
    this.scale.on('resize', this.On_Window_Resize, this);
    window.addEventListener('beforeunload', ()=>
    { 
        this.Save_Manager.Save(this.Player_Data); 
    } );  // auto save of exit

};
//------------------------------------------------------------------------------------------------------------
AScene_Game.prototype.On_Window_Resize = function(game_size)
{
    this.Update_Layout(game_size.width, game_size.height);
};
//------------------------------------------------------------------------------------------------------------
AScene_Game.prototype.Update_Layout = function (width, height)
{
    let padding_x = 30;
    let padding_y = 30;

    if (this.Portrait_Container !== null)
        this.Portrait_Container.Update_Layout(padding_x, height / 2);

    if (this.Name_Input_Container !== null)
        {
            this.Name_Input_Container.Update_Layout(width / 2, 80);
            this.Surn_Name_Input_Container.Update_Layout(width / 2, 80 * 2);
        };

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
