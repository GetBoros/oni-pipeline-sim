//------------------------------------------------------------------------------------------------------------
import AsGame_Instance from './Core/Game_Instance.js';
import Game_Config from './Core/Game_Config.js';
//------------------------------------------------------------------------------------------------------------
document.fonts.ready.then(function()
{
  const Game_Instance = new AsGame_Instance(Game_Config);

  // 1.0. Boot up custom persistent subsystems (analogous to Unreal Engine 5 custom GameInstance Initialization)
  Game_Instance.Initialize_Global_Systems();
});
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
/*
  - npm run dev
  - npm run deploy
*/
//------------------------------------------------------------------------------------------------------------
