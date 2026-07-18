import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '@environments/environment';

interface ChatMessage {
  role: 'user' | 'assistant';
  question?: string;
  answer?: string;
  is_one_line?: boolean;
  columns?: string[];
  data?: any[];
  total_records?: number;
  sql?: string;
  time: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat-component.component.html',
  styleUrls: ['./chat-component.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
})
export class ChatComponent implements AfterViewChecked {

  @ViewChild('scrollContainer')
  private scrollContainer!: ElementRef;

  question = '';

  loading = false;

  messages: ChatMessage[] = [];

  apiUrl = `${environment.API_BASE_URL}chat`;


  constructor(private http: HttpClient) { }

  ngAfterViewChecked(): void {
    this.scrollBottom();
  }

  sendMessage(): void {

    const text = this.question.trim();

    if (!text) return;

    this.messages.push({
      role: 'user',
      question: text,
      time: this.getTime(),
    });

    this.loading = true;

    this.http.post<any>(this.apiUrl, {
      question: text,
    }).subscribe({

      next: (res) => {

        this.loading = false;

        let columns: string[] = [];

        if (
          !res.is_one_line &&
          res.data &&
          res.data.length > 0
        ) {
          columns = Object.keys(res.data[0]);
        }

        this.messages.push({
          role: 'assistant',
          answer: res.answer,
          is_one_line: res.is_one_line,
          data: res.data,
          columns: columns,
          total_records:
            res.total_records ??
            (res.data ? res.data.length : 0),
          sql: res.sql,
          time: this.getTime(),
        });

      },

      error: () => {

        this.loading = false;
        
        this.messages.push({
          role: 'assistant',
          answer: 'Something went wrong. Please try again.',
          is_one_line: true,
          time: this.getTime(),
        });

      }

    });

    this.question = '';

  }

  exportExcel(message: ChatMessage): void {

    if (!message.data || message.data.length === 0) {
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(message.data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'AI Report'
    );

    XLSX.writeFile(
      workbook,
      `AI_Report_${new Date().getTime()}.xlsx`
    );

  }

  copy(text: string = ''): void {

    navigator.clipboard.writeText(text);

    alert('Copied');

  }

  clearChat(): void {

    this.messages = [];

  }

  private scrollBottom(): void {

    try {

      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;

    } catch { }

  }

  private getTime(): string {

    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

  }

}