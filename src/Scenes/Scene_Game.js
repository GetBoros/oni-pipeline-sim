//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';

import APortrait_Container from '../Containers/Portrait_Container';
import ADebug_Container from '../Containers/Debug_Container';
import AText_Input_Container from '../Containers/Text_Input_Container';
import AProgress_Bar_Container from '../Containers/Progress_Bar_Container';
import ABorder_Container from '../Containers/Border_Container';
import AVideo_Stream_Container from '../Containers/Video_Stream_Container';
import ANetwork_Manager from '../Subsystems/Network_Manager';

import { SSave_Data, ASave_Manager } from '../Subsystems/Save_Manager';
import { ETile_Frame, SAsset_Config, SNetwork_Config } from '../Core/Game_Config';
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
class AScene_Game extends Phaser.Scene
{
    constructor()
    {
        super( { key: 'Scene_Game' } );

        this.Portrait_Container = null;
        this.Debug_Container = null;
        this.Input_Container_Name = null;
        this.Input_Container_Surname = null;
        this.Progress_Bar_Container = null;
        this.Border_Container = null;
        this.Video_Player = null;

        // Systems & State
        this.Save_Manager = null;
        this.Player_Data = null;
        this.Network_Manager = null;
    }
}
//------------------------------------------------------------------------------------------------------------




// AScene_Game
AScene_Game.prototype.preload = function ()
{
    // 1.0. Load and slice the tileset texture into 64x64 pixel frames in GPU memory
    this.load.spritesheet(SAsset_Config.TILESET.KEY, SAsset_Config.TILESET.PATH,
    {
        frameWidth: SAsset_Config.TILESET.FRAME_WIDTH,
        frameHeight: SAsset_Config.TILESET.FRAME_HEIGHT
    } );
};
//------------------------------------------------------------------------------------------------------------
AScene_Game.prototype.create = function ()
{
    this.input.mouse.disableContextMenu();  // Disable RMB context menu

    // 1.0. Initialize save subsystem and load state (BeginPlay equivalent)
    this.Save_Manager = new ASave_Manager('save_00');  // Initialize save manager with a unique key for local storage
    this.Player_Data = this.Save_Manager.Load(new SSave_Data() );  // Load player data from local storage
    this.Network_Manager = new ANetwork_Manager(SNetwork_Config.SERVER_URL);

    // 2.0. Add test containers
    this.Video_Player = new AVideo_Stream_Container(this, false); // false = Dual Window Mode
    this.Debug_Container = new ADebug_Container(this);  // Create debug container
    this.Border_Container = new ABorder_Container(this, SAsset_Config.TILESET.KEY, ETile_Frame.GREEN);
    this.Portrait_Container = new APortrait_Container(this);  // Create portrait container
    this.Progress_Bar_Container = new AProgress_Bar_Container(this, 300, 16, 0x11161d, 0x00ffcc);  // #11161d #00ffcc

    this.Input_Container_Video = new AText_Input_Container(this, 'Enter URL format m3u8 video: ', this.Player_Data.URL_Format_m3u8_video, (string)=>
    {// 
        this.Player_Data.URL_Format_m3u8_video = string;
        this.Save_Manager.Save(this.Player_Data);
    });
    this.Input_Container_Audio = new AText_Input_Container(this, 'Enter URL format m3u8 audio: ', this.Player_Data.URL_Format_m3u8_audio, (string)=>
    {// 
        this.Player_Data.URL_Format_m3u8_audio = string;
        this.Save_Manager.Save(this.Player_Data);
    });
    
    // 2.1. Update container possitions
    this.Update_Layout(this.scale.width, this.scale.height);

    // 4.0 Events
    this.scale.on('resize', this.On_Window_Resize, this);
    window.addEventListener('beforeunload', ()=>
    { 
        this.Save_Manager.Save(this.Player_Data);  // auto save on exit
    } );
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

    if(this.Video_Player !== null)  // Update video player position in the middle of the screen
    {
        this.Video_Player.setPosition(width / 2, height / 2);
        this.Video_Player.Update_Layout();
    }

    if (this.Progress_Bar_Container !== null)  // Update progress bar position at the bottom of the screen
        this.Progress_Bar_Container.Update_Layout(width / 2, height - 50);

    if (this.Border_Container !== null)  // Update border container position in the middle of the screen
        this.Border_Container.Update_Layout(width / 2, height / 2);

    if (this.Portrait_Container !== null)  // Update portrait container position in the middle of the screen
        this.Portrait_Container.Update_Layout(padding_x, height / 2);

    if (this.Input_Container_Video !== null)  // Update video input container position in the middle of the screen
        this.Input_Container_Video.Update_Layout(width / 2, 80);

    if (this.Input_Container_Audio !== null)  // Update audio input container position below the video input container
        this.Input_Container_Audio.Update_Layout(width / 2, 80 * 2);

    if (this.Debug_Container !== null)  // Update debug container position at the top-right corner of the screen
    {
        this.Debug_Container.Update_Layout(width - padding_x, padding_y);
        this.Debug_Container.Update_Text(width, height);
    }
};
//------------------------------------------------------------------------------------------------------------
AScene_Game.prototype.update = function (time, delta)
{
    let test_progress;

    // 1.0. Calculate test progress ratio over time using sine wave oscillation
    test_progress = (Math.sin(time * 0.002) + 1) / 2;

    // 2.0. Update test progress bar state if instance exists
    if (this.Progress_Bar_Container !== null)
        this.Progress_Bar_Container.Set_Progress(test_progress);
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default AScene_Game;
//------------------------------------------------------------------------------------------------------------
