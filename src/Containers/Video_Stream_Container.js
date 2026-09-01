//------------------------------------------------------------------------------------------------------------
import Phaser from 'phaser';
import Hls from 'hls.js';
//------------------------------------------------------------------------------------------------------------



//------------------------------------------------------------------------------------------------------------
class AVideo_Stream_Container extends Phaser.GameObjects.Container
{
    constructor(scene, is_fullscreen_live)
    {
        // 1.0. Base constructor: allocate container at (0, 0)
        super(scene, 0, 0);

        this.Scene_Ref = scene;
        this.Is_Fullscreen_Live = (is_fullscreen_live === true);
        this.Stream_URL = '';

        // Channel Containers
        this.Live_Channel = null;  // Reference to the live video channel
        this.Delay_Channel = null;  // Reference to the delayed video channel (for replay)

        // Subsystem Timers
        this.Drift_Timer_Event = null;  // Timer event for drift control between live and delayed streams

        // HLS Buffer Configuration
        this.Hls_Config = Object.freeze(
            {
                backBufferLength: 60,  // seconds of video to keep in memory for back buffer
                maxBufferLength: 60,  // seconds of video to keep in memory for forward buffer
                maxBufferSize: 150 * 1024 * 1024  // 150 MB max buffer size
            });

        // 2.0. Register container in scene display list
        scene.add.existing(this);
        
    }
}
//------------------------------------------------------------------------------------------------------------




