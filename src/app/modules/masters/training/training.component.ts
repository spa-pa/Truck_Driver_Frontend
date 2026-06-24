// src/app/modules/masters/training/training.component.ts

import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApiLanguageService } from '@shared/_http/language.service';
import { VideoService } from '@shared/_http/video.service';
import { QuestionsService } from '@shared/_http/questions.service';
import { LanguageService } from '@shared/services/language.service';
import { DriverMasterService } from '@shared/_http/driver-master.service';
import { ToastService } from '@shared/services/toast.service';
import { DriverTrainingService } from '@shared/_http/driver-training.service';
import { DriverCertification } from '@shared/models/driver-certification.model';
import { DriverCertificationService } from '@shared/_http/driver-certification.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DriverCertificationComponent } from '../driver/driver-certification/driver-certification.component';

interface Language {
  language_code: string;
  language_name: string;
  language_id: number;
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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    DriverCertificationComponent
  ],
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit, OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  @ViewChild('certificationModal') certificationModal!: TemplateRef<any>;

  // Driver 
  driverDetails: any;
  // Languages
  languages: Language[] = [];

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
  selectedLanguage: number = 0;
  selectedLanguageId: number = 1;
  selectedLanguageCode: string = 'en';
  videoUrl: string = '';
  questions: MappedQuestion[] = [];
  quizResult: QuizResult | null = null;

  // Forms
  registrationForm!: FormGroup;
  quizForm!: FormGroup;

  // Subscriptions
  private subscriptions = new Subscription();

  certificationId: any;

  private modalRef: NgbModalRef | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService,
    private apiLanguageService: ApiLanguageService,
    private videoService: VideoService,
    private questionsService: QuestionsService,
    private translate: TranslateService,
    private driverMasterService: DriverMasterService,
    private toastService: ToastService,
    private driverTrainingService: DriverTrainingService,
    private driverCertification: DriverCertificationService,
    private modalService: NgbModal
  ) {
    // Set default language
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  ngOnInit(): void {
    this.getAllLanguage();
    this.initRegistrationForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // ============================================
  // FORM INITIALIZATION
  // ============================================

  getAllLanguage() {
    this.subscriptions.add(this.apiLanguageService.getAllLanguages().subscribe({
      next: (value) => {
        this.languages = value.data;
      },
      error: (err) => {
        console.error('Error loading languages:', err);
      }
    }));
  }

  private initRegistrationForm(): void {
    this.registrationForm = this.fb.group({
      language_id: [this.selectedLanguageId],
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      mobile_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      driving_license_number: ['', Validators.required],
      driving_license_expiry_date: ['10/12/1998', Validators.required]
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
    this.selectedLanguage = 0;
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
  selectLanguage(languageId: number): void {
    const selectedLang = this.languages.find(l => l.language_id === languageId);
    if (selectedLang) {
      this.selectedLanguage = languageId;
      this.selectedLanguageId = selectedLang.language_id || 1;

      // Set language for ngx-translate
      const langCode = this.getLanguageCode(selectedLang.language_name);
      this.selectedLanguageCode = langCode;
      this.languageService.setLanguage(langCode);
      this.languageSelected = true;
      this.showRegistration = true;
      this.loadTrainingContent(selectedLang.language_id || 1);
    }
  }

  private getLanguageCode(languageName: string): string {
    const map: { [key: string]: string } = {
      'english': 'en',
      'hindi': 'hi',
      'marathi': 'mr',
      'gujarati': 'gu',
      "tamil": "ta",
      "telugu": "te"
    };

    return map[languageName?.toLowerCase()] || 'en';
  }

  private loadTrainingContent(languageId: number): void {
    this.isLoading = true;

    // Load Video
    this.subscriptions.add(
      this.videoService.getVideoByLanguageId(languageId).subscribe({
        next: (response: any) => {
          if (response && response.data) {
            const video = response.data;
            if (video.path) {
              // Use the path directly from the response
              this.videoUrl = response.data.path || video.path;
              if (!this.videoUrl.startsWith('http://') && !this.videoUrl.startsWith('https://')) {                // If it's a relative path, construct the full URL
                this.videoUrl = `${video.path}`;
              }

              // this.videoUrl = 'http://localhost:3000/resources/video/1782118519595-330376523.mp4';
            }
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading video:', err);
          // this.videoUrl = 'http://localhost:3000/resources/video/1782118519595-330376523.mp4';
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
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading questions:', err);
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
      this.driverMasterService.createdriverMaster(formData).subscribe({
        next: (response) => {
          this.driverDetails = response.data;
          this.isLoading = false;
          this.showRegistration = false;
          this.showVideo = true;
          this.cdr.detectChanges();
        },
        error: (err) => {
          if (err.data) {
            if (err.data.driver) {
              this.driverDetails = err.data.driver;
            }
            if (err.data.certification) {
              this.certificationId = err.data.certification.certification_id;
              this.modalRef = this.modalService.open(this.certificationModal, {
                size: 'xl',
                centered: true,
                backdrop: 'static'
              });
              this.initRegistrationForm();
              this.showRegistration = true;
              this.showVideo = false;
            }
          }
          console.error('Registration error:', err);
          this.isLoading = false;
          this.toastService.open(err.message, 'error');
          this.cdr.detectChanges();
        }
      })

      // Simulated response
    );

    // setTimeout(() => {
    //   console.log('Driver Registered:', formData);
    //   this.isLoading = false;
    //   this.showRegistration = false;
    //   this.showVideo = true;
    //   this.cdr.detectChanges();
    // }, 1500);
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

    // Get translated messages
    const passedMessage = this.translate.instant('MODAL.PASSED') ||
      'You have successfully passed the safety training! Your certificate is ready.';
    const failedMessage = this.translate.instant('MODAL.FAILED') ||
      'You did not meet the passing score of 70%. Please review the material and try again.';

    this.quizResult = {
      passed,
      score,
      message: passed ? passedMessage : failedMessage
    };

    this.isSubmitting = false;
    this.showQuiz = false;
    this.showResultModal = true;
    this.cdr.detectChanges();

    this.saveQuizResult(score, correct, passed);
  }

  private saveQuizResult(score: number, correct: number, passed: boolean): void {
    // Simulate API call - Replace with actual API
    setTimeout(() => {
      console.log('Quiz Result Saved:', { score, passed });
    }, 500);

    const formData = {
      driver_id: this.driverDetails.driver_id,
      is_success: passed,
      total_question: this.questions.length,
      correct_question: correct,
      questions: this.questions,

    }
    this.subscriptions.add(
      this.driverTrainingService.createdriverTraining(formData).subscribe({
        next: (response) => {
        },
        error: (err) => {
        }
      })
    );

    if (passed) {
      const certificationFormData = {
        driver_id: this.driverDetails.driver_id,
        expiry_date: '01/01/2050'
      }
      this.subscriptions.add(
        this.driverCertification.createDriverCertification(certificationFormData).subscribe({
          next: (response) => {
            if (response.data.certification_id) {
              this.showResultModal = false;
              this.certificationId = response.data.certification_id;
              this.modalRef = this.modalService.open(this.certificationModal, {
                size: 'xl',
                centered: true,
                backdrop: 'static'
              });
            }
          },
          error: (err) => {
          }
        })
      );
    }
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
    const downloadText = this.translate.instant('MODAL.DOWNLOAD_SUCCESS') ||
      'Certificate downloaded successfully!';
    alert(downloadText);
  }

  // ============================================
  // MODAL
  // ============================================
  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
    this.showResultModal = false;
    this.cdr.detectChanges();
  }

  closeModalOnOverlay(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }

  // ============================================
  // HELPER METHODS
  // ============================================
  getOptionText(question: MappedQuestion, option: string): string {
    const key = 'option_' + option.toLowerCase();
    return (question as any)[key] || '';
  }

  getOptionImage(question: MappedQuestion, option: string): string | null {
    if (!question || !option || !question.option_images) return null;
    return question.option_images[option] || null;
  }

  // Get translated text with parameters
  getTranslation(key: string, params?: any): string {
    return this.translate.instant(key, params);
  }
}