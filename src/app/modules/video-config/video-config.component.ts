import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileSizePipe } from '../../shared/pipes/file-size.pipe';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';

interface UploadedVideo {
  name: string;
  size: string;
  url: string;
  language: string;
  uploadDate: Date;
}

@Component({
  selector: 'app-video-config',
  standalone: true,
  imports: [CommonModule, FormsModule, FileSizePipe, TruncatePipe],
  templateUrl: './video-config.component.html',
  styleUrls: ['./video-config.component.scss']
})
export class VideoConfigComponent {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  selectedLanguage = '';
  selectedFile: File | null = null;
  currentVideo: string | null = null;
  uploadProgress = 0;
  isDragging = false;

  // Languages
  languages = [
    { id: 1, name: 'English', code: 'en' },
    { id: 2, name: 'Hindi', code: 'hi' },
    { id: 3, name: 'Marathi', code: 'mr' },
    { id: 4, name: 'Tamil', code: 'ta' },
    { id: 5, name: 'Telugu', code: 'te' },
  ];

  // Uploaded videos (dummy data)
  uploadedVideos: UploadedVideo[] = [
    {
      name: 'safety_training_en.mp4',
      size: '45.2 MB',
      url: 'assets/videos/english.mp4',
      language: 'English',
      uploadDate: new Date('2026-06-01')
    },
    {
      name: 'safety_training_hi.mp4',
      size: '38.7 MB',
      url: 'assets/videos/hindi.mp4',
      language: 'Hindi',
      uploadDate: new Date('2026-06-02')
    },
    {
      name: 'safety_training_mr.mp4',
      size: '52.1 MB',
      url: 'assets/videos/marathi.mp4',
      language: 'Marathi',
      uploadDate: new Date('2026-06-03')
    }
  ];

  getLanguageName(language: string): string {
    const lang = this.languages.find(l => l.name === language);
    return lang ? lang.name : language;
  }

  getLanguageStatus(language: string): boolean {
    return this.uploadedVideos.some(v => v.language === language);
  }

  getVideoName(): string {
    if (!this.currentVideo) return '';
    const video = this.uploadedVideos.find(v => v.url === this.currentVideo);
    return video?.name || '';
  }

  onLanguageChange() {
    const video = this.uploadedVideos.find(v => v.language === this.selectedLanguage);
    this.currentVideo = video?.url || null;
    this.selectedFile = null;
    this.uploadProgress = 0;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadProgress = 0;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.uploadProgress = 0;
    }
  }

  uploadVideo() {
    if (!this.selectedFile || !this.selectedLanguage) {
      alert('Please select a language and a video file.');
      return;
    }

    // Check if video already exists for this language
    const existingIndex = this.uploadedVideos.findIndex(v => v.language === this.selectedLanguage);
    if (existingIndex > -1) {
      if (!confirm(`A video already exists for ${this.selectedLanguage}. Do you want to replace it?`)) {
        return;
      }
      // Remove existing video
      this.uploadedVideos.splice(existingIndex, 1);
    }

    // Simulate upload progress
    this.uploadProgress = 0;
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        
        // Add to uploaded videos
        this.uploadedVideos.push({
          name: this.selectedFile!.name,
          size: this.formatFileSize(this.selectedFile!.size),
          url: URL.createObjectURL(this.selectedFile!),
          language: this.selectedLanguage,
          uploadDate: new Date()
        });
        
        alert('Video uploaded successfully!');
        this.selectedFile = null;
        this.uploadProgress = 0;
        
        // Update video player
        this.onLanguageChange();
      }
    }, 300);
  }

  clearFile() {
    this.selectedFile = null;
    this.uploadProgress = 0;
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    return (bytes / 1073741824).toFixed(1) + ' GB';
  }
}