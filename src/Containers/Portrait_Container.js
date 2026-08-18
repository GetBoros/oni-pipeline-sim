//------------------------------------------------------------------------------------------------------------
import Phaser from "phaser";
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
class APortrait_Container extends Phaser.GameObjects.Container
{
    constructor(scene, x, y)
    {
        super(scene, x, y);

        scene.add.existing(this);

        this.Click_Counter = 0;
        this.Portrait_Frame = null;
        this.Portrait_Text = null;

        this.Initialize_Widget();  // Initialize inner widget elements:
    }
}
//------------------------------------------------------------------------------------------------------------




// APortrait_Container
APortrait_Container.prototype.Initialize_Widget = function()
{
    this.Portrait_Frame = this.scene.add.rectangle(0, 0, 140, 180, 0x00ff00);
    this.Portrait_Frame.setInteractive();
    this.Portrait_Frame.on('pointdown', this.On_Frame_Clicked, this);

    this.Portrait_Text = this.scene.add.text(0, -70, 'Portrait: 0', { fontSize: '16px', color: '#ff0000'} ).setOrigin(0.5);

    this.add([this.Portrait_Frame, this.Portrait_Text]);

};
//------------------------------------------------------------------------------------------------------------
APortrait_Container.prototype.On_Frame_Clicked = function()
{
    this.Click_Counter++;
    
    this.Portrait_Text.setText(`Portrait: ${this.Click_Counter}`);
};
//------------------------------------------------------------------------------------------------------------
APortrait_Container.prototype.Update_Layout = function(padding_x, anchor_y)
{
    this.setPosition(padding_x + this.Portrait_Frame.width / 2, anchor_y);
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default APortrait_Container;
//------------------------------------------------------------------------------------------------------------
