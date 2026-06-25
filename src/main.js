//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';
//------------------------------------------------------------------------------------------------------------
function Assert_Grid_Concept(grid_obj)
{
  // 1.0. Runtime Concept Verification (Mimicking C++20 standard requirements)
  if (grid_obj instanceof AGrid_System === false)
  {
    throw new TypeError('Concept constraint violation: Input must inherit from AGrid_System.');
  }

  if (typeof grid_obj.Initialize_Grid !== 'function' || typeof grid_obj.Get_Cell !== 'function')
  {
    throw new TypeError('Concept constraint violation: Object does not implement correct grid API.');
  }
}
//------------------------------------------------------------------------------------------------------------
class AGrid_System
{
  constructor()
  {
    this.Grid_Width = 0;
    this.Grid_Height = 0;
    this.Tile_Size = 0;
    this.Types_Array = null;
  }
}
//------------------------------------------------------------------------------------------------------------
class AMenu_Scene extends Phaser.Scene
{
  constructor()
  {
    super(
      {
        key: 'MenuScene'
      });
  }
}
//------------------------------------------------------------------------------------------------------------
class AMain_Scene extends Phaser.Scene
{
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




// AGrid_System Methods
AGrid_System.prototype.Initialize_Grid = function (width, height, tile_size)
{
  let array_size = 0;

  // 1.0. Set dimensions
  this.Grid_Width = width;
  this.Grid_Height = height;
  this.Tile_Size = tile_size;

  // 2.0. Allocate contiguous memory block (mimicking C++ heap allocation)
  array_size = this.Grid_Width * this.Grid_Height;
  this.Types_Array = new Int32Array(array_size);
};
//------------------------------------------------------------------------------------------------------------
AGrid_System.prototype.Get_Index = function (x_coord, y_coord)
{
  let index = 0;

  // 1.0. Convert 2D coordinates to 1D flat index
  index = (y_coord * this.Grid_Width) + x_coord;

  return index;
};
//------------------------------------------------------------------------------------------------------------
AGrid_System.prototype.Set_Cell = function (x_coord, y_coord, type_id)
{
  let target_index = 0;

  // 1.0. Calculate flat index
  target_index = this.Get_Index(x_coord, y_coord);

  // 2.0. Safe memory write
  this.Types_Array[target_index] = type_id;
};
//------------------------------------------------------------------------------------------------------------
AGrid_System.prototype.Get_Cell = function (x_coord, y_coord)
{
  let target_index = 0;

  // 1.0. Calculate flat index
  target_index = this.Get_Index(x_coord, y_coord);

  return this.Types_Array[target_index];
};
//------------------------------------------------------------------------------------------------------------




// AMenu_Scene Methods
AMenu_Scene.prototype.create = function()
{
  let play_button = null;
  let title_text = null;

  // 1.0. Render text using loaded font (Equivalent to designing a title in UMG)
  title_text = this.add.text(400, 200, 'ONI PIPELINE SIMULATOR',
    {
      fontSize: '48px',
      fill: '#ffffff',
      fontFamily: 'Bitcount Single'
    }).setOrigin(0.5);

  // 2.0. Setup visual Play Button container
  play_button = this.add.text(400, 360, 'BEGIN PLAY',
    {
      fontSize: '32px',
      fill: '#00ff00',
      fontFamily: 'Bitcount Single',
      backgroundColor: '#2d2d2d',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

  // 2.1. Make the text object interactive (Enables input pipeline)
  play_button.setInteractive();

  // 2.2. Bind pointer hover effects (Visual response)
  play_button.on('pointerover', function()
  {
    play_button.setStyle( { fill: '#ffcc00' } );
  });

  play_button.on('pointerout', function()
  {
    play_button.setStyle( { fill: '#00ff00' } );
  });

  // 2.3. Transition to MainScene on click (Equivalent to OpenLevel)
  play_button.on('pointerdown', ()=>
  {
    this.scene.start('MainScene');
  });
};
//------------------------------------------------------------------------------------------------------------




// AMain_Scene Methods
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
AMain_Scene.prototype.update = function (total_time, delta_time)
{
  // Reserved for future simulation step iterations (WASM/JS)
};
//------------------------------------------------------------------------------------------------------------




// Game_Config
const Game_Config =
{
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  parent: 'game-container',
  fps:
  {
    target: 24,
    forceSetTimeOut: true
  },
  scene: [AMenu_Scene, AMain_Scene]
};
//------------------------------------------------------------------------------------------------------------




// Game_Instance
document.fonts.ready.then(function()
{
  const Game_Instance = new Phaser.Game(Game_Config);
});
//------------------------------------------------------------------------------------------------------------