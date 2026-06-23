// src/app/modules/masters/training/training.component.ts

import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LanguageService } from '@shared/_http/language.service';
import { VideoService } from '@shared/_http/video.service';
import { QuestionsService } from '@shared/_http/questions.service';

interface Language {
  code: string;
  name: string;
  language_id?: number;
}

interface VideoData {
  video_id: number;
  language_id: number;
  path: string;
  is_active: boolean;
  created_by: number;
  created_at: string;
  modified_by: number | null;
  modified_at: string | null;
  deleted_by: number | null;
  deleted_at: string | null;
}

interface QuestionOption {
  question_option_id: number;
  question_header_id: number;
  media_url: string | null;
  option_type: string;
  is_correct: boolean;
  is_active: boolean;
  created_by: number;
  created_at: string;
  modified_by: number | null;
  modified_at: string | null;
  deleted_by: number | null;
  deleted_at: string | null;
  texts: {
    question_option_text_id: number;
    question_option_id: number;
    language_id: number;
    text: string;
    is_active: boolean;
    created_by: number;
    created_at: string;
    modified_by: number | null;
    modified_at: string | null;
    deleted_by: number | null;
    deleted_at: string | null;
  }[];
}

interface QuestionHeader {
  question_header_id: number;
  audio_path: string | null;
  image_path: string | null;
  is_active: boolean;
  created_by: number;
  created_at: string;
  modified_by: number | null;
  modified_at: string | null;
  deleted_by: number | null;
  deleted_at: string | null;
  question_header_text: {
    question_header_text_id: number;
    question_header_id: number;
    language_id: number;
    text: string;
    is_active: boolean;
    created_by: number;
    created_at: string;
    modified_by: number | null;
    modified_at: string | null;
    deleted_by: number | null;
    deleted_at: string | null;
  }[];
  options: QuestionOption[];
}

interface MappedQuestion {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  audio_path: string | null;
  image_path: string | null;
  option_images: { [key: string]: string | null };
  option_media: { [key: string]: string | null };
}

