import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  TemplateRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ApiLanguageService } from "@shared/_http/language.service";
import { VideoService } from "@shared/_http/video.service";
import { QuestionsService } from "@shared/_http/questions.service";
import { LanguageService } from "@shared/services/language.service";
import { DriverMasterService } from "@shared/_http/driver-master.service";
import { ToastService } from "@shared/services/toast.service";
import { DriverTrainingService } from "@shared/_http/driver-training.service";
import { DriverCertificationService } from "@shared/_http/driver-certification.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { DriverCertificationComponent } from "../driver/driver-certification/driver-certification.component";
import { ConsentService } from "@shared/_http/consent.service";

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
  selector: "app-training",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    DriverCertificationComponent,
  ],
  templateUrl: "./training.component.html",
  styleUrls: ["./training.component.scss"],
})
export class TrainingComponent implements OnInit, OnDestroy {
  @ViewChild("videoPlayer") videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild("certificationModal") certificationModal!: TemplateRef<any>;

  driverDetails: any;
  languages: Language[] = [];

  // UI state
  languageSelected: boolean = false;
  showRegistration: boolean = true;
  showCertification: boolean = false;
  showVideo: boolean = false;
  showQuiz: boolean = false;
  showResultModal: boolean = false;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  videoProgress: number = 0;

  // Data
  selectedLanguageId: number = 1;
  selectedLanguageCode: string = "en";
  videoUrl: string = "";
  questions: MappedQuestion[] = [];
  quizResult: QuizResult | null = null;
  certificationId: any;

  // Forms
  registrationForm!: FormGroup;
  quizForm!: FormGroup;

  // Other
  private subscriptions = new Subscription();
  private modalRef: NgbModalRef | null = null;
  showTermsModal: boolean = false;

