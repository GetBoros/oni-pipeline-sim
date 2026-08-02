//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';
//------------------------------------------------------------------------------------------------------------
class AScene_Test extends Phaser.Scene
{// Test Scene. Inherits from Phaser.Scene.

  constructor()
  {
    super(
    {
      key: 'Scene_Test'
    });
  }
}
//------------------------------------------------------------------------------------------------------------



// AScene_Test
AScene_Test.prototype.create = function ()
{
  let screen_center_x = 0;
  let square_width = 0;
  let square_height = 0;
  let falling_square = null;
  let static_ground = null;

  // 1.0. Determine viewport layout parameters
  screen_center_x = this.cameras.main.width / 2;
  square_width = 64;
  square_height = 64;

  // 2.0. Instantiate primitive dynamic actor (UE5 AActor + Rigid Body Component)
  falling_square = this.add.rectangle(screen_center_x, 100, square_width, square_height, 0x00ff00);
  this.physics.add.existing(falling_square, false);

  // 2.1. Apply dynamic body parameters (Gravity, Bouncing, Viewport boundary limits)
  falling_square.body.setCollideWorldBounds(true);
  falling_square.body.setBounce(0.4, 0.4);

  // 3.0. Instantiate static platform actor (UE5 AActor + Static Collision Component)
  static_ground = this.add.rectangle(screen_center_x, 500, 600, 32, 0x888888);
  this.physics.add.existing(static_ground, true);

  // 4.0. Register collision constraint inside physics subsystem
  this.physics.add.collider(falling_square, static_ground);
};
//------------------------------------------------------------------------------------------------------------
AScene_Test.prototype.update = function (total_time, delta_time)
{
  // Reserved for per-frame physics inspection logic.
};
//------------------------------------------------------------------------------------------------------------



//------------------------------------------------------------------------------------------------------------
export default AScene_Test;
//------------------------------------------------------------------------------------------------------------