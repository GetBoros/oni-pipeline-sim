//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';

import { AUI_Layout_Library, SUI_Layout } from '../Library/UI_Layout_Library.js';
//------------------------------------------------------------------------------------------------------------
class AScene_HUD extends Phaser.Scene
{// Main gameplay and simulation scene. Inherits from Phaser.Scene.

    constructor()
    {
        super({ key: 'HUD_Scene' });

        this.Text_Header = null;
        this.Text_Dialogue = null;
        this.Graphics_Debug = null;
        this.Frame_Counter = 0;
    }
}
//------------------------------------------------------------------------------------------------------------




// AScene_HUD
AScene_HUD.prototype.create = function ()  // Begin play
{
    console.log("Begin play");

    let style_header_fps = null;
    let style_dialogue = null;

    // 1.0. Create UI configurations via unified helper
    style_header_fps = AUI_Layout_Library.Set_Font_Style(32, 4, '#0000ff', 0); // No wrap
    style_dialogue = AUI_Layout_Library.Set_Font_Style(32, 3, '#ffffff', 450); // Preferred wrap 450

    // 1.1. Spawn UI Game Objects at zero coords
    this.Text_Header = this.add.text(0, 0, 'Hello world!', style_header_fps);
    this.Text_Header.Wrap_Width_Preferred = 32 * 10;

    this.Text_Dialogue = this.add.text(0, 0, '', style_dialogue);
    this.Text_Dialogue.Wrap_Width_Preferred = 450;
    this.Text_Dialogue.setText('Dialogue: ');

    this.Graphics_Debug = this.add.graphics();

    // 2.0. Bind viewport Resize Event
    this.scale.on('resize', this.Resize_UI, this);

    // 2.1. Perform initial manual layout pass
    this.Resize_UI();

    this.game.events.on('Main_Scene_Ready', this.On_Main_Scene_Ready, this);

    this.game.events.emit('HUD_Scene_Ready');  // Notify HUD scene that Main scene is ready
};
//------------------------------------------------------------------------------------------------------------
AScene_HUD.prototype.On_Main_Scene_Ready = function ()
{
    console.log("Main scene is ready, HUD can now resize UI");
};
//------------------------------------------------------------------------------------------------------------
AScene_HUD.prototype.Resize_UI = function ()
{// Repositions scene elements via clean static library layout helpers.
    let line_size = 30;
    let header_y_offset = 20;
    let dialogue_y_offset = -40;

    // 1.0. Apply declarative anchoring
    AUI_Layout_Library.Align_To_Anchor(this, this.Text_Header, SUI_Layout.TOP_CENTER, 0, header_y_offset);
    AUI_Layout_Library.Align_To_Anchor(this, this.Text_Dialogue, SUI_Layout.CENTER, 0, dialogue_y_offset);

    // 2.0. Redraw Debug visualizers to match updated coordinates
    // this.Graphics_Debug.clear();
    // this.Graphics_Debug.lineStyle(2, 0xff0000, 1.0);

    // // Header Crosshair
    // this.Graphics_Debug.lineBetween(this.Text_Header.x - line_size, this.Text_Header.y, this.Text_Header.x + line_size, this.Text_Header.y);
    // this.Graphics_Debug.lineBetween(this.Text_Header.x, this.Text_Header.y - line_size, this.Text_Header.x, this.Text_Header.y + line_size);

    // // Dialogue Crosshair
    // this.Graphics_Debug.lineBetween(this.Text_Dialogue.x - line_size, this.Text_Dialogue.y - 20, this.Text_Dialogue.x + line_size, this.Text_Dialogue.y - 20);
    // this.Graphics_Debug.lineBetween(this.Text_Dialogue.x, this.Text_Dialogue.y - 20 - line_size, this.Text_Dialogue.x, this.Text_Dialogue.y - 20 + line_size);
};
//------------------------------------------------------------------------------------------------------------
AScene_HUD.prototype.update = function (total_time, delta_time)
{
    this.Frame_Counter = this.Frame_Counter + 1;

    if (this.Frame_Counter % 10 === 0)
    {
        let fps_curr = 0;

        fps_curr = 1000 / delta_time;
        this.Text_Header.setText('Frame Processed: ' + Math.round(fps_curr));

    }
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default AScene_HUD;
//------------------------------------------------------------------------------------------------------------