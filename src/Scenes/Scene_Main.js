//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';
//------------------------------------------------------------------------------------------------------------
const { SPACE, W, A, S, D } = Phaser.Input.Keyboard.KeyCodes;
//------------------------------------------------------------------------------------------------------------




// AScene_Main
class AScene_Main extends Phaser.Scene
{// Main gameplay and simulation scene. Inherits from Phaser.Scene.

    constructor()
    {
        super(
            {
                key: 'Main_Scene'
            });

        // 1.0. Declare class member variables for the multi-layer tilemap pipeline.
        this.BG_Map = null;
        this.BG_Layer = null;
        this.Pipe_Layer = null;
        this.Wire_Layer = null;
        this.Is_Overlay_Active = false;
    }
}
//------------------------------------------------------------------------------------------------------------




// AScene_Main Methods
AScene_Main.prototype.preload = function ()
{
    // 1.0. Load the unified 512x512 tileset image compiled from GIMP.
    this.load.image('tileset_texture', 'assets/tileset.png');
};
//------------------------------------------------------------------------------------------------------------
AScene_Main.prototype.create = function ()  // Begin play
{
    let center_x = 0;
    let center_y = 0;
    let start_x = 0;
    let start_y = 0;
    let x = 0;
    let y = 0;
    let key_space = null;
    let tileset_ref = null;

    // 1.0. Launch HUD overlay scene and attach master event listeners.
    this.scene.launch('HUD_Scene');
    this.game.events.on('HUD_Scene_Ready', this.On_HUD_Scene_Ready, this);

    // 1.1. Setup input triggers.
    key_space = this.input.keyboard.addKey(SPACE);
    key_space.on('down', this.On_Spacebar_Pressed, this);

    // 2.0. Locate spatial center of the active camera viewport.
    center_x = this.cameras.main.width / 2;
    center_y = this.cameras.main.height / 2;

    // 6 tiles * 64px = 384px. Define the bounding box corner.
    start_x = center_x - (384 / 2);
    start_y = center_y - (384 / 2);

    // 3.0. Initialize logical 6x6 grid map dimensions in the engine.
    this.BG_Map = this.make.tilemap(
        {
            tileWidth: 64,
            tileHeight: 64,
            width: 6,
            height: 6
        });

    // 3.1. Slice the 512x512 texture into a logical Tileset object.
    tileset_ref = this.BG_Map.addTilesetImage('tileset_name', 'tileset_texture');

    // 3.2. Generate three overlapping blank rendering layers on top of each other.
    this.BG_Layer = this.BG_Map.createBlankLayer('Ground_Layer', tileset_ref, start_x, start_y);
    this.Pipe_Layer = this.BG_Map.createBlankLayer('Plumbing_Layer', tileset_ref, start_x, start_y);
    this.Wire_Layer = this.BG_Map.createBlankLayer('Electrical_Layer', tileset_ref, start_x, start_y);

    // 4.0. Fill entire Background Layer with the brown ground tiles (Tile ID = 1).
    for (y = 0; y < 6; y++)
    {
        for (x = 0; x < 6; x++)
        {
            this.BG_Map.putTileAt(1, x, y, true, this.BG_Layer);
        }
    }

    // 4.1. Draw a vertical green pipe in Column 2 (Tile ID = 2) on the Plumbing Layer.
    for (y = 0; y < 6; y++)
    {
        this.BG_Map.putTileAt(2, 2, y, true, this.Pipe_Layer);
    }

    // 4.2. Draw a horizontal orange wire in Row 3 (Tile ID = 3) on the Electrical Layer.
    for (x = 0; x < 6; x++)
    {
        this.BG_Map.putTileAt(3, x, 3, true, this.Wire_Layer);
    }
};
//------------------------------------------------------------------------------------------------------------
AScene_Main.prototype.On_Spacebar_Pressed = function (event)
{
    let target_tint = 0xffffff;
    let bg_alpha = 1.0;
    let pipe_alpha = 1.0;
    let wire_alpha = 1.0;

    // 1.0. Toggle the logical state.
    this.Is_Overlay_Active = !this.Is_Overlay_Active;

    // 1.1. Calculate rendering parameters for the diagnostic view.
    if (this.Is_Overlay_Active)
    {
        target_tint = 0x2244aa;  // Deep blueprint blue
        bg_alpha = 0.25;         // Fade background
        pipe_alpha = 1.0;        // Pipes remain fully visible
        wire_alpha = 0.0;        // Temporarily disable wires
    }
    else
    {
        target_tint = 0xffffff;  // Clear tinting
        bg_alpha = 1.0;          // Normal view
        pipe_alpha = 1.0;
        wire_alpha = 1.0;
    }

    // 1.2. Commit properties to the GPU layers.
    this.BG_Layer.setTint(target_tint);
    this.BG_Layer.setAlpha(bg_alpha);
    this.Pipe_Layer.setAlpha(pipe_alpha);
    this.Wire_Layer.setAlpha(wire_alpha);
};
//------------------------------------------------------------------------------------------------------------
AScene_Main.prototype.On_HUD_Scene_Ready = function (total_time, delta_time)
{
    this.game.events.emit('Main_Scene_Ready');

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