//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';

import APortrait_Container from '../Containers/Portrait_Container';
import ADebug_Container from '../Containers/Debug_Container';
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
class AScene_Game extends Phaser.Scene
{
    constructor()
    {
        super( { key: 'Scene_Game' } );

        this.Portrait_Container = null;
        this.Debug_Container = null;

        this.Save_Storage_Key = 'cultivation_save_data_v1';
        this.Player_Name = 'Andrey';
        this.Cultivation_Progress = 0.0;
    }
}
//------------------------------------------------------------------------------------------------------------




// AScene_Game
AScene_Game.prototype.create = function()
{
    this.cameras.main.setBackgroundColor('rgba(0, 255, 0, 0.5)');  // !!! TEMP
    this.input.mouse.disableContextMenu();

    this.Load_Game_State();
    // this.Save_Game_State();
    this.Portrait_Container = new APortrait_Container(this, 100, 150);  // Create portrait at position
    this.Debug_Container = new ADebug_Container(this, 0, 0);

    this.Update_Layout(this.scale.width, this.scale.height);
    this.scale.on('resize', this.On_Window_Resize, this);

    console.log('Player Cultivation Progress', this.Cultivation_Progress)
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
AScene_Game.prototype.Save_Game_State = function()
{
    let container = null;
    let json_str = null;

    container = { stage_name: this.Player_Name, cultivation_progress: this.Cultivation_Progress };
    json_str = JSON.stringify(container);

    localStorage.setItem(this.Save_Storage_Key, json_str);

    console.log('Save done', json_str);
};
//------------------------------------------------------------------------------------------------------------
AScene_Game.prototype.Load_Game_State = function()
{
    let raw_data_str = localStorage.getItem(this.Save_Storage_Key);  // Get save game file find by name key

    if(raw_data_str === null)
    {
        console.log('No save file found');
    }
    else
    {
        let parsed_data_json = JSON.parse(raw_data_str);

        this.Player_Name = String(parsed_data_json.stage_name);
        this.Cultivation_Progress = parseFloat(parsed_data_json.cultivation_progress);
    }
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default AScene_Game;
//------------------------------------------------------------------------------------------------------------
