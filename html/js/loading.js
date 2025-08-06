let backgroundVideo = document.getElementById('background-video')
let currentTrackIndex = 0
let isVideoLoaded = false
let isPlaying = false
let count = 0
let thisCount = 0
const musicPlayer = {
    title: document.querySelector('.music-title'),
    artist: document.querySelector('.music-artist'),
    avatar: document.querySelector('.music-avatar'),
    progress: document.querySelector('.progress'),
    controls: {
        prev: document.querySelector('.control-button:nth-child(1)'),
        play: document.querySelector('.control-button:nth-child(2)'),
        next: document.querySelector('.control-button:nth-child(3)'),
        volume: document.querySelector('.control-button:nth-child(4)')
    }
}
const loadingSection = {
    icon: document.querySelector('.loading-icon'),
    title: document.querySelector('.loading-title'),
    subtitle: document.querySelector('.loading-subtitle'),
    progress: document.querySelector('.progress-large')
}
const socialButtons = {
    store: document.getElementById('button-store'),
    discord: document.getElementById('button-discord')
}
const handlers = {
    startInitFunctionOrder(data) {
        count = data.count
        updateLoadingProgress(0)
    },

    initFunctionInvoking(data) {
        const progress = data.idx / count
        updateLoadingProgress(progress)
    },

    startDataFileEntries(data) {
        count = data.count
        thisCount = 0
    },

    performMapLoadFunction(data) {
        ++thisCount
        const progress = thisCount / count
        updateLoadingProgress(progress)
    },

    onResourceStart() {
        updateLoadingProgress(0)
    },

    loadComplete() {
        updateLoadingProgress(1)
    }
}

function loadTrack(index) {
    if (!config.musicPlayer.tracks[index]) {
        console.error('didnt find track:', index)
        return
    }

    const track = config.musicPlayer.tracks[index]
    currentTrackIndex = index
    isVideoLoaded = false
    isPlaying = false

    backgroundVideo.pause()
    backgroundVideo.currentTime = 0
    backgroundVideo.src = ''
    backgroundVideo.load()

    musicPlayer.title.textContent = track.title
    musicPlayer.artist.textContent = track.artist
    musicPlayer.avatar.src = track.thumbnail
    musicPlayer.progress.style.width = '0%'
    updatePlayButton()
    backgroundVideo.src = track.file
    backgroundVideo.muted = false
    backgroundVideo.addEventListener('loadeddata', function onLoadedData() {
        backgroundVideo.removeEventListener('loadeddata', onLoadedData)
        isVideoLoaded = true

        if (config.musicPlayer.autoplay) {
            const playPromise = backgroundVideo.play()
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true
                    updatePlayButton()
                }).catch(error => {
                    console.error('error2:', error)
                    isPlaying = false
                    updatePlayButton()
                    setTimeout(() => playNextTrack(), 1000)
                })
            }
        } else {
            isPlaying = false
            updatePlayButton()
        }
    }, { once: true })

    backgroundVideo.addEventListener('error', function onError() {
        backgroundVideo.removeEventListener('error', onError)
        console.error('error3:', track.title)
        isVideoLoaded = false
        isPlaying = false
        updatePlayButton()
        setTimeout(() => playNextTrack(), 1000)
    }, { once: true })
}

function playNextTrack() {
    const nextIndex = (currentTrackIndex + 1) % config.musicPlayer.tracks.length
    loadTrack(nextIndex)
}

function playPreviousTrack() {
    const prevIndex = (currentTrackIndex - 1 + config.musicPlayer.tracks.length) % config.musicPlayer.tracks.length
    loadTrack(prevIndex)
}

function updateVideoProgress() {
    if (!backgroundVideo.duration || !isVideoLoaded) return

    const percent = (backgroundVideo.currentTime / backgroundVideo.duration) * 100
    if (musicPlayer.progress) musicPlayer.progress.style.width = `${percent}%`
}

function togglePlayPause() {
    if (!backgroundVideo) return

    if (isPlaying) {
        backgroundVideo.pause()
    } else {
        const playPromise = backgroundVideo.play()
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('error: ', error)
                isPlaying = false
                updatePlayButton()
            })
        }
    }
}

function updatePlayButton() {
    if (musicPlayer.controls.play) {
        const icon = musicPlayer.controls.play.querySelector('i')
        if (icon) {
            icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play'
        }
    }
}

function toggleMute() {
    if (!backgroundVideo) return

    backgroundVideo.muted = !backgroundVideo.muted
    const icon = musicPlayer.controls.volume.querySelector('i')
    if (icon) {
        icon.className = backgroundVideo.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up'
    }
}

function updateLoadingProgress(progress) {
    progress = Math.max(0, Math.min(1, progress))
    if (loadingSection.progress) {
        loadingSection.progress.style.width = `${progress * 100}%`
    }
}

function init() {
    backgroundVideo.volume = config.musicPlayer.defaultVolume || 0.5
    backgroundVideo.loop = false
    backgroundVideo.autoplay = true
    socialButtons.discord.href = config.socialLinks.discord
    socialButtons.store.href = config.socialLinks.store
    const root = document.documentElement
    const color = config.theme.color

    backgroundVideo.addEventListener('loadeddata', () => {
        isVideoLoaded = true
    })

    backgroundVideo.addEventListener('ended', playNextTrack)
    backgroundVideo.addEventListener('timeupdate', updateVideoProgress)
    backgroundVideo.addEventListener('play', () => {
        isPlaying = true
        updatePlayButton()
    })
    backgroundVideo.addEventListener('pause', () => {
        isPlaying = false
        updatePlayButton()
    })

    loadTrack(0)

    musicPlayer.controls.prev.addEventListener('click', () => {
        playPreviousTrack()
    })

    musicPlayer.controls.play.addEventListener('click', () => {
        togglePlayPause()
    })

    musicPlayer.controls.next.addEventListener('click', () => {
        playNextTrack()
    })

    musicPlayer.controls.volume.addEventListener('click', () => {
        toggleMute()
    })

    root.style.setProperty('--theme-color', `rgb(${color})`)
    root.style.setProperty('--theme-color-rgb', color)
    root.style.setProperty('--theme-glow', `rgba(${color}, 0.65)`)
    root.style.setProperty('--theme-glow-rgb', color)
    root.style.setProperty('--theme-overlay', `rgba(${color}, 0.04)`)
    root.style.setProperty('--theme-overlay-rgb', color)
    root.style.setProperty('--theme-glow-bg', `rgba(${color}, 0.11)`)
    root.style.setProperty('--theme-glow-bg-rgb', color)
    root.style.setProperty('--theme-color-dark', `rgba(${color}, 0.3)`)

    window.addEventListener('message', function (event) {
        const data = event.data
        const handler = handlers[data.eventName]

        if (handler) {
            handler(data)
        }
    })
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
} else {
    init()
}
