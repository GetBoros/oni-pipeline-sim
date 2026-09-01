//------------------------------------------------------------------------------------------------------------
import Phaser from "phaser";

import AProgress_Bar_Container from './Progress_Bar_Container';
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
class APortrait_Container extends Phaser.GameObjects.Container
{// !!! Need make refactoring

    constructor(scene)
    {
        super(scene, 0, 0);  // set initial object position but need update

        this.Click_Counter = 0;
        this.Portrait_Frame = null;
        this.Portrait_Text = null;
        this.Stress_Bar = null;  // Nested progress bar component

        this.Initialize_Widget();  // Initialize inner widget elements:

        scene.add.existing(this);
    }
}
//------------------------------------------------------------------------------------------------------------




// APortrait_Container
APortrait_Container.prototype.Initialize_Widget = function()
{
    let bar_local_y = 0;

    bar_local_y = 70;  // Local offset from portrait center (frame height is 180, so half is 90)

    // 1.0. Create portrait background frame
    this.Portrait_Frame = this.scene.add.rectangle(0, 0, 140, 180, 0x00ff80);  // #00ff80
    this.Portrait_Frame.setInteractive();
    this.Portrait_Frame.on('pointerdown', this.On_Frame_Clicked, this);

    // 2.0. Create counter text label
    this.Portrait_Text = this.scene.add.text(0, -70, 'Portrait: 0', { fontSize: '16px', color: '#ff0000' } ).setOrigin(0.5);

    // 3.0. Create nested progress bar (e.g., Stress or Oxygen bar) inside the portrait container
    this.Stress_Bar = new AProgress_Bar_Container(this.scene, 120, 12, 0x11161d, 0xff3344);
    this.Stress_Bar.setPosition(0, bar_local_y);  // Position relative to portrait center (0,0)
    this.Stress_Bar.Set_Progress(0.75);          // Initial test progress value (75%)

    // 4.0. Register all elements into the container hierarchy
    this.add([this.Portrait_Frame, this.Portrait_Text, this.Stress_Bar]);
};
//------------------------------------------------------------------------------------------------------------
APortrait_Container.prototype.On_Frame_Clicked = function()
{
    let current_progress = 0.0;

    this.Click_Counter++;
    this.Portrait_Text.setText(`Portrait: ${this.Click_Counter}`);

    // Test feature: change progress bar value on click (e.g., simulating stress accumulation)
    current_progress = (this.Click_Counter % 5) * 0.25;
    this.Stress_Bar.Set_Progress(current_progress);
};
//------------------------------------------------------------------------------------------------------------
APortrait_Container.prototype.Update_Layout = function(padding_x, anchor_y)
{
    // When parent scene shifts this container, the nested progress bar moves automatically with it!
    this.setPosition(padding_x + this.Portrait_Frame.width / 2, anchor_y);
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default APortrait_Container;
//------------------------------------------------------------------------------------------------------------