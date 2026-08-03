//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';
//------------------------------------------------------------------------------------------------------------




// AScene_Test
class AScene_Test extends Phaser.Scene
{// Test scene for Matter.js physics with tunnel walls, static floor container, and interactive spawning.

  constructor()
  {
    super({
      key: 'Scene_Test',
      physics:
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




// AScene_Test
AScene_Test.prototype.Add_Wall = function(wall_offset_x, wall_offset_y, wall_width, wall_height)
{
  let center_x = wall_offset_x + (wall_width / 2);
  let center_y = wall_offset_y + (wall_height / 2);

  this.matter.add.rectangle(center_x, center_y, wall_width, wall_height, { isStatic: true } );
};
//------------------------------------------------------------------------------------------------------------
AScene_Test.prototype.Add_Floor = function (floor_offset_x, floor_offset_y, floor_width, floor_height)
{
  let center_x = floor_offset_x + (floor_width / 2);
  let center_y = floor_offset_y + (floor_height / 2);

  this.matter.add.rectangle(center_x, center_y, floor_width, floor_height, { isStatic: true } );
};
//------------------------------------------------------------------------------------------------------------
AScene_Test.prototype.create = function ()
{
  let wall_offset_x = 9;
  let wall_offset_y = 9;
  let wall_width = 50;

  this.Add_Wall(wall_offset_x, wall_offset_y, wall_width, window.innerHeight);
  this.Add_Wall(window.innerWidth - wall_width - wall_offset_x, wall_offset_y, wall_width, window.innerHeight);

  this.Add_Floor(9, window.innerHeight - 100, window.innerWidth - 18, 100);

  // let screen_center_x = 0;
  // let screen_center_y = 0;
  // let viewport_width = 0;
  // let viewport_height = 0;
  // let left_wall_vertices = null;
  // let right_wall_vertices = null;

  // // 1.0. Determine viewport layout parameters
  // viewport_width = this.cameras.main.width;
  // viewport_height = this.cameras.main.height;
  // screen_center_x = viewport_width / 2;
  // screen_center_y = viewport_height / 2;


  // // 3.0. Define left curved tunnel wall vertices
  // left_wall_vertices = [
  //   { x: screen_center_x - 120, y: 100 },
  //   { x: screen_center_x - 20, y: 250 },
  //   { x: screen_center_x - 120, y: 400 },
  //   { x: screen_center_x - 20, y: 500 },
  //   { x: screen_center_x - 20, y: 520 },
  //   { x: screen_center_x - 140, y: 400 },
  //   { x: screen_center_x - 40, y: 250 },
  //   { x: screen_center_x - 140, y: 100 }
  // ];

  // // 3.1. Register left wall static body
  // this.matter.add.fromVertices(screen_center_x - 80, 310, left_wall_vertices, {
  //   isStatic: true
  // });

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
AScene_Test.prototype.Handle_Pointer_Down = function (pointer)
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
AScene_Test.prototype.update = function (total_time, delta_time)
{
  // Reserved for per-frame physics inspection logic.
};
//------------------------------------------------------------------------------------------------------------




export default AScene_Test;
//------------------------------------------------------------------------------------------------------------