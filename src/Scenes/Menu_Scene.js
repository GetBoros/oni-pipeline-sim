//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';
//------------------------------------------------------------------------------------------------------------
class AMenu_Scene extends Phaser.Scene
{// Menu Scene. First level in the scene queue. Inherits from Phaser.Scene.

  constructor()
  {
    super(
    {
      key: 'MenuScene'
    });
  }
}
//------------------------------------------------------------------------------------------------------------




// AMenu_Scene
AMenu_Scene.prototype.create = function()
{
  let self = this;

  // 1.0. Cache UI references on Scene instance to prevent GC allocation in resize handlers
  this.Title_Text = null;
  this.Play_Button = null;

  // 2.0. Render Scene UI Elements
  this.Setup_User_Interface();

  // 3.0. Bind viewport resize event (Equivalent to UE5 viewport resized delegates)
  this.scale.on('resize', function(game_size)
  {
    self.Align_User_Interface(game_size.width, game_size.height);
  });
};
//------------------------------------------------------------------------------------------------------------
AMenu_Scene.prototype.Setup_User_Interface = function()
{
  let self = this;
  let text_style = null;

  // 1.0. Configure base style configurations
  text_style =
  {
    fontSize: '48px',
    fill: '#ffffff',
    fontFamily: 'Bitcount Single'
  };

  // 2.0. Allocate UI GameObjects (Default coordinates are 0, will be instantly repositioned)
  this.Title_Text = this.add.text(0, 0, 'ONI PIPELINE SIMULATOR', text_style);
  this.Title_Text.setOrigin(0.5);

  // 3.0. Allocate Play Button
  text_style =
  {
    fontSize: '32px',
    fill: '#00ff00',
    fontFamily: 'Bitcount Single',
    backgroundColor: '#2d2d2d',
    padding:
    {
      x: 20,
      y: 10
    }
  };

  this.Play_Button = this.add.text(0, 0, 'BEGIN PLAY', text_style);
  this.Play_Button.setOrigin(0.5);
  this.Play_Button.setInteractive();

  // 3.1. Bind pointer hover effects (Visual response)
  this.Play_Button.on('pointerover', function()
  {
    self.Play_Button.setStyle(
    {
      fill: '#ffcc00'
    });
  });

  this.Play_Button.on('pointerout', function()
  {
    self.Play_Button.setStyle(
    {
      fill: '#00ff00'
    });
  });

  // 3.2. Transition to MainScene on click (Equivalent to OpenLevel)
  this.Play_Button.on('pointerdown', function()
  {
    self.scene.start('MainScene');
  });

  // 4.0. Trigger initial layout align calculations
  this.Align_User_Interface(this.scale.width, this.scale.height);
};
//------------------------------------------------------------------------------------------------------------
AMenu_Scene.prototype.Align_User_Interface = function(width, height)
{
  let ui_scale = 1.0;
  let reference_width = 800.0;

  // 1.0. Sync the WebGL Camera viewport dimensions with the new Canvas size
  this.cameras.main.setSize(width, height);

  // 2.0. Calculate a uniform UI Scale Factor based on reference width
  ui_scale = width / reference_width;

  // 2.1. Establish clamp bounds to prevent UI from becoming infinitesimally small or oversized
  if (ui_scale > 1.0)
  {
    ui_scale = 1.0;
  }
  else if (ui_scale < 0.4)
  {
    ui_scale = 0.4;
  }

  // 3.0. Anchor and scale Title Text: Horizontal Center, Top 35% of viewport
  this.Title_Text.setPosition(width * 0.5, height * 0.35);
  this.Title_Text.setScale(ui_scale);

  // 4.0. Anchor and scale Play Button: Horizontal Center, Bottom 60% of viewport
  this.Play_Button.setPosition(width * 0.5, height * 0.6);
  this.Play_Button.setScale(ui_scale);
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default AMenu_Scene;
//------------------------------------------------------------------------------------------------------------