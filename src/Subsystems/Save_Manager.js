//------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
class SSave_Data
{
    constructor()
    {
        this.URL_Format_m3u8_video = 'Enter URL format m3u8 video here';
        this.URL_Format_m3u8_audio = 'Enter URL format m3u8 audio here';
        this.Video_Delay = 30;
    }
}
//------------------------------------------------------------------------------------------------------------
class ASave_Manager
{
    constructor(storage_key)
    {
        this.Storage_Key = storage_key;
    }
}
//------------------------------------------------------------------------------------------------------------



// ASave_Manager
ASave_Manager.prototype.Save = function(save_data)
{
    let serializated_string;

    try
    {
        serializated_string = JSON.stringify(save_data);

        localStorage.setItem(this.Storage_Key, serializated_string);
        console.log('Save done', serializated_string);
    }
    catch (error_exception)
    {
        console.log('Save failed', error_exception);
    }
};
//------------------------------------------------------------------------------------------------------------
ASave_Manager.prototype.Load = function(default_fallback_data)
{
    let parsed_data;
    let raw_data_string;

    raw_data_string = localStorage.getItem(this.Storage_Key);
    if(raw_data_string === null)
        return default_fallback_data;

    try
    {
        parsed_data = JSON.parse(raw_data_string);

        console.log('[SaveManager] State loaded successfully:', parsed_data);

        return parsed_data;
        
    }
    catch (error_exception)
    {
        console.error('[SaveManager] Failed to parse save data. Falling back to default:', error_exception);

        return default_fallback_data;
    }
};
//------------------------------------------------------------------------------------------------------------
ASave_Manager.prototype.Clear = function ()
{
    localStorage.removeItem(this.Storage_Key);
    console.log('[SaveManager] Save data cleared.');
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export { SSave_Data, ASave_Manager };
//------------------------------------------------------------------------------------------------------------
