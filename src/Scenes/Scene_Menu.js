//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';
//------------------------------------------------------------------------------------------------------------
class AScene_Menu extends Phaser.Scene
{// Menu Scene. First level in the scene queue. Inherits from Phaser.Scene.

  constructor()
  {
    super(
    {
      key: 'Scene_Main'
    });
  }
}
//------------------------------------------------------------------------------------------------------------




// AScene_Menu
AScene_Menu.prototype.create = function()
{
  let self = this;

  // 1.0. Cache UI Container reference (Equivalent to UE5 UUserWidget reference)
  this.UI_Container = null;

  // 2.0. Render Scene UI Elements
  this.Setup_User_Interface();

  // 3.0. Bind viewport resize event
  this.scale.on('resize', function(game_size)
  {
    self.Align_User_Interface(game_size.width, game_size.height);
  });
};
//------------------------------------------------------------------------------------------------------------
AScene_Menu.prototype.Setup_User_Interface = function()
{
  let self = this;
  let text_style = null;
  let title_text = null;
  let play_button = null;

  // 1.0. Configure base style configurations
  text_style =
  {
    fontSize: '48px',
    fill: '#ffffff',
    fontFamily: 'Bitcount Single'
  };

  // 2.0. Allocate UI Container (Zero coordinates, will be managed by Align method)
  this.UI_Container = this.add.container(0, 0);

  // 3.0. Allocate Title Text at relative top position inside Container bounds
  title_text = this.add.text(0, -80, 'ONI PIPELINE SIMULATOR', text_style);
  title_text.setOrigin(0.5);

  // 4.0. Allocate Play Button at relative bottom position inside Container bounds
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

  play_button = this.add.text(0, 80, 'BEGIN PLAY', text_style);
  play_button.setOrigin(0.5);
  play_button.setInteractive();

  // 4.1. Bind pointer hover effects (Visual response)
  play_button.on('pointerover', function()
  {
    play_button.setStyle(
    {
      fill: '#ffcc00'
    });
  });

  play_button.on('pointerout', function()
  {
    play_button.setStyle(
    {
      fill: '#00ff00'
    });
  });

  // 4.2. Transition to Main_Scene on click (Equivalent to OpenLevel)
  play_button.on('pointerdown', function()
  {
    self.scene.start('Main_Scene');
  });

  // 5.0. Pack GameObjects into the UI Container
  this.UI_Container.add(
  [
    title_text,
    play_button
  ]);

  // 6.0. Trigger initial layout align calculations
  this.Align_User_Interface(this.scale.width, this.scale.height);
};
//------------------------------------------------------------------------------------------------------------
AScene_Menu.prototype.Align_User_Interface = function(width, height)
{
  let ui_scale = 1.0;
  let reference_width = 800.0;

  // 1.0. Sync WebGL Camera viewport dimensions with the new Canvas size
  this.cameras.main.setSize(width, height);

  // 2.0. Calculate a uniform UI Scale Factor based on reference width
  ui_scale = width / reference_width;

  // 2.1. Establish clamp bounds (DPI Scale Curve)
  if (ui_scale > 1.0)
  {
    ui_scale = 1.0;
  }
  else if (ui_scale < 0.4)
  {
    ui_scale = 0.4;
  }

  // 3.0. Position the Parent Container in the center of the screen
  this.UI_Container.setPosition(width * 0.5, height * 0.5);

  // 3.1. Apply scale globally to the container (All child scaling scales automatically)
  this.UI_Container.setScale(ui_scale);
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default AScene_Menu;
//------------------------------------------------------------------------------------------------------------