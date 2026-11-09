// Sound Synthesizer Controller - Silenced per user request
// Ensures no synthetic chimes, beeps, or clicks interrupt the special song.

class SoundController {
  public isAmbientPlaying: boolean = false;

  public setMuted(_muted: boolean) {}
  public getMuted(): boolean {
    return true;
  }

  // All extra sound effects silenced so ONLY the user's song plays
  public playChime(_freq = 880, _duration = 0.8) {}
  public playEnvelopeOpen() {}
  public playPaperSlide() {}
  public playStarConnect() {}
  public playCardFlip() {}
  public playCosmicHeartbeat() {}
  public playPlasmaArc() {}
  public startAmbientMelody() {}
  public stopAmbient() {}
}

export const sound = new SoundController();
