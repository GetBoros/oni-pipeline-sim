//------------------------------------------------------------------------------------------------------------
import Phaser from "phaser";
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
class AProgress_Bar_Container extends Phaser.GameObjects.Container
{
    constructor(scene, width, height, background_color, fill_color)
    {
        super(scene, 0, 0);

        this.Bar_Width = width || 200;  // 200 is default
        this.Bar_Height = height || 20;  // 20 is default
        this.Progress_Current = 0.0;

        this.Scene = scene;
        this.Color_Background = background_color || 0x222222;  // #222222
        this.Color_Fill = fill_color || 0x00ffcc;  // #00ffcc
        this.Rect_Background = null;
        this.Rect_Fill = null;

        this.Create_Visuals();  // Initialize visual components

        this.Scene.add.existing(this);  // Add container to scene hierarchy
    }
}
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
// AProgress_Bar_Container
AProgress_Bar_Container.prototype.Create_Visuals = function()
{
    let half_width;
    let half_height;

    half_width = this.Bar_Width / 2;
    half_height = this.Bar_Height / 2;

    // 1.0. Create background track rectangle
    this.Rect_Background = this.Scene.add.rectangle(0, 0, this.Bar_Width, this.Bar_Height, this.Color_Background);
    this.Rect_Background.setOrigin(0, 0.5);  // Set origin to the left-center (0, 0.5) so scaling expands from left to right.
    this.Rect_Background.x = -half_width;  // Shift left by half width to center the rect relative to the container's local orgn
    this.add(this.Rect_Background);

    // 2.0. Create fill bar rectangle
    this.Rect_Fill = this.Scene.add.rectangle(0, 0, this.Bar_Width, this.Bar_Height, this.Color_Fill);
    this.Rect_Fill.setOrigin(0, 0.5);
    this.Rect_Fill.x = -half_width;
    this.Rect_Fill.scaleX = 0.0;  // Initialize at zero progress
    this.add(this.Rect_Fill);
};
//------------------------------------------------------------------------------------------------------------
AProgress_Bar_Container.prototype.Set_Progress = function(progress_value)
{
    this.Progress_Current = Math.max(0.0, Math.min(1.0, progress_value) );  //  Clamp ratio safely between 0.0 and 1.0
    this.Rect_Fill.scaleX = this.Progress_Current;  // Update visual fill width via GPU-accelerated horizontal scaling
};
//------------------------------------------------------------------------------------------------------------
AProgress_Bar_Container.prototype.Update_Layout = function(pos_x, pos_y)  // Set position
{
    this.setPosition(pos_x, pos_y);
};
//------------------------------------------------------------------------------------------------------------





//------------------------------------------------------------------------------------------------------------
export default AProgress_Bar_Container;
//------------------------------------------------------------------------------------------------------------
