//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';
//------------------------------------------------------------------------------------------------------------




// AScene_Test_Physics
class AScene_Test_Physics extends Phaser.Scene
{// Test scene for Matter.js physics with tunnel walls, static floor container, and interactive spawning.

  constructor()
  {
    super({
      key: 'Scene_Test_Physics',
      physics:  // Need to enable matter physics
      {
        matter:
        {
          gravity: { x: 0, y: 1 },
          debug: true
        }
      }
    });
  }
}
//------------------------------------------------------------------------------------------------------------




// AScene_Test_Physics
AScene_Test_Physics.prototype.preload = function ()
{
  // 1.0. Load tileset spritesheet with explicit 64x64 frame dimensions
  this.load.spritesheet('tileset_texture', 'assets/tileset.png', {
    frameWidth: 64,
    frameHeight: 64
  });
};
//------------------------------------------------------------------------------------------------------------
AScene_Test_Physics.prototype.Add_Wall = function(wall_offset_x, wall_offset_y, wall_width, wall_height)
{
  let center_x = wall_offset_x + (wall_width / 2);
  let center_y = wall_offset_y + (wall_height / 2);

  this.matter.add.rectangle(center_x, center_y, wall_width, wall_height, { isStatic: true } );
};
//------------------------------------------------------------------------------------------------------------
AScene_Test_Physics.prototype.Create_Level_Bounds = function()
{
  let wall_offset_x = 9;
  let wall_offset_y = 9;
  let wall_width = 50;

  this.Add_Wall(wall_offset_x, wall_offset_y, wall_width, window.innerHeight);
  this.Add_Wall(window.innerWidth - wall_width - wall_offset_x, wall_offset_y, wall_width, window.innerHeight);

  this.Add_Wall(9, window.innerHeight - 100, window.innerWidth - 18, 100);
};
//------------------------------------------------------------------------------------------------------------
AScene_Test_Physics.prototype.Spawn_Banan = function(world_x, world_y)
{
  let frame_index;
  let banana_vertices;
  let banana_body;
  let banana_sprite;

  // 1.0. Set target placement position on the viewport
  frame_index = 4;

  // 2.0. Pass raw GIMP 64x64 coordinates DIRECTLY from top-left (0, 0) - NO MANUAL SUBTRACTION!
  banana_vertices = [
    { x: 14, y: 20 },  // 1. Top-Left tip
    { x: 32, y: 29 },  // 2. Inner-Center curve
    { x: 48, y: 22 },  // 3. Top-Right tip
    { x: 40, y: 36 },  // 4. Outer Bottom-Right
    { x: 19, y: 34 }   // 5. Outer Bottom-Left
  ];

  // 3.0. Create pure Matter physics body (Matter.js calculates centroid automatically)
  banana_body = this.matter.bodies.fromVertices(world_x, world_y, banana_vertices, {
    isStatic: false,
    restitution: 0.25,  // Low bounciness (realistic soft organic impact)
    friction: 0.4,  // Realistic skin-to-floor surface friction
    frictionAir: 0.01,  // Normal atmospheric drag
    density: 0.02  // Typical organic fruit density
  });

  // 4.0. Create sprite and bind existing body (Phaser automatically aligns displayOrigin to body centroid)
  banana_sprite = this.matter.add.sprite(world_x, world_y, 'tileset_texture', frame_index);
  banana_sprite.setExistingBody(banana_body);
};
//------------------------------------------------------------------------------------------------------------
AScene_Test_Physics.prototype.create = function ()
{
  this.Create_Level_Bounds();
  this.Spawn_Banan(window.innerWidth / 2, 200);

  // 1.0. Disable default browser context menu on right click
  this.input.mouse.disableContextMenu();

  // 2.0. Register and launch parallel UI Overlay Scene dynamically
  if (this.scene.get('Scene_Portrait_UI') != true)
    this.scene.add('Scene_Portrait_UI', AScene_Portrait_UI, true);
  else
    this.scene.launch('Scene_Portrait_UI');

  // 3.0. Register mouse click input event listener
  this.input.on('pointerdown', (event_click) =>
  { 
    if (event_click.button === 0)  // if LKM - true, other false
      this.Spawn_Banan(event_click.x, event_click.y)
  } );
};
//------------------------------------------------------------------------------------------------------------
AScene_Test_Physics.prototype.update = function (total_time, delta_time)
{

};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
// AScene_Portrait_UI
class AScene_Portrait_UI extends Phaser.Scene
{// UI overlay scene for player portrait, popups, and HUD controls.

  constructor()
  {
    super(
      {
        key: 'Scene_Portrait_UI'
      });
  }
}
//------------------------------------------------------------------------------------------------------------
AScene_Portrait_UI.prototype.create = function ()
{
  let panel_width = 0;
  let panel_height = 0;
  let pos_x = 0;
  let pos_y = 0;
  let gfx = null;
  let label_text = null;

  // 1.0. Set fixed HUD dimensions
  panel_width = 100;
  panel_height = 100;

  // 2.0. Calculate top-right position with offset
  pos_x = window.innerWidth - panel_width - 20;
  pos_y = 20;

  // 3.0. Draw background container and border outline
  gfx = this.add.graphics();

  // 3.1. Fill background frame (dark grey)
  gfx.fillStyle(0x222222, 0.95);
  gfx.fillRect(pos_x, pos_y, panel_width, panel_height);

  // 3.2. Stroke border rectangle with black color
  gfx.lineStyle(3, 0x000000, 1.0);
  gfx.strokeRect(pos_x, pos_y, panel_width, panel_height);

  // 4.0. Add inner descriptive text overlay
  label_text = this.add.text(pos_x + 5, pos_y + 10, 'Эта сцена\nповерх\nдругой сцены',
    {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#00ffcc',
      align: 'center',
      wordWrap:
      {
        width: panel_width - 10
      }
    });
};
//------------------------------------------------------------------------------------------------------------
AScene_Portrait_UI.prototype.update = function (total_time, delta_time)
{

};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default AScene_Test_Physics;
//------------------------------------------------------------------------------------------------------------