interface QuizResult {
  passed: boolean;
  score?: number;
  message: string;
}

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit, OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  // Languages
  languages: Language[] = [
    { code: 'en', name: 'English', language_id: 1 },
    { code: 'hi', name: 'Hindi', language_id: 2 },
    { code: 'mr', name: 'Marathi', language_id: 3 },
    { code: 'gu', name: 'Gujarati', language_id: 4 }
  ];

  // State
  languageSelected: boolean = false;
  showRegistration: boolean = false;
  showVideo: boolean = false;
  showQuiz: boolean = false;
  showResultModal: boolean = false;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  videoProgress: number = 0;

  // Data
  selectedLanguage: string = '';
  selectedLanguageId: number = 1;
  videoUrl: string = '';
  questions: MappedQuestion[] = [];
  quizResult: QuizResult | null = null;

  // Forms
  registrationForm!: FormGroup;
  quizForm!: FormGroup;

  // Subscriptions
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService,
    private videoService: VideoService,
    private questionsService: QuestionsService
  ) { }

  ngOnInit(): void {
    this.initRegistrationForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // ============================================
  // FORM INITIALIZATION
  // ============================================
  private initRegistrationForm(): void {
    this.registrationForm = this.fb.group({
      driver_name: ['', [Validators.required, Validators.minLength(3)]],
      mobile_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      truck_number: ['', Validators.required],
      driving_license: ['', Validators.required]
    });
  }

  private initQuizForm(): void {
    const controls: any = {};
    this.questions.forEach(q => {
      controls[`question_${q.id}`] = ['', Validators.required];
    });
    this.quizForm = this.fb.group(controls);
  }

  // ============================================
  // NAVIGATION
  // ============================================
  goToHome(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    this.languageSelected = false;
    this.showRegistration = false;
    this.showVideo = false;
    this.showQuiz = false;
    this.showResultModal = false;
    this.videoProgress = 0;
    this.selectedLanguage = '';
    this.selectedLanguageId = 1;
    this.questions = [];
    this.quizResult = null;
    this.initRegistrationForm();

    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.pause();
      this.videoPlayer.nativeElement.currentTime = 0;
    }

    this.cdr.detectChanges();
  }

  // ============================================
  // LANGUAGE SELECTION
  // ============================================
  selectLanguage(code: string): void {
    const selectedLang = this.languages.find(l => l.code === code);
    if (selectedLang) {
      this.selectedLanguage = code;
      this.selectedLanguageId = selectedLang.language_id || 1;
      this.languageSelected = true;
      this.showRegistration = true;
      this.loadTrainingContent(selectedLang.language_id || 1);
    }
  }

  private loadTrainingContent(languageId: number): void {
    this.isLoading = true;

    // Load Video
    this.subscriptions.add(
      this.videoService.getVideoByLanguageId(languageId).subscribe({
        next: (response: any) => {

          if (response && response.data) {
            const video = response.data;
            // Check if path is already a full URL or needs to be constructed
            if (video.path) {
              // Use the path directly from the response
              this.videoUrl = response.data.path || video.path;
              if (!this.videoUrl.startsWith('http://') && !this.videoUrl.startsWith('https://')) {
                this.videoUrl
                // If it's a relative path, construct the full URL
                this.videoUrl = `${video.path}`;
              }
            }
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading video:', err);
          // Fallback to default video
          this.videoUrl = 'assets/video/auth-bg.mp4';
          this.cdr.detectChanges();
        }
      })
    );

    // Load Questions
    this.subscriptions.add(
      this.questionsService.getquestionsByLanguageId(languageId).subscribe({
        next: (response) => {
          const questionRes: QuestionHeader[] = response.data;
          if (questionRes && questionRes.length > 0) {
            this.questions = this.mapQuestions(questionRes);
            this.initQuizForm();
          } else {
            // Fallback to sample questions
            // this.questions = this.getSampleQuestions();
            // this.initQuizForm();
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading questions:', err);
          // Fallback to sample questions
          // this.questions = this.getSampleQuestions();
          // this.initQuizForm();
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      })
    );
  }

  // ============================================
  // MAP QUESTIONS DATA
  // ============================================
  private mapQuestions(questionHeaders: QuestionHeader[]): MappedQuestion[] {
    return questionHeaders.map((qh, index) => {
      // Get question text for selected language
      const questionTextObj = qh.question_header_text?.find(t => t.language_id === this.selectedLanguageId);
      const questionText = questionTextObj?.text || `Question ${index + 1}`;

      // Map options
      const options = qh.options || [];
      const optionMap: { [key: string]: string } = {};
      const optionImageMap: { [key: string]: string | null } = {};
      const optionMediaMap: { [key: string]: string | null } = {};
      let correctAnswer = 'A';
      const optionLabels = ['A', 'B', 'C', 'D'];

      options.forEach((opt, idx) => {
        const label = optionLabels[idx] || String.fromCharCode(65 + idx);

        // Get option text for selected language
        const textObj = opt.texts?.find(t => t.language_id === this.selectedLanguageId);
        const optionText = textObj?.text || `Option ${label}`;
        optionMap[label] = optionText;

        // Store option image if exists
        optionImageMap[label] = opt.media_url || null;

        // Store media URL for image type options
        if (opt.option_type === 'image' && opt.media_url) {
          optionMediaMap[label] = opt.media_url;
        } else {
          optionMediaMap[label] = null;
        }

        // Check if this option is correct
        if (opt.is_correct) {
          correctAnswer = label;
        }
      });

      return {
        id: qh.question_header_id,
        question_text: questionText,
        option_a: optionMap['A'] || 'Option A',
        option_b: optionMap['B'] || 'Option B',
        option_c: optionMap['C'] || 'Option C',
        option_d: optionMap['D'] || 'Option D',
        correct_answer: correctAnswer,
        audio_path: qh.audio_path || null,
        image_path: qh.image_path || null,
        option_images: optionImageMap,
        option_media: optionMediaMap
      };
    });
  }

  // ============================================
  // REGISTRATION
  // ============================================
  registerDriver(): void {
    if (this.registrationForm.invalid) {
      Object.keys(this.registrationForm.controls).forEach(key => {
        this.registrationForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const formData = this.registrationForm.value;

    // Simulate API call - Replace with actual registration API
    this.subscriptions.add(
      // Replace with your actual registration service
      // this.registrationService.registerDriver(formData).subscribe({
      //   next: (response) => {
      //     this.isLoading = false;
      //     this.showRegistration = false;
      //     this.showVideo = true;
      //     this.cdr.detectChanges();
      //   },
      //   error: (err) => {
      //     console.error('Registration error:', err);
      //     this.isLoading = false;
      //     this.cdr.detectChanges();
      //   }
      // })

      // Simulated response
    );

    setTimeout(() => {
      console.log('Driver Registered:', formData);
      this.isLoading = false;
      this.showRegistration = false;
      this.showVideo = true;
      this.cdr.detectChanges();
    }, 1500)
  }

  // ============================================
  // VIDEO
  // ============================================
  onVideoProgress(): void {
    const video = this.videoPlayer?.nativeElement;
    if (video) {
      const progress = (video.currentTime / video.duration) * 100;
      this.videoProgress = Math.min(progress, 100);
    }
  }

  onVideoComplete(): void {
    this.videoProgress = 100;
  }

  proceedToQuiz(): void {
    if (this.videoProgress < 90) {
      return;
    }
    this.showVideo = false;
    this.showQuiz = true;
    this.cdr.detectChanges();
  }

  // ============================================
  // QUIZ
  // ============================================
  submitQuiz(): void {
    if (this.quizForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const answers = this.quizForm.value;

    let correct = 0;
    this.questions.forEach(q => {
      if (answers[`question_${q.id}`] === q.correct_answer) {
        correct++;
      }
    });

    const score = Math.round((correct / this.questions.length) * 100);
    const passed = score >= 70;

    this.quizResult = {
      passed,
      score,
      message: passed
        ? 'You have successfully passed the safety training! Your certificate is ready.'
        : 'You did not meet the passing score of 70%. Please review the material and try again.'
    };

    this.isSubmitting = false;
    this.showQuiz = false;
    this.showResultModal = true;
    this.cdr.detectChanges();

    this.saveQuizResult(score, passed);
  }

  private saveQuizResult(score: number, passed: boolean): void {
    // Simulate API call - Replace with actual API
    setTimeout(() => {
      console.log('Quiz Result Saved:', { score, passed });
    }, 500);
  }

  retakeQuiz(): void {
    this.showResultModal = false;
    this.showQuiz = true;
    this.quizResult = null;
    this.initQuizForm();
    this.cdr.detectChanges();
  }

  // ============================================
  // CERTIFICATE
  // ============================================
  downloadCertificate(): void {
    console.log('Downloading certificate...');
    alert('Certificate downloaded successfully!');
  }

  // ============================================
  // MODAL
  // ============================================
  closeModal(): void {
    this.showResultModal = false;
    this.cdr.detectChanges();
  }

  closeModalOnOverlay(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }

  // ============================================
  // SAMPLE QUESTIONS (Fallback)
  // ============================================
  // private getSampleQuestions(): MappedQuestion[] {
  //   return [
  //     {
  //       id: 1,
  //       question_text: 'What is the first thing you should do before starting a long journey?',
  //       option_a: 'Check the weather forecast',
  //       option_b: 'Check tire pressure and vehicle condition',
  //       option_c: 'Plan your route',
  //       option_d: 'Take a nap',
  //       correct_answer: 'B',
  //       audio_path: null,
  //       image_path: null,
  //       option_images: { A: null, B: null, C: null, D: null },
  //       option_media: { A: null, B: null, C: null, D: null }
  //     },
  //     {
  //       id: 2,
  //       question_text: 'What is the safe following distance in normal conditions?',
  //       option_a: '1 second',
  //       option_b: '2 seconds',
  //       option_c: '3 seconds',
  //       option_d: '4 seconds',
  //       correct_answer: 'C',
  //       audio_path: null,
  //       image_path: null,
  //       option_images: { A: null, B: null, C: null, D: null },
  //       option_media: { A: null, B: null, C: null, D: null }
  //     },
  //     {
  //       id: 3,
  //       question_text: 'What should you do when driving in foggy conditions?',
  //       option_a: 'Use high beams',
  //       option_b: 'Use fog lights and slow down',
  //       option_c: 'Drive faster to get out of fog',
  //       option_d: 'Use hazard lights always',
  //       correct_answer: 'B',
  //       audio_path: null,
  //       image_path: null,
  //       option_images: { A: null, B: null, C: null, D: null },
  //       option_media: { A: null, B: null, C: null, D: null }
  //     },
  //     {
  //       id: 4,
  //       question_text: 'What is the maximum allowed working hours for a driver in a day?',
  //       option_a: '8 hours',
  //       option_b: '10 hours',
  //       option_c: '12 hours',
  //       option_d: '14 hours',
  //       correct_answer: 'B',
  //       audio_path: null,
  //       image_path: null,
  //       option_images: { A: null, B: null, C: null, D: null },
  //       option_media: { A: null, B: null, C: null, D: null }
  //     }
  //   ];
  // }

  getOptionText(question: MappedQuestion, option: string): string {
    const key = 'option_' + option.toLowerCase();
    return (question as any)[key] || '';
  }
}