//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';
import { AGrid_System, Assert_Grid_Concept } from '../Simulation/Grid_System.js';
//------------------------------------------------------------------------------------------------------------
class AMain_Scene extends Phaser.Scene
{// Main gameplay and simulation scene. Inherits from Phaser.Scene.

    constructor()
    {
        super(
            {
                key: 'MainScene'
            });

        this.Grid_Instance = null;
        this.Graphics_Renderer = null;
    }
}
//------------------------------------------------------------------------------------------------------------




// AMain_Scene
AMain_Scene.prototype.create = function()
{
    let grid_width = 0;
    let grid_height = 0;
    let tile_size = 0;

    // 1.0. Initialize the grid system (6x6 cells, each cell is 40x40 pixels)
    grid_width = 6;
    grid_height = 6;
    tile_size = 40;
    this.Grid_Instance = new AGrid_System();

    // 1.1. Enforce C++ Type Trait and Concept verification contract before execution
    Assert_Grid_Concept(this.Grid_Instance);

    this.Grid_Instance.Initialize_Grid(grid_width, grid_height, tile_size);

    // 1.2. Create a boundary layout (solid walls/floor, hollow center)
    this.Setup_Test_Scene();

    // 2.0. Initialize Phaser Graphics engine for rendering
    this.Graphics_Renderer = this.add.graphics();

    // 2.1. Render text using loaded font
    this.add.text(400, 100, 'Main Gameplay Initialized',
        {
            fontSize: '40px',
            fill: '#00ff00',
            fontFamily: 'Bitcount Single'
        }).setOrigin(0.5);

    // 3.0. Initial render call
    this.Render_Grid();

    console.log('Grid rendering and simulation data structures initialized.');
};
//------------------------------------------------------------------------------------------------------------
AMain_Scene.prototype.Setup_Test_Scene = function()
{
    let x = 0;
    let y = 0;

    // 1.0. Loop and configure simulation cell states: 1 = Solid Dirt, 0 = Vacuum/Air
    for (y = 0; y < this.Grid_Instance.Grid_Height; y = y + 1)
    {
        for (x = 0; x < this.Grid_Instance.Grid_Width; x = x + 1)
        {
            // Floor (y = 5) and walls (x = 0 or x = 5) are solid blocks.
            if (y === 5 || x === 0 || x === 5)
            {
                this.Grid_Instance.Set_Cell(x, y, 1);
            }
            else
            {
                this.Grid_Instance.Set_Cell(x, y, 0);
            }
        }
    }
};
//------------------------------------------------------------------------------------------------------------
AMain_Scene.prototype.Render_Grid = function()
{
    let x = 0;
    let y = 0;
    let cell_type = 0;
    let draw_x = 0;
    let draw_y = 0;
    let size = 0;
    let offset_x = 0;
    let offset_y = 0;

    // 1.0. Configuration variables
    size = this.Grid_Instance.Tile_Size;
    offset_x = 280; // Centering 240px wide grid (6 cells * 40px) on 800px width
    offset_y = 200; // Centering 240px high grid on 600px height

    // 2.0. Clear old geometry
    this.Graphics_Renderer.clear();

    // 3.0. Iterate through memory structure and draw primitives
    for (y = 0; y < this.Grid_Instance.Grid_Height; y = y + 1)
    {
        for (x = 0; x < this.Grid_Instance.Grid_Width; x = x + 1)
        {
            cell_type = this.Grid_Instance.Get_Cell(x, y);
            draw_x = offset_x + (x * size);
            draw_y = offset_y + (y * size);

            // 3.1. Match rendering color to simulation state
            if (cell_type === 1)
            {
                this.Graphics_Renderer.fillStyle(0x7c5c43, 1.0); // Solid Soil Brown
            }
            else
            {
                this.Graphics_Renderer.fillStyle(0x1a1a1a, 1.0); // Vacuum Black
            }

            // 3.2. Render solid fill
            this.Graphics_Renderer.fillRect(draw_x, draw_y, size, size);

            // 3.3. Render grid outlines
            this.Graphics_Renderer.lineStyle(1, 0x444444, 0.8);
            this.Graphics_Renderer.strokeRect(draw_x, draw_y, size, size);
        }
    }
};
//------------------------------------------------------------------------------------------------------------
AMain_Scene.prototype.update = function(total_time, delta_time)
{
    // Reserved for future simulation step iterations (WASM/JS)
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default AMain_Scene;
//------------------------------------------------------------------------------------------------------------
