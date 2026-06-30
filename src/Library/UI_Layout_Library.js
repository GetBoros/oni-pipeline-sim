//------------------------------------------------------------------------------------------------------------
const SUI_Layout =
{
    TOP_LEFT: 'TOP_LEFT',
    TOP_CENTER: 'TOP_CENTER',
    TOP_RIGHT: 'TOP_RIGHT',
    CENTER: 'CENTER',
    BOTTOM_LEFT: 'BOTTOM_LEFT',
    BOTTOM_CENTER: 'BOTTOM_CENTER',
    BOTTOM_RIGHT: 'BOTTOM_RIGHT'
};
//------------------------------------------------------------------------------------------------------------




class AUI_Layout_Library
{
    constructor()
    {

    }
}
//------------------------------------------------------------------------------------------------------------
AUI_Layout_Library.Align_To_Anchor = function (scene, game_obj, anchor_type, offset_x = 0, offset_y = 0)
{// Stateless static function to position a game object relative to screen viewport bounds.

    let screen_w = 0;
    let screen_h = 0;
    let target_x = 0;
    let target_y = 0;

    screen_w = scene.scale.width;
    screen_h = scene.scale.height;

    if (game_obj.Wrap_Width_Preferred !== undefined)
    {// Word-Wrap Clamping (Protects text from clipping on narrow/mobile viewports)

        let side_padding = 40;  // Combined left and right safe margins (20px + 20px)
        let allowed_width = screen_w - side_padding;

        if (allowed_width < game_obj.Wrap_Width_Preferred)  // Clamp word wrap width
            game_obj.setWordWrapWidth(allowed_width, true);
        else
            game_obj.setWordWrapWidth(game_obj.Wrap_Width_Preferred, true);
    }

    switch (anchor_type)  // Execute alignment calculations
    {
        case SUI_Layout.TOP_LEFT:
            target_x = offset_x;
            target_y = offset_y;
            game_obj.setOrigin(0.0, 0.0);
            break;

        case SUI_Layout.TOP_CENTER:
            target_x = (screen_w * 0.5) + offset_x;
            target_y = offset_y;
            game_obj.setOrigin(0.5, 0.0);
            break;

        case SUI_Layout.TOP_RIGHT:
            target_x = screen_w + offset_x;
            target_y = offset_y;
            game_obj.setOrigin(1.0, 0.0);
            break;

        case SUI_Layout.CENTER:
            target_x = (screen_w * 0.5) + offset_x;
            target_y = (screen_h * 0.5) + offset_y;
            game_obj.setOrigin(0.5, 0.5);
            break;

        case SUI_Layout.BOTTOM_CENTER:
            target_x = (screen_w * 0.5) + offset_x;
            target_y = screen_h + offset_y;
            game_obj.setOrigin(0.5, 1.0);
            break;

        case SUI_Layout.BOTTOM_RIGHT:
            target_x = screen_w + offset_x;
            target_y = screen_h + offset_y;
            game_obj.setOrigin(1.0, 1.0);
            break;
    }

    game_obj.setPosition(target_x, target_y);  // Assign new absolute transform coordinates
};
//------------------------------------------------------------------------------------------------------------
AUI_Layout_Library.Set_Font_Style = function (font_size = 20, stroke_thickness = 4, color = '#ffffff', wrap_width = 300)
{// Generates wrapped text style config object.

    let style_obj = null;

    style_obj =
    {
        fontFamily: 'Bitcount Single',
        fontSize: font_size + 'px',
        color: color,
        stroke: '#111111',
        strokeThickness: stroke_thickness,
        align: 'center'
    };

    if (wrap_width > 0)
    {
        style_obj.wordWrap =
        {
            width: wrap_width,
            useAdvancedWrap: true
        };
    }

    return style_obj;
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export { AUI_Layout_Library, SUI_Layout };
//------------------------------------------------------------------------------------------------------------