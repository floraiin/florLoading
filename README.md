# florLoading Loading Screen

A modern, customizable loading screen resource for FiveM servers.

![Loading Screen Preview](https://files.catbox.moe/mgpig2.png)

## Features

-  **Integrated Music Player** - Background video with controls
-  **Customizable Theme** - Easy color customization through config
-  **Responsive Design** - Modern UI with smooth animations
-  **Easy Configuration** - Simple setup and customization

## Installation

1. Download or clone this repository
2. Place the `florLoading` folder in your FiveM server's `resources` directory
3. Add `ensure florLoading` to your `server.cfg`
4. Configure the settings in `html/js/config.js`
5. Restart your server

## Configuration

### Theme Customization

The loading screen supports easy theme customization. Edit `html/js/config.js`:

```javascript
const config = {
    // Theme configuration
    theme: {
        color: '230,66,245', // Theme color (RGB format)
    },
    // ... other config
};
```

### Music Player Setup

Configure your music tracks in the same file:

```javascript
musicPlayer: {
    autoplay: true,
    loop: false,
    defaultVolume: 0.5,
    tracks: [
        {
            title: "Your Song Title",
            artist: "Artist Name",
            thumbnail: "./img/thumbnail.jpg",
            file: "path/to/your/video.mp4"
        },
    ]
}
```

### Social Links

Set up your social links:

```javascript
socialLinks: {
    discord: "https://discord.gg/yourserver",
    store: "https://yourstore.com"
}
```

## Customization Examples

### Purple Theme
```javascript
theme: {
    color: '230,66,245',
}
```

### Green Theme
```javascript
theme: {
    color: '3,128,3',
}
```

### Red Theme
```javascript
theme: {
    color: '255,0,0',
}
```

## Support

For support, join our discord: https://discord.gg/floraiin

---