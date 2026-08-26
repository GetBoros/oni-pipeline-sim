//------------------------------------------------------------------------------------------------------------
import Phaser from "phaser";

import { ETile_Frame, SAsset_Config } from "../Core/Game_Config";
//------------------------------------------------------------------------------------------------------------




// ABorder_Container
class ABorder_Container extends Phaser.GameObjects.Container
{
    constructor(scene, texture_key, frame_index)
    {
        super(scene, 0, 0);

        this.Scene = scene;

        this.Texture_Key = texture_key || SAsset_Config.TILESET.KEY;
        this.Frame_Index = frame_index || ETile_Frame.BROWN;  // Default brown frame from tile
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

    this.Tile_Sprite = this.Scene.add.image(0, 0, this.Texture_Key, this.Frame_Index);  // Create image at local container space (0, 0)
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
