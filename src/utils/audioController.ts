// Master Audio Controller for Ovi ma's special song
// Starts playing when the heart connects and plays uninterrupted until the end.

export type AudioTimeListener = (timeSec: number, isPlaying: boolean) => void;

class StoryAudioController {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.9;
  private isMuted: boolean = false;
  private listeners: Set<AudioTimeListener> = new Set();

  constructor() {
    this.initAudio();
  }

  private initAudio() {
    if (typeof window === 'undefined') return;
    try {
      this.audio = new Audio('/audio/ovi-song.mp3');
      this.audio.preload = 'auto';
      this.audio.loop = true;
      this.audio.volume = this.volume;

      // Fallback if mp3 extension has mime issues
      this.audio.onerror = () => {
        if (this.audio && this.audio.src.endsWith('.mp3')) {
          this.audio.src = '/audio/ovi-song.mpeg';
          this.audio.load();
        }
      };

      this.audio.ontimeupdate = () => {
        this.notify();
      };

      this.audio.onplay = () => {
        this.isPlaying = true;
        this.notify();
      };

      this.audio.onpause = () => {
        this.isPlaying = false;
        this.notify();
      };
    } catch {
      // Audio element creation handled gracefully
    }
  }

  public subscribe(fn: AudioTimeListener): () => void {
    this.listeners.add(fn);
    fn(this.getCurrentTime(), this.isPlaying);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    const cur = this.getCurrentTime();
    this.listeners.forEach((fn) => fn(cur, this.isPlaying));
  }

  public play(): Promise<void> | void {
    if (!this.audio) {
      this.initAudio();
    }
    if (!this.audio) return;

    this.audio.muted = this.isMuted;
    this.audio.volume = this.isMuted ? 0 : this.volume;

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      return playPromise
        .then(() => {
          this.isPlaying = true;
          this.notify();
        })
        .catch(() => {
          // Handled gracefully if browser blocks prior to interaction
        });
    }
    this.isPlaying = true;
    this.notify();
  }

  public pause() {
    if (this.audio) {
      this.audio.pause();
    }
    this.isPlaying = false;
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }
    this.notify();
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.audio) {
      this.audio.muted = muted;
      this.audio.volume = muted ? 0 : this.volume;
    }
    this.notify();
  }

  public toggleMute() {
    this.setMuted(!this.isMuted);
  }

  public getCurrentTime(): number {
    return this.audio ? this.audio.currentTime : 0;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public reset() {
    if (this.audio) {
      this.audio.currentTime = 0;
    }
    this.play();
  }
}

export const storyAudio = new StoryAudioController();
