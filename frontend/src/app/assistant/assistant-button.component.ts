import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssistantService, AssistantState } from './assistant.service';

@Component({
  selector: 'app-assistant-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="assistant-button" [class.active]="state.isOpen" (click)="togglePanel()">
      <span class="button-icon">💬</span>
      <span *ngIf="!state.isOpen" class="button-label">Hey ScribeCount?</span>
      <span *ngIf="state.isOpen" class="button-label">Close</span>
    </button>
  `,
  styles: [`
    .assistant-button {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.5rem;
      background: rgb(28, 46, 74);
      color: white;
      border: none;
      border-radius: 50px;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(28, 46, 74, 0.3);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1200;
    }

    .assistant-button:hover {
      background: rgb(35, 58, 93);
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(28, 46, 74, 0.4);
    }

    .assistant-button.active {
      background: rgb(35, 58, 93);
    }

    .assistant-button:active {
      transform: translateY(0);
    }

    .button-icon {
      font-size: 1.25rem;
    }

    .button-label {
      display: inline-block;
    }

    @media (max-width: 640px) {
      .assistant-button {
        padding: 0.75rem 1rem;
        bottom: 1rem;
        right: 1rem;
      }

      .button-label {
        display: none;
      }

      .assistant-button {
        border-radius: 50%;
        width: 56px;
        height: 56px;
        justify-content: center;
      }
    }
  `]
})
export class AssistantButtonComponent implements OnInit {
  state: AssistantState = {
    isOpen: false,
    messages: [],
    isListening: false,
    isPlayingAudio: false
  };

  constructor(private assistantService: AssistantService) {}

  ngOnInit(): void {
    this.assistantService.state.subscribe(state => {
      this.state = state;
    });
  }

  togglePanel(): void {
    this.assistantService.togglePanel();
  }
}
