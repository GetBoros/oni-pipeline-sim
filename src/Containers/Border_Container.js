//------------------------------------------------------------------------------------------------------------
import Phaser from "phaser";
//------------------------------------------------------------------------------------------------------------




// ABorder_Container
class ABorder_Container extends Phaser.GameObjects.Container
{
    constructor(scene, frame_index)
    {
        super(scene, 0, 0);

        this.Scene = scene;

        this.Frame_Index = frame_index || 1;  // Default brown frame from tile
        this.Tile_Sprite = null;

        this.Init();

        scene.add.existing(this);  // Register container pointer into scene display list for WebGL rendering
    }
}
//------------------------------------------------------------------------------------------------------------




// ABorder_Container
ABorder_Container.prototype.Init = function()
{
    // this.scene.add.rectangle(this.X_Position, this.Y_Position, 50, 50, 0x00ff80);

    this.Tile_Sprite = this.Scene.add.image(0, 0, 'tileset', this.Frame_Index);  // Create image at local container space (0, 0)
    this.add(this.Tile_Sprite);  // Attach sprite to container (child inherits parent transform matrix)
};
//------------------------------------------------------------------------------------------------------------
ABorder_Container.prototype.Set_Frame = function(index)
{
    this.Frame_Index = index;
    this.Tile_Sprite.setFrame(this.Frame_Index);
};
//------------------------------------------------------------------------------------------------------------
ABorder_Container.prototype.Update_Layout = function(pos_x, pos_y)
{
    this.setPosition(pos_x, pos_y)  // Set container world transform position
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default ABorder_Container;
//------------------------------------------------------------------------------------------------------------
