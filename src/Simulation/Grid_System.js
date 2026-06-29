//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';
//------------------------------------------------------------------------------------------------------------
function Assert_Grid_Concept(grid_obj)
{// Runtime Concept Verification (Mimicking C++20 standard requirements)

    if (grid_obj instanceof AGrid_System === false)
    {
        throw new TypeError('Concept constraint violation: Input must inherit from AGrid_System.');
    }

    if (typeof grid_obj.Initialize_Grid !== 'function' || typeof grid_obj.Get_Cell !== 'function')
    {
        throw new TypeError('Concept constraint violation: Object does not implement correct grid API.');
    }
}
//------------------------------------------------------------------------------------------------------------
class AGrid_System  // 2D Grid Representation for physical simulation.
{// Uses typed contiguous memory buffers (mimicking flat array heap structures).

    constructor()
    {
        this.Grid_Width = 0;
        this.Grid_Height = 0;
        this.Tile_Size = 0;
        this.Types_Array = null;
    }
}
//------------------------------------------------------------------------------------------------------------




// AGrid_System
AGrid_System.prototype.Initialize_Grid = function(width, height, tile_size)
{
    let array_size = 0;

    // 1.0. Set dimensions
    this.Grid_Width = width;
    this.Grid_Height = height;
    this.Tile_Size = tile_size;

    // 2.0. Allocate contiguous memory block (mimicking C++ heap allocation)
    array_size = this.Grid_Width * this.Grid_Height;
    this.Types_Array = new Int32Array(array_size);
};
//------------------------------------------------------------------------------------------------------------
AGrid_System.prototype.Get_Index = function(x_coord, y_coord)
{
    let index = 0;

    // 1.0. Convert 2D coordinates to 1D flat index
    index = (y_coord * this.Grid_Width) + x_coord;

    return index;
};
//------------------------------------------------------------------------------------------------------------
AGrid_System.prototype.Set_Cell = function(x_coord, y_coord, type_id)
{
    let target_index = 0;

    // 1.0. Calculate flat index
    target_index = this.Get_Index(x_coord, y_coord);

    // 2.0. Safe memory write
    this.Types_Array[target_index] = type_id;
};
//------------------------------------------------------------------------------------------------------------
AGrid_System.prototype.Get_Cell = function(x_coord, y_coord)
{
    let target_index = 0;

    // 1.0. Calculate flat index
    target_index = this.Get_Index(x_coord, y_coord);

    return this.Types_Array[target_index];
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export { AGrid_System, Assert_Grid_Concept };
//------------------------------------------------------------------------------------------------------------
