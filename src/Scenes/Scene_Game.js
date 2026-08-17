//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
class AScene_Game extends Phaser.Scene
{
    constructor()
    {
        super( { key: 'Scene_Game' } );
    }
}
//------------------------------------------------------------------------------------------------------------
class AScene_Game_Clicker extends Phaser.Scene
{// Responsive UI scene with dynamic camera viewport adjustments.

    constructor()
    {
        super({ key: 'Scene_Game_Clicker' });

        // UI Anchored Containers:
        this.Left_Panel_Container = null;
        this.Right_Panel_Container = null;

        // UI Elements:
        this.Portrait_Frame = null;
        this.Portrait_Text = null;
        this.Debug_Res_Text = null;

        this.Click_Counter = 0;
    }
}
//------------------------------------------------------------------------------------------------------------



// AScene_Game
AScene_Game.prototype.create = function()
{
    this.scene.add('Scene_Game_Clicker', AScene_Game_Clicker, true);
    this.cameras.main.setBackgroundColor('rgba(0, 255, 0, 0.5)')
};
//------------------------------------------------------------------------------------------------------------
AScene_Game.prototype.On_Pointer_Down = function()
{
};
//------------------------------------------------------------------------------------------------------------




// AScene_Game_Clicker
AScene_Game_Clicker.prototype.create = function ()
{
    let init_w = 0;
    let init_h = 0;

    init_w = this.scale.width;
    init_h = this.scale.height;

    // 1.0. Set transparent overlay background:
    this.cameras.main.setBackgroundColor('rgba(0, 0, 255, 0.2)');

    // 2.0. Create Left UI Container:
    this.Left_Panel_Container = this.add.container(0, 0);

    // 2.1. Create Portrait Frame:
    this.Portrait_Frame = this.add.rectangle(0, 0, 140, 180, 0x00ff00);
    this.Portrait_Frame.setInteractive({ useHandCursor: true });
    this.Portrait_Frame.on('pointerdown', this.On_Portrait_Clicked, this);

    // 2.2. Create Portrait Label:
    this.Portrait_Text = this.add.text(0, -70, 'Portrait', { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5);
    this.Left_Panel_Container.add([this.Portrait_Frame, this.Portrait_Text]);

    // 3.0. Create Right UI Container:
    this.Right_Panel_Container = this.add.container(0, 0);

    // 3.1. Create Debug Text:
    this.Debug_Res_Text = this.add.text(0, 0, '', { fontSize: '16px', color: '#ffff00', align: 'right' }).setOrigin(1, 0);
    this.Right_Panel_Container.add(this.Debug_Res_Text);

    // 4.0. Initial Layout Update:
    this.Update_Layout(init_w, init_h);

    // 5.0. Register Window Resize and Screen Rotation Listener:
    this.scale.on('resize', this.On_Window_Resize, this);

    this.input.mouse.disableContextMenu();
};
//------------------------------------------------------------------------------------------------------------
AScene_Game_Clicker.prototype.On_Window_Resize = function (game_size)
{
    let new_w = 0;
    let new_h = 0;

    new_w = game_size.width;
    new_h = game_size.height;

    // Recalculate camera and container anchors when screen resizes or rotates:
    this.Update_Layout(new_w, new_h);
};
//------------------------------------------------------------------------------------------------------------
AScene_Game_Clicker.prototype.Update_Layout = function (screen_width, screen_height)
{
    let padding = 20;
    let left_anchor_x = 90;
    let left_anchor_y = screen_height / 2;

    // 1.0. DYNAMICALLY RESIZE CAMERA VIEWPORT TO MATCH SCREEN:
    this.cameras.main.setViewport(0, 0, screen_width, screen_height);

    // 2.0. Reposition Left Anchor Container:
    if (this.Left_Panel_Container)
    {
        this.Left_Panel_Container.setPosition(left_anchor_x, left_anchor_y);
    }

    // 3.0. Reposition Right Anchor Container:
    if (this.Right_Panel_Container)
    {
        this.Right_Panel_Container.setPosition(screen_width - padding, padding);
    }

    // 4.0. Update Debug Text:
    if (this.Debug_Res_Text)
    {
        this.Debug_Res_Text.setText(
            `Screen: ${screen_width} x ${screen_height}\n` +
            `Orientation: ${screen_width > screen_height ? 'LANDSCAPE' : 'PORTRAIT'}\n` +
            `Clicks: ${this.Click_Counter}`
        );
    }
};
//------------------------------------------------------------------------------------------------------------
AScene_Game_Clicker.prototype.On_Portrait_Clicked = function ()
{
    this.Click_Counter++;
    this.Update_Layout(this.scale.width, this.scale.height);
};
//------------------------------------------------------------------------------------------------------------



//------------------------------------------------------------------------------------------------------------
export default AScene_Game;
//------------------------------------------------------------------------------------------------------------