  termsContent: string = "";
  isLoadingTerms: boolean = false;

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
    private modalService: NgbModal,
    private consentService: ConsentService,
  ) {
    this.translate.setDefaultLang("en");
    this.translate.use("en");
  }

  ngOnInit(): void {
    this.getAllLanguage();
    this.initRegistrationForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // ------------------------------------------------------------
  // Forms
  // ------------------------------------------------------------
  private initRegistrationForm(): void {
    this.registrationForm = this.fb.group({
      language_id: [this.selectedLanguageId],
      full_name: ["", [Validators.required, Validators.minLength(3)]],
      mobile_number: [
        "",
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
      driving_license_number: ["", Validators.required],
      driving_license_expiry_date: [
        "",
        [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)],
      ],
      driving_license: [null, Validators.required],
      terms_agreed: [false, Validators.requiredTrue],
    });
  }

  private initQuizForm(): void {
    const controls: any = {};
    this.questions.forEach((q) => {
      controls[`question_${q.id}`] = ["", Validators.required];
    });
    this.quizForm = this.fb.group(controls);
  }

  // ------------------------------------------------------------
  // Navigation
  // ------------------------------------------------------------
  goToHome(): void {
    this.showResultModal = false;
    this.certificationId = null;
    this.initRegistrationForm();
    this.showRegistration = true;
    this.showVideo = false;
    this.showCertification = false;
  }

  goBack(): void {
    this.showRegistration = true;
    this.showVideo = false;
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.pause();
      this.videoPlayer.nativeElement.currentTime = 0;
    }
    this.cdr.detectChanges();
  }

  goBackVedio() {
    this.showVideo = true;
    this.showQuiz = false;
  }

  // ------------------------------------------------------------
  // Language
  // ------------------------------------------------------------
  getAllLanguage() {
    this.subscriptions.add(
      this.apiLanguageService.getAllLanguages().subscribe({
        next: (value) => {
          this.languages = value.data;
          if (this.languages.length > 0) {
            // 1. Try stored language from localStorage
            const storedLangCode = this.languageService.getCurrentLanguage();
            let defaultLang = this.languages.find(
              (l) =>
                l.language_code.toLowerCase() === storedLangCode.toLowerCase(),
            );

            // 2. If not found, fallback to ENGLISH (case‑insensitive)
            if (!defaultLang) {
              defaultLang = this.languages.find(
                (l) => l.language_name.toLowerCase() === "english",
              );
            }

            // 3. If still not found, fallback to language_code 'en'
            if (!defaultLang) {
              defaultLang = this.languages.find(
                (l) => l.language_code.toLowerCase() === "en",
              );
            }

            // 4. Last resort – pick the first language
            if (!defaultLang) {
              defaultLang = this.languages[0];
            }

            // Set state
            this.selectedLanguageId = defaultLang.language_id;
            const langCode = defaultLang.language_code.toLowerCase();
            this.selectedLanguageCode = langCode;

            // Update Translate and localStorage
            this.languageService.setLanguage(langCode);

            // Load training content for this language
            this.loadTrainingContent(this.selectedLanguageId);
          }
        },
        error: (err) => {
          console.error("Error loading languages:", err);
        },
      }),
    );
  }

  selectLanguage(languageId: number): void {
    const selectedLang = this.languages.find(
      (l) => l.language_id === languageId,
    );
    if (selectedLang) {
      this.selectedLanguageId = selectedLang.language_id;
      const langCode = selectedLang.language_code.toLowerCase();
      this.selectedLanguageCode = langCode;
      this.languageService.setLanguage(langCode);
      this.languageSelected = true;
      this.showRegistration = true;
      this.loadTrainingContent(selectedLang.language_id);
    }
  }

  onLanguageChange(newLanguageId: number | string): void {
    const languageId =
      typeof newLanguageId === "string"
        ? parseInt(newLanguageId, 10)
        : newLanguageId;
    const selectedLang = this.languages.find(
      (l) => l.language_id === languageId,
    );
    if (!selectedLang) return;

    // Reset UI state (but keep registration form intact until after content loads)
    this.languageSelected = false;
    this.showRegistration = false;
    this.showVideo = false;
    this.showQuiz = false;
    this.showResultModal = false;
    this.videoProgress = 0;
    this.questions = [];
    this.quizResult = null;
    this.termsContent = "";

    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.pause();
      this.videoPlayer.nativeElement.currentTime = 0;
    }

    // Load new language content (updates selectedLanguageId and loads video/questions)
    this.selectLanguage(selectedLang.language_id);

    // Re‑initialise the registration form with the new language ID
    this.initRegistrationForm();
  }

  private loadTrainingContent(languageId: number): void {
    this.isLoading = true;

    // Video
    this.subscriptions.add(
      this.videoService.getVideoByLanguageId(languageId).subscribe({
        next: (response: any) => {
          if (response?.data?.path) {
            this.videoUrl = response.data.path;
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Error loading video:", err);
          this.cdr.detectChanges();
        },
      }),
    );

    // Questions
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
          console.error("Error loading questions:", err);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      }),
    );
  }

  private mapQuestions(questionHeaders: QuestionHeader[]): MappedQuestion[] {
    return questionHeaders.map((qh, index) => {
      const questionTextObj = qh.question_header_text?.find(
        (t) => t.language_id === this.selectedLanguageId,
      );
      const questionText = questionTextObj?.text || `Question ${index + 1}`;

      const options = qh.options || [];
      const optionMap: { [key: string]: string } = {};
      const optionImageMap: { [key: string]: string | null } = {};
      const optionMediaMap: { [key: string]: string | null } = {};
      let correctAnswer = "A";
      const optionLabels = ["A", "B", "C", "D"];

      options.forEach((opt, idx) => {
        const label = optionLabels[idx] || String.fromCharCode(65 + idx);
        const textObj = opt.texts?.find(
          (t) => t.language_id === this.selectedLanguageId,
        );
        const optionText = textObj?.text || `Option ${label}`;
        optionMap[label] = optionText;
        optionImageMap[label] = opt.media_url || null;
        optionMediaMap[label] =
          opt.option_type === "image" && opt.media_url ? opt.media_url : null;

        if (opt.is_correct) {
          correctAnswer = label;
        }
      });

      return {
        id: qh.question_header_id,
        question_text: questionText,
        option_a: optionMap["A"] || "Option A",
        option_b: optionMap["B"] || "Option B",
        option_c: optionMap["C"] || "Option C",
        option_d: optionMap["D"] || "Option D",
        correct_answer: correctAnswer,
        audio_path: qh.audio_path || null,
        image_path: qh.image_path || null,
        option_images: optionImageMap,
        option_media: optionMediaMap,
      };
    });
  }

  // ------------------------------------------------------------
  // Registration
  // ------------------------------------------------------------
  registerDriver(): void {
    if (this.registrationForm.invalid) {
      Object.keys(this.registrationForm.controls).forEach((key) => {
        this.registrationForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const formValue = this.registrationForm.value;
    const formData = new FormData();
    formData.append("language_id", formValue.language_id);
    formData.append("full_name", formValue.full_name);
    formData.append("mobile_number", formValue.mobile_number);
    formData.append("driving_license_number", formValue.driving_license_number);
    formData.append(
      "driving_license_expiry_date",
      formValue.driving_license_expiry_date,
    );
    formData.append("driving_license", formValue.driving_license);

    this.subscriptions.add(
      this.driverMasterService.createdriverMaster(formData).subscribe({
        next: (response) => {
          this.driverDetails = response.data;
          this.isLoading = false;
          this.showRegistration = false;
          this.showVideo = true;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Registration error:", err);
          if (err.data) {
            if (err.data.certification) {
              this.certificationId = err.data.certification.certification_id;
              this.modalRef = this.modalService.open(this.certificationModal, {
                size: "xl",
                centered: true,
                backdrop: "static",
              });
              this.initRegistrationForm();
              this.showRegistration = true;
              this.showVideo = false;
            } else if (err.data.driver) {
              this.driverDetails = err.data.driver;
              this.isLoading = false;
              this.showRegistration = false;
              this.showVideo = true;
              this.cdr.detectChanges();
            } else {
              this.toastService.open(err.message, "error");
            }
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      }),
    );
  }

  // ------------------------------------------------------------
  // Video
  // ------------------------------------------------------------
  onVideoProgress(): void {
    const video = this.videoPlayer?.nativeElement;
    if (video) {
      const progress = (video.currentTime / video.duration) * 100;
      this.videoProgress = Math.min(progress, 100);
    }
  }

  onVideoComplete(): void {
    this.videoProgress = 100;
    this.proceedToQuiz();
  }

  proceedToQuiz(): void {
    if (this.videoProgress < 90) {
      return;
    }
    this.showVideo = false;
    this.showQuiz = true;
    this.cdr.detectChanges();
  }

  // ------------------------------------------------------------
  // Quiz
  // ------------------------------------------------------------
  submitQuiz(): void {
    if (this.quizForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const answers = this.quizForm.value;

    let correct = 0;
    this.questions.forEach((q) => {
      if (answers[`question_${q.id}`] === q.correct_answer) {
        correct++;
      }
    });

    const score = Math.round((correct / this.questions.length) * 100);
    const passed = score >= 70;

    const passedMessage =
      this.translate.instant("MODAL.PASSED") ||
      "You have successfully passed the safety training! Your certificate is ready.";
    const failedMessage =
      this.translate.instant("MODAL.FAILED") ||
      "You did not meet the passing score of 70%. Please review the material and try again.";

    this.quizResult = {
      passed,
      score,
      message: passed ? passedMessage : failedMessage,
    };

    this.isSubmitting = false;
    this.showQuiz = false;
    if (!passed) this.showResultModal = true;
    this.cdr.detectChanges();

    this.saveQuizResult(score, correct, passed);
  }

  private saveQuizResult(
    score: number,
    correct: number,
    passed: boolean,
  ): void {
    const formData = {
      driver_id: this.driverDetails.driver_id,
      is_success: passed,
      total_question: this.questions.length,
      correct_question: correct,
      questions: this.questions,
    };
    this.subscriptions.add(
      this.driverTrainingService.createdriverTraining(formData).subscribe({
        next: () => {},
        error: () => {},
      }),
    );

    if (passed) {
      const certificationFormData = {
        driver_id: this.driverDetails.driver_id,
        expiry_date: this.getOneYearExpiryDate(),
      };
      this.subscriptions.add(
        this.driverCertification
          .createDriverCertification(certificationFormData)
          .subscribe({
            next: (response) => {
              if (response.data.certification_id) {
                this.showResultModal = false;
                this.certificationId = response.data.certification_id;
                this.initRegistrationForm();
                this.showRegistration = false;
                this.showVideo = false;
                this.showCertification = true;
              }
            },
            error: () => {},
          }),
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

  watchVideoAgain(): void {
    this.showResultModal = false;
    this.showQuiz = false;
    this.showVideo = true;
    this.videoProgress = 0;
    this.quizResult = null;
    this.initQuizForm();
    const video = this.videoPlayer?.nativeElement;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
    this.cdr.detectChanges();
  }

  // ------------------------------------------------------------
  // Modal
  // ------------------------------------------------------------
  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
    this.showResultModal = false;
    if (this.quizResult && !this.quizResult.passed) {
      this.showQuiz = true;
    }
    this.cdr.detectChanges();
  }

  closeModalOnOverlay(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains("modal-overlay")) {
      this.closeModal();
    }
  }

  // ------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------
  getOptionText(question: MappedQuestion, option: string): string {
    const key = "option_" + option.toLowerCase();
    return (question as any)[key] || "";
  }

  getOptionImage(question: MappedQuestion, option: string): string | null {
    if (!question || !option || !question.option_images) return null;
    return question.option_images[option] || null;
  }

  private getOneYearExpiryDate(): string {
    const today = new Date();
    const expiryDate = new Date(today);
    expiryDate.setFullYear(today.getFullYear() + 1);
    const day = String(expiryDate.getDate()).padStart(2, "0");
    const month = String(expiryDate.getMonth() + 1).padStart(2, "0");
    const year = expiryDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.registrationForm.patchValue({ driving_license: file });
      this.registrationForm.get("driving_license")?.updateValueAndValidity();
    } else {
      this.registrationForm.patchValue({ driving_license: null });
    }
  }

  // ------------------------------------------------------------
  // Terms Modal
  // ------------------------------------------------------------
  openTermsModal(event: Event): void {
    event.preventDefault(); // Prevents checkbox from toggling

    this.showTermsModal = true;
    this.isLoadingTerms = true;

    const langId = this.selectedLanguageId;

    this.consentService.getConsentByLanguageId(langId).subscribe({
      next: (res) => {
        this.isLoadingTerms = false;
        if (res?.success && res?.data?.length > 0) {
          const description = res.data[0].description;
          if (description && description.trim().length > 0) {
            this.termsContent = description;
          } else {
            this.termsContent = this.translate.instant("TERMS.CONTENT");
          }
        } else {
          this.termsContent = this.translate.instant("TERMS.CONTENT");
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load consent:", err);
        this.isLoadingTerms = false;
        this.termsContent = this.translate.instant("TERMS.CONTENT");
        this.cdr.detectChanges();
      },
    });
  }

  closeTermsModal(): void {
    this.showTermsModal = false;
  }

  closeTermsModalOnOverlay(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains("modal-overlay")) {
      this.closeTermsModal();
    }
  }

  acceptTerms(): void {
    const control = this.registrationForm.get("terms_agreed");
    if (control) {
      control.patchValue(true);
      control.markAsTouched();
      control.updateValueAndValidity({ emitEvent: false }); // suppress validation events
      this.cdr.detectChanges(); // force UI update before closing modal
    }
    this.closeTermsModal();
  }

  declineTerms(): void {
    const control = this.registrationForm.get("terms_agreed");
    control?.patchValue(false);
    control?.markAsTouched();
    control?.updateValueAndValidity();
    this.closeTermsModal();
  }
}
