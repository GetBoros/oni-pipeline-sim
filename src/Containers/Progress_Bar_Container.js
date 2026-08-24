//------------------------------------------------------------------------------------------------------------
import Phaser from "phaser";
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
class AProgress_Bar_Container extends Phaser.GameObjects.Container
{
    constructor(scene, width, height, background_color, fill_color)
    {
        super(scene, 0, 0);

        this.Scene_Ref = scene;
        this.Bar_Width = width || 200;
        this.Bar_Height = height || 20;
        this.Background_Color = background_color || 0x222222;
        this.Fill_Color = fill_color || 0x00ffcc;

        this.Background_Rect = null;
        this.Fill_Rect = null;
        this.Current_Progress = 0.0;

        // 1.0. Initialize visual components
        this.Create_Visuals();

        // 2.0. Add container to scene hierarchy
        scene.add.existing(this);
    }
}
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
// AProgress_Bar_Container
AProgress_Bar_Container.prototype.Create_Visuals = function ()
{
    let half_width = 0;
    let half_height = 0;

    half_width = this.Bar_Width / 2;
    half_height = this.Bar_Height / 2;

    // 1.0. Create background track rectangle
    this.Background_Rect = this.Scene_Ref.add.rectangle(0, 0, this.Bar_Width, this.Bar_Height, this.Background_Color);
    this.Background_Rect.setOrigin(0, 0.5);
    this.Background_Rect.x = -half_width;
    this.add(this.Background_Rect);

    // 2.0. Create fill bar rectangle
    this.Fill_Rect = this.Scene_Ref.add.rectangle(0, 0, this.Bar_Width, this.Bar_Height, this.Fill_Color);
    this.Fill_Rect.setOrigin(0, 0.5);
    this.Fill_Rect.x = -half_width;
    this.Fill_Rect.scaleX = 0.0;  // Initialize at zero progress
    this.add(this.Fill_Rect);
};
//------------------------------------------------------------------------------------------------------------
AProgress_Bar_Container.prototype.Set_Progress = function (progress_value)
{
    let clamped_value = 0.0;

    // 1.0. Clamp ratio safely between 0.0 and 1.0
    clamped_value = Math.max(0.0, Math.min(1.0, progress_value));
    this.Current_Progress = clamped_value;

    // 2.0. Update visual fill width via GPU-accelerated horizontal scaling
    this.Fill_Rect.scaleX = this.Current_Progress;
};
//------------------------------------------------------------------------------------------------------------
AProgress_Bar_Container.prototype.Update_Layout = function (pos_x, pos_y)
{
    this.setPosition(pos_x, pos_y);
};
//------------------------------------------------------------------------------------------------------------





//------------------------------------------------------------------------------------------------------------
export default AProgress_Bar_Container;
//------------------------------------------------------------------------------------------------------------
