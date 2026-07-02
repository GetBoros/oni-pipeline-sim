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

        // 1.1. Declare camera navigation keys.
        this.W_Key = null;
        this.A_Key = null;
        this.S_Key = null;
        this.D_Key = null;

        // 1.2. Desktop drag variables.
        this.Is_Dragging = false;
        this.Drag_Start_X = 0;
        this.Drag_Start_Y = 0;
        this.Cam_Start_X = 0;
        this.Cam_Start_Y = 0;

        // 1.3. Mobile Pinch-to-Zoom tracking variables.
        this.Is_Pinching = false;
        this.Pinch_Start_Dist = 0.0;
        this.Pinch_Start_Zoom = 1.0;
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
    let key_space = null;

    // 1.0. Launch HUD overlay scene and attach master event listeners.
    this.scene.launch('HUD_Scene');
    this.game.events.on('HUD_Scene_Ready', this.On_HUD_Scene_Ready, this);

    // 1.1. Bind input action keys (SPACE and WASD).
    key_space = this.input.keyboard.addKey(SPACE);
    key_space.on('down', this.On_Spacebar_Pressed, this);

    this.W_Key = this.input.keyboard.addKey(W);
    this.A_Key = this.input.keyboard.addKey(A);
    this.S_Key = this.input.keyboard.addKey(S);
    this.D_Key = this.input.keyboard.addKey(D);

    // 1.2. Add active touch pointer for multi-touch (Pinch-to-Zoom).
    this.input.addPointer(1);

    // 1.3. Attach pointer and scroll listeners.
    this.input.on('wheel', this.On_Wheel_Scroll, this);

    this.input.mouse.disableContextMenu();
    this.input.on('pointerdown', this.On_Pointer_Down, this);
    this.input.on('pointermove', this.On_Pointer_Move, this);
    this.input.on('pointerup', this.On_Pointer_Up, this);

    // 1.4. Attach resize event listener to dynamic viewport recalculation (Orientation change).
    this.scale.on('resize', this.On_Window_Resize, this);

    // 1.5. ASYNC: Boot up and load our C++ WebAssembly Simulation
    this.Initialize_Wasm_Simulation();
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
        wire_alpha = 0.0;        // Disable wires
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
AScene_Main.prototype.On_Window_Resize = function (game_size)
{
    // 1.0. Keep the camera viewport synchronized with the physical scale of the browser container.
    this.cameras.main.setSize(game_size.width, game_size.height);
};
//------------------------------------------------------------------------------------------------------------
AScene_Main.prototype.update = function (total_time, delta_time)
{
    let camera_speed = 0;
    let dist = 0.0;
    let dx = 0.0;
    let dy = 0.0;
    let factor = 0.0;
    let target_zoom = 0.0;
    let p1 = null;
    let p2 = null;

    camera_speed = 12; // Speed of camera movement in pixels per frame
    p1 = this.input.pointer1;
    p2 = this.input.pointer2;

    // 1.0. Check desktop WASD input states and scroll the camera viewport.
    if (this.W_Key.isDown)
    {
        this.cameras.main.scrollY -= camera_speed;
    }
    if (this.S_Key.isDown)
    {
        this.cameras.main.scrollY += camera_speed;
    }
    if (this.A_Key.isDown)
    {
        this.cameras.main.scrollX -= camera_speed;
    }
    if (this.D_Key.isDown)
    {
        this.cameras.main.scrollX += camera_speed;
    }

    // 2.0. Handle mobile Pinch-to-Zoom logic (Multi-touch).
    if (p1.isDown && p2.isDown)
    {
        // 2.1. Calculate the distance between two active touch pointers.
        dx = p1.x - p2.x;
        dy = p1.y - p2.y;
        dist = Math.sqrt(dx * dx + dy * dy);

        // 2.2. Evaluate gesture phase.
        if (!this.Is_Pinching)
        {
            this.Is_Pinching = true;
            this.Pinch_Start_Dist = dist;
            this.Pinch_Start_Zoom = this.cameras.main.zoom;
        }
        else
        {
            // 2.3. Determine magnification ratio.
            factor = dist / this.Pinch_Start_Dist;
            target_zoom = this.Pinch_Start_Zoom * factor;

            // 2.4. Apply limits and execute viewport matrix scaling.
            target_zoom = Phaser.Math.Clamp(target_zoom, 0.25, 4.0);
            this.cameras.main.setZoom(target_zoom);
        }
    }
    else
    {
        // 2.5. Release pinch gesture lock.
        this.Is_Pinching = false;
    }
};
//------------------------------------------------------------------------------------------------------------
AScene_Main.prototype.On_Wheel_Scroll = function (pointer, game_objects, delta_x, delta_y, delta_z)
{
    let zoom_old = 0.0;
    let zoom_new = 0.0;
    let world_point = null;
    let new_world_point = null;
    let camera = null;

    // 1.0. Cache master camera reference and current scale value.
    camera = this.cameras.main;
    zoom_old = camera.zoom;

    // 1.1. Get the precise world coordinate under the cursor BEFORE the zoom change.
    world_point = camera.getWorldPoint(pointer.x, pointer.y);

    // 1.2. Evaluate scroll direction to determine target scale.
    if (delta_y > 0)
    {
        zoom_new = zoom_old - 0.15; // Smooth zoom out
    }
    else
    {
        zoom_new = zoom_old + 0.15; // Smooth zoom in
    }

    // 1.3. Clamp the scale value to safe structural boundaries.
    zoom_new = Phaser.Math.Clamp(zoom_new, 0.25, 4.0);

    // 1.4. Apply the target zoom value.
    camera.setZoom(zoom_new);

    // 1.5. CRITICAL: Force immediate recalculation of the camera matrix (lazy evaluation bypass).
    camera.preRender();

    // 1.6. Get the new world coordinate under the same screen pointer AFTER the zoom.
    new_world_point = camera.getWorldPoint(pointer.x, pointer.y);

    // 1.7. Shift camera scroll offsets by the matrix displacement difference.
    camera.scrollX -= (new_world_point.x - world_point.x);
    camera.scrollY -= (new_world_point.y - world_point.y);
};
//------------------------------------------------------------------------------------------------------------
AScene_Main.prototype.On_Pointer_Down = function (pointer)
{
    // 1.0. Enable dragging on Mobile touch OR Right-Click (button index 2) on Desktop.
    if (pointer.wasTouch || pointer.button === 2)
    {
        this.Is_Dragging = true;
        this.Drag_Start_X = pointer.x;
        this.Drag_Start_Y = pointer.y;
        this.Cam_Start_X = this.cameras.main.scrollX;
        this.Cam_Start_Y = this.cameras.main.scrollY;
    }
};
//------------------------------------------------------------------------------------------------------------
AScene_Main.prototype.On_Pointer_Move = function (pointer)
{
    let dx = 0;
    let dy = 0;
    let zoom_factor = 0.0;

    // 1.0. Process camera panning only if active drag lock is held AND we are not pinching.
    if (this.Is_Dragging && !this.Is_Pinching)
    {
        zoom_factor = this.cameras.main.zoom;

        // 1.1. Adjust mouse displacement by current scale matrix to keep 1:1 movement feel.
        dx = (pointer.x - this.Drag_Start_X) / zoom_factor;
        dy = (pointer.y - this.Drag_Start_Y) / zoom_factor;

        // 1.2. Shift the viewport in opposite direction (grabbing effect).
        this.cameras.main.scrollX = this.Cam_Start_X - dx;
        this.cameras.main.scrollY = this.Cam_Start_Y - dy;
    }
};
//------------------------------------------------------------------------------------------------------------
AScene_Main.prototype.On_Pointer_Up = function (pointer)
{
    // 1.0. Reset dragging lock on button or touch release.
    if (pointer.wasTouch || pointer.button === 2)
    {
        this.Is_Dragging = false;
    }
};
//------------------------------------------------------------------------------------------------------------
AScene_Main.prototype.Initialize_Wasm_Simulation = async function ()
{
    let x = 0;
    let y = 0;
    let idx = 0;
    let tile_id = 0;
    let map_size = 128;
    let tile_types_ptr = 0;
    let response = null;
    let wasm_module = null;
    let exports = null;
    let tileset_ref = null;
    let tile_view = null;

    // 2.0. Fetch and instantiate WebAssembly binary stream
    response = await fetch(`${import.meta.env.BASE_URL}simulation.wasm`);
    wasm_module = await WebAssembly.instantiateStreaming(response);
    exports = wasm_module.instance.exports;
    this.wasm_instance = wasm_module.instance;

    // 2.1. Initialize the logical grid dimensions in Phaser 4 (ONLY ONCE)
    this.BG_Map = this.make.tilemap(
        {
            tileWidth: 64,
            tileHeight: 64,
            width: map_size,
            height: map_size
        });

    // 2.2. Slice the 512x512 texture into a logical Tileset object
    tileset_ref = this.BG_Map.addTilesetImage('tileset_name', 'tileset_texture');

    // 2.3. Create layers starting strictly at World coordinates (0, 0)
    this.BG_Layer = this.BG_Map.createBlankLayer('Ground_Layer', tileset_ref, 0, 0, map_size, map_size);
    this.Pipe_Layer = this.BG_Map.createBlankLayer('Plumbing_Layer', tileset_ref, 0, 0, map_size, map_size);
    this.Wire_Layer = this.BG_Map.createBlankLayer('Electrical_Layer', tileset_ref, 0, 0, map_size, map_size);

    // 3.0. TRIGGER C++ SIMULATION MAP GENERATION
    this.wasm_instance.exports.Generate_Random_Map();

    // 3.1. Map JS Int32Array directly over the C++ memory block
    tile_types_ptr = this.wasm_instance.exports.Get_Tile_Types_Ptr();
    tile_view = new Int32Array(this.wasm_instance.exports.memory.buffer, tile_types_ptr, map_size * map_size);

    // --- ВСТАВЬТЕ ЭТОТ ДИАГНОСТИЧЕСКИЙ БЛОК СЮДА ---
    let count_1 = 0;
    let count_2 = 0;
    let count_3 = 0;
    let count_other = 0;
    let i = 0;

    for (i = 0; i < tile_view.length; i++)
    {
        if (tile_view[i] === 1)
        {
            count_1++;
        }
        else if (tile_view[i] === 2)
        {
            count_2++;
        }
        else if (tile_view[i] === 3)
        {
            count_3++;
        }
        else
        {
            count_other++;
        }
    }

    console.log("[DEBUG_WASM] Memory buffer size in bytes:", this.wasm_instance.exports.memory.buffer.byteLength);
    console.log("[DEBUG_WASM] Pointer from C++:", tile_types_ptr);
    console.log("[DEBUG_WASM] tile_view array length:", tile_view.length);
    console.log("[DEBUG_WASM] Earth Tiles (ID 1):", count_1);
    console.log("[DEBUG_WASM] Pipe Tiles (ID 2):", count_2);
    console.log("[DEBUG_WASM] Wire Tiles (ID 3):", count_3);
    console.log("[DEBUG_WASM] Empty/Other (ID 0):", count_other);
    console.log("[DEBUG_WASM] First 20 elements of the array:", Array.from(tile_view.slice(0, 20)));
    
    // 4.0. Draw tiles on Phaser layers based on C++ generated data
    for (y = 0; y < map_size; ++y)
    {
        for (x = 0; x < map_size; ++x)
        {
            idx = y * map_size + x;
            tile_id = tile_view[idx];

            if (tile_id === 1)
            {
                // 1 - Solid earth (Background layer)
                this.BG_Map.putTileAt(1, x, y, true, this.BG_Layer);
            }
            else if (tile_id === 2)
            {
                // 2 - Plumbing pipe (Pipes layer)
                this.BG_Map.putTileAt(2, x, y, true, this.Pipe_Layer);
            }
            else if (tile_id === 3)
            {
                // 3 - Electrical wire (Wires layer)
                this.BG_Map.putTileAt(3, x, y, true, this.Wire_Layer);
            }
        }
    }

    console.log("[WASM ENGINE] Successfully generated and rendered C++ grid!");
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default AScene_Main;
//------------------------------------------------------------------------------------------------------------