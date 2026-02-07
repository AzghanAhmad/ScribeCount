import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-voice-playback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="voice-playback">
      <button class="play-btn" [class.playing]="isPlaying" (click)="togglePlayback()">
        <span class="play-icon">{{ isPlaying ? '⏸' : '▶' }}</span>
      </button>

      <div class="playback-info">
        <span class="duration">{{ currentTime }} / {{ totalDuration }}</span>
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="progress"></div>
        </div>
      </div>

      <button class="speed-btn" (click)="cycleSpeed()">
        <span>{{ speedLabel }}</span>
      </button>
    </div>
  `,
  styles: [`
    .voice-playback {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f0f4f8;
      border-radius: 8px;
      margin: 0.5rem 0;
    }

    .play-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgb(28, 46, 74);
      color: white;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .play-btn:hover {
      background: rgb(35, 58, 93);
      transform: scale(1.05);
    }

    .play-btn.playing {
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(28, 46, 74, 0.4);
      }
      50% {
        box-shadow: 0 0 0 6px rgba(28, 46, 74, 0);
      }
    }

    .play-icon {
      font-size: 1.25rem;
    }

    .playback-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .duration {
      font-size: 0.75rem;
      color: #718096;
      font-weight: 500;
    }

    .progress-bar {
      height: 3px;
      background: #cbd5e0;
      border-radius: 2px;
      overflow: hidden;
      cursor: pointer;
    }

    .progress-fill {
      height: 100%;
      background: rgb(28, 46, 74);
      border-radius: 2px;
      transition: width 0.1s linear;
    }

    .speed-btn {
      padding: 0.5rem 0.75rem;
      background: white;
      border: 1px solid #cbd5e0;
      border-radius: 6px;
      color: #4a5568;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .speed-btn:hover {
      border-color: rgb(28, 46, 74);
      color: rgb(28, 46, 74);
    }
  `]
})
export class VoicePlaybackComponent {
  @Input() messageId: string = '';
  @Output() playbackToggled = new EventEmitter<boolean>();

  isPlaying = false;
  currentTime = '0:00';
  totalDuration = '2:30';
  progress = 0;
  speed = 1;

  get speedLabel(): string {
    return `${this.speed}x`;
  }

  togglePlayback(): void {
    this.isPlaying = !this.isPlaying;
    this.playbackToggled.emit(this.isPlaying);

    if (this.isPlaying) {
      this.simulatePlayback();
    }
  }

  private simulatePlayback(): void {
    const interval = setInterval(() => {
      if (!this.isPlaying) {
        clearInterval(interval);
        return;
      }

      this.progress += 0.5;
      if (this.progress >= 100) {
        this.progress = 100;
        this.isPlaying = false;
        clearInterval(interval);
      }

      this.updateCurrentTime();
    }, 100);
  }

  private updateCurrentTime(): void {
    const totalSeconds = 150;
    const elapsed = Math.floor((this.progress / 100) * totalSeconds);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    this.currentTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  cycleSpeed(): void {
    this.speed = this.speed === 1 ? 1.25 : this.speed === 1.25 ? 1.5 : 1;
  }
}
