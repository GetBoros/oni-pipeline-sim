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
AScene_Test_Physics.prototype.Add_Floor = function (floor_offset_x, floor_offset_y, floor_width, floor_height)
{
  let center_x = floor_offset_x + (floor_width / 2);
  let center_y = floor_offset_y + (floor_height / 2);

  this.matter.add.rectangle(center_x, center_y, floor_width, floor_height, { isStatic: true } );
};
//------------------------------------------------------------------------------------------------------------
AScene_Test_Physics.prototype.Create_Level_Bounds = function()
{
  let wall_offset_x = 9;
  let wall_offset_y = 9;
  let wall_width = 50;

  this.Add_Wall(wall_offset_x, wall_offset_y, wall_width, window.innerHeight);
  this.Add_Wall(window.innerWidth - wall_width - wall_offset_x, wall_offset_y, wall_width, window.innerHeight);

  this.Add_Floor(9, window.innerHeight - 100, window.innerWidth - 18, 100);
};
//------------------------------------------------------------------------------------------------------------
AScene_Test_Physics.prototype.Create_Curve_Tunnel = function()
{
  let world_x = 0;
  let world_y = 0;
  let frame_index = 0;
  let banana_vertices = null;
  let banana_body = null;
  let banana_sprite = null;

  // 1.0. Set target placement position on the viewport
  world_x = window.innerWidth / 2;
  world_y = 200;
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
    restitution: 0.4
  });

  // 4.0. Create sprite and bind existing body (Phaser automatically aligns displayOrigin to body centroid)
  banana_sprite = this.matter.add.sprite(world_x, world_y, 'tileset_texture', frame_index);
  banana_sprite.setExistingBody(banana_body);
};
//------------------------------------------------------------------------------------------------------------
AScene_Test_Physics.prototype.create = function ()
{
  this.Create_Level_Bounds();
  this.Create_Curve_Tunnel();

  // // 4.0. Define right curved tunnel wall vertices
  // right_wall_vertices = [
  //   { x: screen_center_x - 40, y: 100 },
  //   { x: screen_center_x + 60, y: 250 },
  //   { x: screen_center_x - 40, y: 400 },
  //   { x: screen_center_x + 60, y: 500 },
  //   { x: screen_center_x + 60, y: 520 },
  //   { x: screen_center_x - 60, y: 400 },
  //   { x: screen_center_x + 40, y: 250 },
  //   { x: screen_center_x - 60, y: 100 }
  // ];

  // // 4.1. Register right wall static body
  // this.matter.add.fromVertices(screen_center_x, 310, right_wall_vertices, {
  //   isStatic: true
  // });

  // // 5.0. Create bottom static floor platform (Catches objects leaving the tunnel)
  // this.matter.add.rectangle(screen_center_x, viewport_height - 20, viewport_width - 60, 32, {
  //   isStatic: true,
  //   restitution: 0.5
  // });

  // // 5.1. Create left container boundary wall
  // this.matter.add.rectangle(30, viewport_height - 100, 20, 160, {
  //   isStatic: true
  // });

  // // 5.2. Create right container boundary wall
  // this.matter.add.rectangle(viewport_width - 30, viewport_height - 100, 20, 160, {
  //   isStatic: true
  // });

  // 2.0. Disable default browser context menu on right click
  this.input.mouse.disableContextMenu();
  // 6.0. Register mouse click input event listener
  this.input.on('pointerdown', this.Handle_Pointer_Down, this);
};
//------------------------------------------------------------------------------------------------------------
AScene_Test_Physics.prototype.Handle_Pointer_Down = function (pointer)
{
  let click_x = 0;
  let click_y = 0;
  let is_left_button = false;

  // 1.0. Extract input coordinates and button state
  click_x = pointer.x;
  click_y = pointer.y;
  is_left_button = (pointer.button === 0);

  // 2.0. Spawn dynamic ball on Left Mouse Button or static obstacle block on Right Mouse Button
  if (is_left_button)
  {
    this.matter.add.circle(click_x, click_y, 14, {
      restitution: 0.8,
      friction: 0.01
    });
  }
  else
  {
    this.matter.add.rectangle(click_x, click_y, 80, 18, {
      isStatic: true,
      angle: Math.PI / 6
    });
  }
};
//------------------------------------------------------------------------------------------------------------
AScene_Test_Physics.prototype.update = function (total_time, delta_time)
{
  // Reserved for per-frame physics inspection logic.
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default AScene_Test_Physics;
//------------------------------------------------------------------------------------------------------------