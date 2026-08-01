//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
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
AScene_Test.prototype.preload = function ()
{
    // Upload out spritesheet, splitting it into frames of 256x256 px
    this.load.spritesheet('arm_spritesheet', 'assets/arm_spritesheet.png', { frameWidth: 256, frameHeight: 256 });
};
//------------------------------------------------------------------------------------------------------------
AScene_Test.prototype.create = function ()
{
    const { width, height } = this.scale;

    // Create a sprite, but do NOT start automatic animation play()
    const sprite_arm = this.add.sprite(width / 2, height / 2, 'arm_spritesheet', 0);

    this.add.text(20, 20, 'Move mouse left/right to bend bicep',  // Text instruction
    {
        fontSize: '18px',
        color: '#ffffff'
    });

    this.input.on('pointermove', (pointer) =>
    {// Binding the frame (from 0 to 59) to the X coordinate of the mouse!
        
        const progress = Phaser.Math.Clamp(pointer.x / width, 0, 1);  // Normalize mouse position by width
        const frameIndex = Math.floor(progress * 59);  // Get the frame index based on mouse position (0-59)

        sprite_arm.setFrame(frameIndex);  // Set the sprite to the corresponding frame
    });
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default AScene_Test;
//------------------------------------------------------------------------------------------------------------




// HELP
/**
// CMD Line
montage -background none -mode concatenate -tile 10x6 /tmp/arm_frames/*.png /home/get_boros/Projects_CPP/oni-pipeline-sim/public/assets/arm_spritesheet.png
file /home/get_boros/Projects_CPP/oni-pipeline-sim/public/assets/arm_spritesheet.png
ls -lh /home/get_boros/Projects_CPP/oni-pipeline-sim/public/assets/arm_spritesheet.png
*/
//------------------------------------------------------------------------------------------------------------