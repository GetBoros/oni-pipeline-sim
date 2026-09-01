//------------------------------------------------------------------------------------------------------------
import Phaser from "phaser";
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
class ADebug_Container extends Phaser.GameObjects.Container
{
    constructor(scene)
    {
        super(scene, 0, 0);  // set initial object position but need update

        scene.add.existing(this);

        this.Top_Right_Text = null;

        this.Init();
    }
}
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
ADebug_Container.prototype.Init = function()
{
    this.Top_Right_Text = this.scene.add.text(0, 0, 'Gold: 0', {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#aa2525',
        align: 'right'
    });
    this.Top_Right_Text.setOrigin(1.0, 0.0);
};
//------------------------------------------------------------------------------------------------------------
ADebug_Container.prototype.Update_Text = function (width, height)
{
    this.Top_Right_Text.setText(`Width: ${width}\nHeight: ${height}`);
};
//------------------------------------------------------------------------------------------------------------
ADebug_Container.prototype.Update_Layout = function(padding_x, anchor_y)
{
    this.Top_Right_Text.setPosition(padding_x, anchor_y);
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default ADebug_Container;
//------------------------------------------------------------------------------------------------------------
