'use client';

import { Howl } from 'howler';

// 사운드 타입 정의
export enum SoundType {
  CLICK = 'click',
  LEVEL_UP = 'levelup',
  WARNING = 'warning',
  SUCCESS = 'success',
}

// 사운드 인스턴스 관리
class SoundManager {
  private sounds: Map<SoundType, Howl> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    this.initializeSounds();
  }

  private initializeSounds() {
    // 클릭 사운드 (수확)
    this.sounds.set(
      SoundType.CLICK,
      new Howl({
        src: ['/sounds/click.mp3'],
        volume: this.volume * 0.3,
        preload: true,
      })
    );

    // 레벨업 사운드
    this.sounds.set(
      SoundType.LEVEL_UP,
      new Howl({
        src: ['/sounds/levelup.mp3'],
        volume: this.volume,
        preload: true,
      })
    );

    // 경고 사운드 (에너지 부족)
    this.sounds.set(
      SoundType.WARNING,
      new Howl({
        src: ['/sounds/warning.mp3'],
        volume: this.volume * 0.5,
        preload: true,
      })
    );

    // 성공 사운드
    this.sounds.set(
      SoundType.SUCCESS,
      new Howl({
        src: ['/sounds/success.mp3'],
        volume: this.volume,
        preload: true,
      })
    );
  }

  // 사운드 재생
  play(type: SoundType) {
    if (!this.enabled) return;

    const sound = this.sounds.get(type);
    if (sound) {
      sound.play();
    }
  }

  // 사운드 활성화/비활성화
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  // 볼륨 조절 (0.0 ~ 1.0)
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    // 모든 사운드의 볼륨 업데이트
    this.sounds.forEach((sound, type) => {
      if (type === SoundType.CLICK) {
        sound.volume(this.volume * 0.3);
      } else if (type === SoundType.WARNING) {
        sound.volume(this.volume * 0.5);
      } else {
        sound.volume(this.volume);
      }
    });
  }

  // 모든 사운드 중지
  stopAll() {
    this.sounds.forEach(sound => sound.stop());
  }
}

// 싱글톤 인스턴스
let soundManager: SoundManager | null = null;

// 브라우저 환경에서만 초기화
export const getSoundManager = (): SoundManager => {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 더미 객체 반환
    return {
      play: () => {},
      setEnabled: () => {},
      setVolume: () => {},
      stopAll: () => {},
    } as unknown as SoundManager;
  }

  if (!soundManager) {
    soundManager = new SoundManager();
  }

  return soundManager;
};

// 편의 함수들
export const playSound = (type: SoundType) => {
  getSoundManager().play(type);
};

export const setSoundEnabled = (enabled: boolean) => {
  getSoundManager().setEnabled(enabled);
};

export const setSoundVolume = (volume: number) => {
  getSoundManager().setVolume(volume);
};

export const stopAllSounds = () => {
  getSoundManager().stopAll();
};
