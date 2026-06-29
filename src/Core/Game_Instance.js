//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';
//------------------------------------------------------------------------------------------------------------
class AsGame_Instance extends Phaser.Game
{// Custom Engine/Game Instance Controller. Inherits from Phaser.Game (Equivalent to UE5 UGameInstance).

    constructor(config_obj)
    {
        super(config_obj);  // base constructor call, initialization

        // Global Persistence Layer (UGameInstance variables example)
        this.Master_Volume = 1.0;
        this.Network_Socket = null;
        this.Persistent_Simulation_State = null;
    }
}
//------------------------------------------------------------------------------------------------------------




// AsGame_Instance
AsGame_Instance.prototype.Initialize_Global_Systems = function()
{
    let status_code = 0;

    // 1.0. Perform engine-level allocations (e.g., connect to WebSockets, prepare WASM)
    status_code = 200;
    console.log('Engine Subsystems: Native Game_Instance systems initialized.');

    return status_code;
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default AsGame_Instance;
//------------------------------------------------------------------------------------------------------------
