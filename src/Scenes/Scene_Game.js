//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';

import APortrait_Container from '../Containers/Portrait_Container';
import ADebug_Container from '../Containers/Debug_Container';
import AText_Input_Container from '../Containers/Text_Input_Container';
import AProgress_Bar_Container from '../Containers/Progress_Bar_Container';
import ABorder_Container from '../Containers/Border_Container';

import { SSave_Data, ASave_Manager } from '../Subsystems/Save_Manager';
import { ETile_Frame, SAsset_Config } from '../Core/Game_Config';
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

        // Systems & State
        this.Save_Manager = null;
        this.Player_Data = null;
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
    this.Save_Manager = new ASave_Manager('cultivation_save_data_v1');
    this.Player_Data = this.Save_Manager.Load(new SSave_Data() );

    // 2.0. Add test containers
    this.Border_Container = new ABorder_Container(this, SAsset_Config.TILESET.KEY, ETile_Frame.GREEN);
    this.Progress_Bar_Container = new AProgress_Bar_Container(this, 300, 16, 0x11161d, 0x00ffcc);  // #11161d #00ffcc
    this.Portrait_Container = new APortrait_Container(this, 100, 150);  // Create portrait at position
    this.Debug_Container = new ADebug_Container(this, 0, 0);
    this.Input_Container_Name = new AText_Input_Container(this, 'Daoist name:', this.Player_Data.Player_Name, (string)=>
    {// 
        this.Player_Data.Player_Name = string;
        this.Save_Manager.Save(this.Player_Data);
    });
    this.Input_Container_Surname = new AText_Input_Container(this, 'Daoist surname', this.Player_Data.Player_Surname, (string)=>
    {// 
        this.Player_Data.Player_Surname = string;
        this.Save_Manager.Save(this.Player_Data);
    });

    // 2.1. Update container possitions
    this.Update_Layout(this.scale.width, this.scale.height);

    // send reguest to server and log to console info
    this.Request_Login(`${this.Player_Data.Player_Name} ${this.Player_Data.Player_Surname}`, "secret_dao_123");

    // 4.0 Events
    this.scale.on('resize', this.On_Window_Resize, this);
    window.addEventListener('beforeunload', ()=>
    { 
        this.Save_Manager.Save(this.Player_Data);  // auto save on exit
    } );
};
//------------------------------------------------------------------------------------------------------------
AScene_Game.prototype.Request_Login = async function(user_name, user_password)
{
    let server_url;
    let payload;
    let response;
    let data;

    // 1.0. Setup network configuration
    server_url = "https://unharmed-encore-accustom.ngrok-free.dev/login";
    payload = {
        name: user_name,
        password: user_password
    };

    try
    {
        // 1.1. Send asynchronous POST request to C++ server
        response = await fetch(server_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        // 1.2. Handle HTTP error status codes (4xx, 5xx)
        if (response.ok === false)
        {
            console.log(
                "%c[SERVER ERROR]%c HTTP Status: " + response.status,
                "background: #f39c12; color: #000000; font-weight: bold; padding: 3px 7px; border-radius: 3px;",
                "color: #f39c12; font-weight: bold; margin-left: 8px;"
            );
            return;
        }

        // 1.3. Parse JSON response
        data = await response.json();

        // 1.4. Handle successful authorization
        if ((data.status === "success") && (data.token !== undefined))
        {
            localStorage.setItem("session_token", data.token);

            console.log(
                "%c[SERVER ONLINE]%c Logged in successfully! Token: " + data.token,
                "background: #2ecc71; color: #000000; font-weight: bold; padding: 3px 7px; border-radius: 3px;",
                "color: #2ecc71; font-weight: bold; margin-left: 8px;"
            );
        }
    }
    catch (error)
    {
        // 1.5. Handle offline / connection refused error
        console.log(
            "%c[SERVER OFFLINE]%c C++ Backend is down or unreachable. Please start your C++ server and ngrok!",
            "background: #e74c3c; color: #ffffff; font-weight: bold; padding: 3px 7px; border-radius: 3px;",
            "color: #e74c3c; font-weight: bold; margin-left: 8px;"
        );
    }
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

    if (this.Progress_Bar_Container !== null)
        this.Progress_Bar_Container.Update_Layout(width / 2, height - 50);

    if (this.Border_Container !== null)
        this.Border_Container.Update_Layout(width / 2, height / 2);

    if (this.Portrait_Container !== null)
        this.Portrait_Container.Update_Layout(padding_x, height / 2);

    if (this.Input_Container_Name !== null)
        this.Input_Container_Name.Update_Layout(width / 2, 80);

    if (this.Input_Container_Surname !== null)
        this.Input_Container_Surname.Update_Layout(width / 2, 80 * 2);

    if (this.Debug_Container !== null)
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