// AVideo_Stream_Container
AVideo_Stream_Container.prototype.Play_Dual_Stream = function (video_url, audio_url)
{
    let clean_video_url = '';
    let clean_audio_url = '';
    let manifest_content = '';
    let blob = null;
    let blob_master_url = '';

    // 1.0. Strip ephemeral sequence parameters to keep audio/video in sync
    clean_video_url = video_url.split('&_HLS_msn')[0];
    clean_audio_url = audio_url.split('&_HLS_msn')[0];

    // 2.0. Generate synthetic Master Playlist with explicit audio/video codecs
    manifest_content = `
#EXTM3U
#EXT-X-VERSION:6
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio-main",NAME="MainAudio",DEFAULT=YES,AUTOSELECT=YES,URI="${clean_audio_url}"
#EXT-X-STREAM-INF:BANDWIDTH=4000000,CODECS="avc1.640028,mp4a.40.2",AUDIO="audio-main"
${clean_video_url}
  `.trim();

    // 3.0. Allocate virtual blob URL for Hls.js parser
    blob = new Blob([manifest_content], { type: 'application/vnd.apple.mpegurl' });
    blob_master_url = URL.createObjectURL(blob);

    // 4.0. Launch playback
    this.Play(blob_master_url);
};
//------------------------------------------------------------------------------------------------------------
AVideo_Stream_Container.prototype.Play = function (stream_url)
{
    this.Stream_URL = stream_url || '';

    if (typeof Hls === 'undefined' || Hls.isSupported() === false)
    {
        console.warn('AVideo_Stream_Container: HLS is not supported.');
        return;
    }

    this.Stop();

    this.Live_Channel = this.Create_Channel('live_tex', false);

    if (this.Is_Fullscreen_Live === false)
    {
        this.Delay_Channel = this.Create_Channel('delay_tex', true);
        this.Setup_Drift_Controller();
    }
};
//------------------------------------------------------------------------------------------------------------
AVideo_Stream_Container.prototype.Create_Channel = function (texture_key, is_delayed)
{
    let channel_obj = null;
    let video_elem = null;
    let hls_inst = null;

    video_elem = document.createElement('video');
    video_elem.autoplay = true;
    video_elem.muted = true;
    video_elem.playsInline = true;
    video_elem.crossOrigin = 'anonymous';

    hls_inst = new Hls(this.Hls_Config);
    hls_inst.loadSource(this.Stream_URL);
    hls_inst.attachMedia(video_elem);

    channel_obj = {
        Video_Element: video_elem,
        Hls_Instance: hls_inst,
        Texture_Key: texture_key,
        Canvas_Tex: null,
        Sprite: null,
        Label: null,
        Is_Delayed: is_delayed
    };

    video_elem.addEventListener('loadedmetadata', () =>
    {
        let tex_w = 0;
        let tex_h = 0;

        if (is_delayed === true)
        {
            video_elem.currentTime = 0;
        }

        video_elem.play();

        tex_w = video_elem.videoWidth || 1280;
        tex_h = video_elem.videoHeight || 720;

        // Удаляем старую текстуру из кэша перед созданием новой
        if (this.Scene_Ref.textures.exists(texture_key))
        {
            this.Scene_Ref.textures.remove(texture_key);
        }

        // 1.0. Создаем чистую динамическую CanvasTexture в TextureManager Phaser
        channel_obj.Canvas_Tex = this.Scene_Ref.textures.createCanvas(texture_key, tex_w, tex_h);

        // 2.0. Добавляем спрайт и текст
        channel_obj.Sprite = this.Scene_Ref.add.image(0, 0, texture_key);
        this.add(channel_obj.Sprite);

        if (is_delayed === true)
        {
            channel_obj.Label = this.Scene_Ref.add.text(0, -95, '⏪ REPLAY (-6s Drift)', {
                fontSize: '13px',
                color: '#e67e22',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        }
        else
        {
            channel_obj.Label = this.Scene_Ref.add.text(0, -165, '● LIVE (HD Original)', {
                fontSize: '15px',
                color: '#2ecc71',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        }
        this.add(channel_obj.Label);

        // 3.0. Аппаратный цикл отрисовки через requestVideoFrameCallback (VSync видеокадров)
        const Update_Texture_Frame = () =>
        {
            if (channel_obj.Canvas_Tex !== null && video_elem.readyState >= 2)
            {
                channel_obj.Canvas_Tex.context.drawImage(video_elem, 0, 0, tex_w, tex_h);
                channel_obj.Canvas_Tex.refresh();
            }

            if ('requestVideoFrameCallback' in video_elem)
            {
                video_elem.requestVideoFrameCallback(Update_Texture_Frame);
            }
        };

        if ('requestVideoFrameCallback' in video_elem)
        {
            video_elem.requestVideoFrameCallback(Update_Texture_Frame);
        }
        else
        {
            this.Scene_Ref.events.on('update', Update_Texture_Frame);
        }

        // 4.0. Обновляем координаты на экране
        this.Update_Layout();
    });

    return channel_obj;
};
//------------------------------------------------------------------------------------------------------------
AVideo_Stream_Container.prototype.Set_Muted = function (is_muted)
{
    if (this.Live_Channel !== null && this.Live_Channel.Video_Element !== null)
    {
        this.Live_Channel.Video_Element.muted = (is_muted === true);
        this.Live_Channel.Video_Element.volume = 1.0;
        this.Live_Channel.Video_Element.play().catch(() => { });
    }
};
//------------------------------------------------------------------------------------------------------------
AVideo_Stream_Container.prototype.Toggle_Mute = function ()
{
    if (this.Live_Channel !== null && this.Live_Channel.Video_Element !== null)
    {
        this.Set_Muted(!this.Live_Channel.Video_Element.muted);
    }
};
//------------------------------------------------------------------------------------------------------------
AVideo_Stream_Container.prototype.Setup_Drift_Controller = function ()
{
    let current_lag = 0;

    this.Drift_Timer_Event = this.Scene_Ref.time.addEvent({
        delay: 500,
        loop: true,
        callback: () =>
        {
            if (this.Live_Channel === null || this.Delay_Channel === null)
            {
                return;
            }

            if (this.Live_Channel.Video_Element.readyState >= 2 && this.Delay_Channel.Video_Element.readyState >= 2)
            {
                current_lag = Math.max(0, Math.round(this.Live_Channel.Video_Element.currentTime - this.Delay_Channel.Video_Element.currentTime));

                if (current_lag < 30)
                {
                    this.Delay_Channel.Video_Element.playbackRate = 0.75;
                    if (this.Delay_Channel.Label !== null)
                    {
                        this.Delay_Channel.Label.setText(`⏪ REPLAY (-${current_lag}s Accumulating...)`);
                    }
                }
                else
                {
                    this.Delay_Channel.Video_Element.playbackRate = 1.0;
                    if (this.Delay_Channel.Label !== null)
                    {
                        this.Delay_Channel.Label.setText(`⏪ REPLAY (-30s Locked)`);
                    }
                }
            }
        }
    });
};
//------------------------------------------------------------------------------------------------------------
AVideo_Stream_Container.prototype.Update_Layout = function ()
{
    let screen_w = 0;
    let screen_h = 0;

    screen_w = this.Scene_Ref.scale.width;
    screen_h = this.Scene_Ref.scale.height;

    // 1.0. Fullscreen Mode
    if (this.Is_Fullscreen_Live === true && this.Live_Channel !== null && this.Live_Channel.Sprite !== null)
    {
        this.Live_Channel.Sprite.setPosition(0, 0);
        this.Live_Channel.Sprite.setDisplaySize(screen_w, screen_h);

        if (this.Live_Channel.Label !== null)
        {
            this.Live_Channel.Label.setPosition(0, -screen_h / 2 + 30);
        }
        return;
    }

    // 2.0. Dual Window Mode
    if (this.Live_Channel !== null && this.Live_Channel.Sprite !== null)
    {
        this.Live_Channel.Sprite.setPosition(150, 0);
        this.Live_Channel.Sprite.setDisplaySize(520, 292);

        if (this.Live_Channel.Label !== null)
        {
            this.Live_Channel.Label.setPosition(150, -165);
        }
    }

    if (this.Delay_Channel !== null && this.Delay_Channel.Sprite !== null)
    {
        this.Delay_Channel.Sprite.setPosition(-270, 0);
        this.Delay_Channel.Sprite.setDisplaySize(280, 158);

        if (this.Delay_Channel.Label !== null)
        {
            this.Delay_Channel.Label.setPosition(-270, -95);
        }
    }
};
//------------------------------------------------------------------------------------------------------------
AVideo_Stream_Container.prototype.Stop_Channel = function (channel_obj)
{
    if (channel_obj === null)
    {
        return;
    }

    if (channel_obj.Hls_Instance !== null)
    {
        channel_obj.Hls_Instance.destroy();
        channel_obj.Hls_Instance = null;
    }

    if (channel_obj.Video_Element !== null)
    {
        channel_obj.Video_Element.pause();
        channel_obj.Video_Element.removeAttribute('src');
        channel_obj.Video_Element.load();
        channel_obj.Video_Element = null;
    }

    if (channel_obj.Canvas_Tex !== null)
    {
        this.Scene_Ref.textures.remove(channel_obj.Texture_Key);
        channel_obj.Canvas_Tex = null;
    }
};
//------------------------------------------------------------------------------------------------------------
AVideo_Stream_Container.prototype.Stop = function ()
{
    if (this.Drift_Timer_Event !== null)
    {
        this.Drift_Timer_Event.remove(false);
        this.Drift_Timer_Event = null;
    }

    this.Stop_Channel(this.Live_Channel);
    this.Stop_Channel(this.Delay_Channel);

    this.Live_Channel = null;
    this.Delay_Channel = null;
};
//------------------------------------------------------------------------------------------------------------
AVideo_Stream_Container.prototype.destroy = function (from_scene)
{
    this.Stop();

    Phaser.GameObjects.Container.prototype.destroy.call(this, from_scene);
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default AVideo_Stream_Container;
//------------------------------------------------------------------------------------------------------------