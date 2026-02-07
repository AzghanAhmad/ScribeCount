import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SavedQuestion {
  id: string;
  question: string;
  category: string;
  lastRun?: string;
  frequency?: 'manual' | 'daily' | 'weekly' | 'monthly';
  pinned?: boolean;
  tags?: string[];
}

@Component({
  selector: 'app-saved-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-text">
          <h1 class="page-title">Saved Questions</h1>
          <p class="page-subtitle">Quick access to your frequently asked questions</p>
        </div>
        <button class="btn btn-primary" (click)="showNewQuestionModal = true">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Save New Question
        </button>
      </div>

      <!-- Search & Categories -->
      <div class="filters-row animate-fade-in-up">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" class="search-input" placeholder="Search saved questions..." [(ngModel)]="searchQuery">
        </div>
        <div class="category-pills">
          <button *ngFor="let cat of categories" 
                  class="category-pill"
                  [class.active]="selectedCategory === cat"
                  (click)="selectedCategory = cat">
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Pinned Questions -->
      <div *ngIf="pinnedQuestions.length > 0" class="section animate-fade-in-up" style="animation-delay: 0.1s">
        <div class="section-header">
          <h2 class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Pinned
          </h2>
        </div>
        <div class="questions-grid">
          <div *ngFor="let question of pinnedQuestions" class="question-card pinned">
            <button class="pin-btn pinned" (click)="togglePin(question)" title="Unpin">
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </button>
            <div class="question-content">
              <p class="question-text">{{ question.question }}</p>
              <div class="question-meta">
                <span class="category-tag">{{ question.category }}</span>
                <span class="last-run" *ngIf="question.lastRun">Last: {{ question.lastRun }}</span>
              </div>
            </div>
            <div class="question-actions">
              <button class="action-btn primary" (click)="runQuestion(question)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Run
              </button>
              <button class="action-btn" (click)="editQuestion(question)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- All Questions -->
      <div class="section animate-fade-in-up" style="animation-delay: 0.15s">
        <div class="section-header">
          <h2 class="section-title">All Questions</h2>
          <span class="question-count">{{ filteredQuestions.length }} {{ filteredQuestions.length === 1 ? 'question' : 'questions' }}</span>
        </div>
        <div class="questions-list">
          <div *ngFor="let question of filteredQuestions" class="question-row">
            <button class="pin-btn" [class.pinned]="question.pinned" (click)="togglePin(question)" title="Pin">
              <svg viewBox="0 0 24 24" [attr.fill]="question.pinned ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </button>
            <div class="row-content">
              <p class="question-text">{{ question.question }}</p>
              <div class="question-meta">
                <span class="category-tag">{{ question.category }}</span>
                <span class="frequency-tag" *ngIf="question.frequency && question.frequency !== 'manual'">{{ question.frequency }}</span>
                <span class="last-run" *ngIf="question.lastRun">Last run: {{ question.lastRun }}</span>
              </div>
            </div>
            <div class="row-actions">
              <button class="action-btn primary" (click)="runQuestion(question)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Run
              </button>
              <button class="action-btn" (click)="editQuestion(question)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="action-btn danger" (click)="deleteQuestion(question)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="filteredQuestions.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3 class="empty-title">No saved questions</h3>
            <p class="empty-text">Save your frequently asked questions for quick access.</p>
            <button class="btn btn-primary" (click)="showNewQuestionModal = true">Save Your First Question</button>
          </div>
        </div>
      </div>

      <!-- Suggested Questions -->
      <div class="section animate-fade-in-up" style="animation-delay: 0.2s">
        <div class="section-header">
          <h2 class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Suggested Questions
          </h2>
        </div>
        <div class="suggestions-grid">
          <button *ngFor="let suggestion of suggestions" class="suggestion-card" (click)="saveSuggestion(suggestion)">
            <span class="suggestion-text">{{ suggestion }}</span>
            <svg class="add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1100px;
      animation: fadeIn 0.5s ease-out;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.25rem 0;
    }

    .page-subtitle {
      font-size: 1rem;
      color: var(--text-muted);
      margin: 0;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-icon {
      width: 18px;
      height: 18px;
    }

    .btn-primary {
      background: linear-gradient(135deg, rgb(28, 46, 74) 0%, rgb(45, 75, 120) 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(28, 46, 74, 0.25);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(28, 46, 74, 0.3);
    }

    /* Filters */
    .filters-row {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .search-box {
      position: relative;
    }

    .search-icon {
      position: absolute;
      left: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      color: var(--text-muted);
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 0.875rem 0.75rem 2.5rem;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      font-size: 0.9375rem;
      background: white;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .category-pills {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .category-pill {
      padding: 0.5rem 1rem;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-secondary);
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 100px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .category-pill:hover {
      border-color: var(--primary);
    }

    .category-pill.active {
      background: var(--primary);
      border-color: var(--primary);
      color: white;
    }

    /* Section */
    .section {
      margin-bottom: 2.5rem;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .section-title svg {
      width: 18px;
      height: 18px;
      color: var(--warning);
    }

    .question-count {
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    /* Questions Grid (Pinned) */
    .questions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .question-card {
      position: relative;
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 14px;
      padding: 1.25rem;
      transition: all 0.3s ease;
    }

    .question-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
    }

    .question-card.pinned {
      border-color: rgba(245, 158, 11, 0.3);
      background: rgba(245, 158, 11, 0.02);
    }

    .pin-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: 6px;
      color: var(--text-light);
      cursor: pointer;
      transition: all 0.2s;
    }

    .pin-btn:hover {
      color: var(--warning);
    }

    .pin-btn.pinned {
      color: var(--warning);
    }

    .pin-btn svg {
      width: 16px;
      height: 16px;
    }

    .question-content {
      padding-right: 2rem;
    }

    .question-text {
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--text-primary);
      margin: 0 0 0.75rem 0;
      line-height: 1.5;
    }

    .question-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }

    .category-tag {
      font-size: 0.6875rem;
      font-weight: 500;
      text-transform: uppercase;
      padding: 0.25rem 0.5rem;
      background: rgba(139, 92, 246, 0.1);
      color: var(--accent-purple);
      border-radius: 4px;
    }

    .frequency-tag {
      font-size: 0.6875rem;
      font-weight: 500;
      text-transform: uppercase;
      padding: 0.25rem 0.5rem;
      background: rgba(59, 130, 246, 0.1);
      color: var(--accent-blue);
      border-radius: 4px;
    }

    .last-run {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .question-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0.75rem;
      font-size: 0.8125rem;
      font-weight: 500;
      background: var(--background);
      border: none;
      border-radius: 8px;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: var(--border-light);
      color: var(--text-primary);
    }

    .action-btn.primary {
      background: var(--primary);
      color: white;
    }

    .action-btn.primary:hover {
      background: rgb(35, 55, 90);
    }

    .action-btn.danger:hover {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
    }

    .action-btn svg {
      width: 14px;
      height: 14px;
    }

    /* Questions List */
    .questions-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .question-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 12px;
      transition: all 0.2s;
    }

    .question-row:hover {
      border-color: var(--border-color);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .row-content {
      flex: 1;
      min-width: 0;
    }

    .row-content .question-text {
      margin-bottom: 0.375rem;
    }

    .row-actions {
      display: flex;
      gap: 0.375rem;
      opacity: 0.5;
      transition: opacity 0.2s;
    }

    .question-row:hover .row-actions {
      opacity: 1;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      background: var(--background);
      border-radius: 14px;
    }

    .empty-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      background: white;
      border-radius: 14px;
      color: var(--text-muted);
    }

    .empty-icon svg {
      width: 28px;
      height: 28px;
    }

    .empty-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.375rem 0;
    }

    .empty-text {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin: 0 0 1.25rem 0;
    }

    /* Suggestions */
    .suggestions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 0.75rem;
    }

    .suggestion-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: white;
      border: 1px dashed var(--border-color);
      border-radius: 12px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
    }

    .suggestion-card:hover {
      border-style: solid;
      border-color: var(--primary);
      background: var(--primary-light);
    }

    .suggestion-text {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    .add-icon {
      width: 18px;
      height: 18px;
      color: var(--text-muted);
      flex-shrink: 0;
      opacity: 0;
      transition: all 0.2s;
    }

    .suggestion-card:hover .add-icon {
      opacity: 1;
      color: var(--primary);
    }

    .animate-fade-in-up {
      opacity: 0;
      animation: fadeInUp 0.5s ease-out forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class SavedQuestionsComponent {
  searchQuery = '';
  selectedCategory = 'All';
  showNewQuestionModal = false;

  categories = ['All', 'Revenue', 'Marketing', 'Analytics', 'KU', 'Trends'];

  savedQuestions: SavedQuestion[] = [
    { id: '1', question: 'How did my romance titles perform last month?', category: 'Revenue', lastRun: 'Today', frequency: 'monthly', pinned: true },
    { id: '2', question: 'What are my top 5 selling books this quarter?', category: 'Revenue', lastRun: 'Yesterday', pinned: true },
    { id: '3', question: 'Compare my KU page reads to direct sales', category: 'KU', lastRun: '3 days ago', frequency: 'weekly' },
    { id: '4', question: 'Which email campaigns had the highest conversion?', category: 'Marketing', lastRun: 'Last week' },
    { id: '5', question: 'Show me the trend for my sales over the past 6 months', category: 'Trends', lastRun: '2 weeks ago' },
    { id: '6', question: 'What percentage of my revenue comes from Amazon?', category: 'Analytics', lastRun: 'Last month' }
  ];

  suggestions = [
    'What was my best performing genre last quarter?',
    'How many new subscribers did I gain this month?',
    'Which promotional sites gave me the best ROI?',
    'Compare my wide sales to KU exclusive performance',
    'What time of day do readers buy my books most?',
    'Show me a breakdown of sales by country'
  ];

  get pinnedQuestions(): SavedQuestion[] {
    return this.savedQuestions.filter(q => q.pinned);
  }

  get filteredQuestions(): SavedQuestion[] {
    return this.savedQuestions.filter(q => {
      const matchesSearch = !this.searchQuery ||
        q.question.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory === 'All' || q.category === this.selectedCategory;
      return matchesSearch && matchesCategory && !q.pinned;
    });
  }

  togglePin(question: SavedQuestion): void {
    question.pinned = !question.pinned;
  }

  runQuestion(question: SavedQuestion): void {
    console.log('Running question:', question.question);
    question.lastRun = 'Just now';
  }

  editQuestion(question: SavedQuestion): void {
    console.log('Editing question:', question.id);
  }

  deleteQuestion(question: SavedQuestion): void {
    this.savedQuestions = this.savedQuestions.filter(q => q.id !== question.id);
  }

  saveSuggestion(suggestion: string): void {
    const newQuestion: SavedQuestion = {
      id: Date.now().toString(),
      question: suggestion,
      category: 'General',
      pinned: false
    };
    this.savedQuestions.push(newQuestion);
    this.suggestions = this.suggestions.filter(s => s !== suggestion);
  }
}
