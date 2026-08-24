//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
class AText_Input_Container extends Phaser.GameObjects.Container
{// UI Component managing interactive text input with virtual keyboard support.

    constructor(scene, initial_text, label_text, on_commit_callback)
    {
        super(scene, 100, 100);  // set initial object position but need update

        this.Is_Active = false;
        this.Scene_Ref = scene;
        this.Current_Text = initial_text || '';
        this.Label_String = label_text || 'INPUT:';
        this.On_Commit_Callback = on_commit_callback;

        // Visual Elements
        this.Background_Box = null;
        this.Label_Text = null;
        this.Value_Text = null;
        this.Box_Width = 320;
        this.Box_Height = 60;

        // Hidden Native DOM Input for Mobile Virtual Keyboard
        this.Hidden_Input = null;

        // 1.0. Initialize component systems
        this.Create_Visuals();
        this.Create_Hidden_Input();
        this.Bind_Input_Events();

        // 2.0. Add container to scene hierarchy
        scene.add.existing(this);
    }
}
//------------------------------------------------------------------------------------------------------------




// AText_Input_Container
AText_Input_Container.prototype.Create_Visuals = function()
{
    let half_width;
    let half_height;

    half_width = this.Box_Width / 2;
    half_height = this.Box_Height / 2;

    // 1.0. Create interactive background rectangle (perfect 1:1 hit-box)
    this.Background_Box = this.Scene_Ref.add.rectangle(0, 0, this.Box_Width, this.Box_Height, 0x11161d, 0.95);
    this.Background_Box.setStrokeStyle(2, 0x445566, 1.0);  // add stoke around our rectangle
    this.Background_Box.setInteractive( { useHandCursor: true } );
    this.add(this.Background_Box);

    // 2.0. Draw title label
    this.Label_Text = this.Scene_Ref.add.text(-half_width + 15, -half_height + 8, this.Label_String, {
        fontFamily: 'monospace',
        fontSize: '12px',  // description text font size
        color: '#88aacc'  // description text color
    });
    this.add(this.Label_Text);  // create and add

    // 3.0. Draw input value text
    this.Value_Text = this.Scene_Ref.add.text(-half_width + 15, -half_height + 26, this.Current_Text, {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#ffffff'
    });
    this.add(this.Value_Text);
};
//------------------------------------------------------------------------------------------------------------
AText_Input_Container.prototype.Redraw_Background = function(is_focused)
{
    let line_color;
    let fill_color;

    line_color = is_focused ? 0x00ffcc : 0x445566;  // '#00ffcc' : '#b2cae2';
    fill_color = is_focused ? 0x1a2530 : 0x11161d;  // '#1a2530' : '#11161d';

    this.Background_Box.setFillStyle(fill_color, 0.95);
    this.Background_Box.setStrokeStyle(2, line_color, 1.0);
};
//------------------------------------------------------------------------------------------------------------
AText_Input_Container.prototype.Create_Hidden_Input = function()
{
    // 1.0. Create hidden native input element in DOM tree
    this.Hidden_Input = document.createElement('input');
    this.Hidden_Input.type = 'text';
    this.Hidden_Input.maxLength = 18;
    this.Hidden_Input.value = this.Current_Text;

    // 1.1. Style as invisible and off-screen
    this.Hidden_Input.style.position = 'absolute';
    this.Hidden_Input.style.opacity = '0';
    this.Hidden_Input.style.pointerEvents = 'none';
    this.Hidden_Input.style.left = '0px';
    this.Hidden_Input.style.top = '0px';
    this.Hidden_Input.style.zIndex = '-1000';

    document.body.appendChild(this.Hidden_Input);
};
//------------------------------------------------------------------------------------------------------------
AText_Input_Container.prototype.Bind_Input_Events = function()
{
    // 1.0. Focus hidden input on background box click
    this.Background_Box.on('pointerdown', ()=>
    {
        this.Is_Active = true;
        this.Redraw_Background(true);
        this.Hidden_Input.focus();
    });

    // 2.0. Handle real-time text input from keyboard
    this.Hidden_Input.addEventListener('input', (event)=>
    {
        this.Current_Text = event.target.value;
        this.Value_Text.setText(this.Current_Text);
    });

    // 3.0. Commit on Enter key
    this.Hidden_Input.addEventListener('keydown', (event)=>
    {
        if (event.key === 'Enter')
        {
            this.Hidden_Input.blur();
        }
    });

    // 4.0. Commit data on focus loss (blur)
    this.Hidden_Input.addEventListener('blur', ()=>
    {
        this.Is_Active = false;
        this.Redraw_Background(false);

        if (this.Current_Text.trim() === '')  // if empty name set default name
        {
            this.Current_Text = 'Nameless';  // set default name if no name
            this.Value_Text.setText(this.Current_Text);  // Update text to default
            this.Hidden_Input.value = this.Current_Text;  // Sync hidden DOM input value with the enforced default
        }

        if (this.On_Commit_Callback !== null)  // call callback if was added with param text
        {
            this.On_Commit_Callback(this.Current_Text);
        }
    });
};
//------------------------------------------------------------------------------------------------------------
AText_Input_Container.prototype.Update_Layout = function(pos_x, pos_y)
{
    this.setPosition(pos_x, pos_y);
};
//------------------------------------------------------------------------------------------------------------
AText_Input_Container.prototype.destroy = function(from_scene)
{
    // 1.0. Clean up DOM node to prevent memory leaks
    if (this.Hidden_Input !== null && this.Hidden_Input.parentNode !== null)
    {
        this.Hidden_Input.parentNode.removeChild(this.Hidden_Input);
        this.Hidden_Input = null;
    }

    // 2.0. Base class destruction
    Phaser.GameObjects.Container.prototype.destroy.call(this, from_scene);
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default AText_Input_Container;
//------------------------------------------------------------------------------------------------------------