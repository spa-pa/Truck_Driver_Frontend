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
import { ActivatedRoute, Router } from "@angular/router";
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
import { PosterService } from "@shared/_http/poster.service";

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

interface Poster {
  poster_id: number;
  terminal_id: number;
  poster_path: string;
  sequence: number;
  is_active: boolean;
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
  @ViewChild("cameraInput") cameraInput!: ElementRef<HTMLInputElement>;
  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild("driverPhotoCameraInput") driverPhotoCameraInput!: ElementRef<HTMLInputElement>;
  @ViewChild("driverPhotoFileInput") driverPhotoFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild("cameraVideo") cameraVideo?: ElementRef<HTMLVideoElement>;
  @ViewChild("cameraCanvas") cameraCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild("audioPlayer") audioPlayerRef?: ElementRef<HTMLAudioElement>;

  driverDetails: any;
  languages: Language[] = [];

  // UI state
  languageSelected: boolean = false;
  showLanguageSelection: boolean = true;
  showConsent: boolean = false;
  showRegistration: boolean = false;
  showCertification: boolean = false;
  showVideo: boolean = false;
  showPoster: boolean = false;
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
  currentQuestionIndex: number = 0;
  quizResult: QuizResult | null = null;

  // Poster carousel (shown between Video and Quiz, per language)
  posters: Poster[] = [];
  currentPosterIndex: number = 0;
  // True when the driver re-opened the video from the Quiz step ("Watch
  // Video" link) — used so finishing/continuing sends them straight back
  // to the quiz (at the same question) instead of through the poster step again.
  private returningToQuizFromVideo: boolean = false;
  certificationId: any;

  // Forms
  registrationForm!: FormGroup;
  quizForm!: FormGroup;

  // Other
  private subscriptions = new Subscription();
  private modalRef: NgbModalRef | null = null;

  terminalId: number | null = null;
  termsContent: string = "";

  // Driving license photo (camera / upload)
  licensePhotoPreview: string | null = null;
  licensePhotoFileName: string | null = null;

  // Driver photo (camera / upload) - same UX as license photo, but a selfie
  driverPhotoPreview: string | null = null;
  driverPhotoFileName: string | null = null;

  // Live camera modal state (getUserMedia based, works on desktop + mobile)
  // A single modal/video/canvas is shared between the license photo and
  // driver photo fields (only one camera can be open at a time anyway).
  // `activeCameraTarget` tracks which field the modal is currently capturing for.
  activeCameraTarget: "license" | "driving_img" = "license";
  showCameraModal: boolean = false;
  cameraStreamActive: boolean = false;
  cameraError: string | null = null;
  capturedFrame: string | null = null;
  private mediaStream: MediaStream | null = null;

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
    private activatedRoute: ActivatedRoute,
    private consentService: ConsentService,
    private posterService : PosterService
  ) {
    this.translate.setDefaultLang("en");
    this.translate.use("en");
  }

  ngOnInit(): void {
    this.getTerminalIdFromUrl();
    this.getAllLanguage();
    this.initRegistrationForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.stopCameraStream();
  }

  // ------------------------------------------------------------
  // Forms
  // ------------------------------------------------------------

  // Add this method to extract terminalId from URL
  private getTerminalIdFromUrl(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const terminalIdParam = params['terminalId'];

      if (terminalIdParam) {
        this.terminalId = parseInt(terminalIdParam, 10);
        console.log('Terminal ID captured:', this.terminalId);

        // You can use this.terminalId in your API calls or form submissions
        // For example, add it to the registration form
        if (this.registrationForm) {
          this.registrationForm.patchValue({
            terminal_id: this.terminalId
          });
        }
      } else {
        console.warn('No terminalId found in URL');
      }
    });
  }

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
      driving_license: [null], // Photo is optional - not required
      driving_img: [null], // Photo is optional - not required
      terminal_id: [this.terminalId] // Add this field to capture terminalId
    });
  }

  private initQuizForm(): void {
    const controls: any = {};
    this.questions.forEach((q) => {
      controls[`question_${q.id}`] = ["", Validators.required];
    });
    this.quizForm = this.fb.group(controls);
    this.currentQuestionIndex = 0;
  }

  // ------------------------------------------------------------
  // Quiz - one-question-at-a-time navigation
  // ------------------------------------------------------------
  get currentQuestion(): MappedQuestion | null {
    return this.questions[this.currentQuestionIndex] || null;
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }

  get isFirstQuestion(): boolean {
    return this.currentQuestionIndex === 0;
  }

  // ------------------------------------------------------------
  // Poster carousel
  // ------------------------------------------------------------
  get currentPoster(): Poster | null {
    return this.posters[this.currentPosterIndex] || null;
  }

  nextPoster(): void {
    if (this.posters.length === 0) return;
    this.currentPosterIndex =
      (this.currentPosterIndex + 1) % this.posters.length;
  }

  prevPoster(): void {
    if (this.posters.length === 0) return;
    this.currentPosterIndex =
      (this.currentPosterIndex - 1 + this.posters.length) %
      this.posters.length;
  }

  goToPoster(index: number): void {
    if (index < 0 || index >= this.posters.length) return;
    this.currentPosterIndex = index;
  }

  // Loads poster images by terminal id (instead of language id) and maps
  // them to poster cards in order using their `sequence` number (1, 2, ...).
  private loadPostersByTerminalId(): void {
    this.posters = [];
    this.currentPosterIndex = 0;

    if (!this.terminalId) {
      console.warn("No terminalId available to load posters");
      return;
    }

    this.subscriptions.add(
      this.posterService.getPosterByTerminalId(this.terminalId).subscribe({
        next: (response: any) => {
          const posterRes: Poster[] = response?.data || [];
          this.posters = posterRes
            .filter((p) => p.is_active)
            .sort((a, b) => a.sequence - b.sequence);
          this.currentPosterIndex = 0;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Error loading poster:", err);
          this.posters = [];
          this.cdr.detectChanges();
        },
      }),
    );
  }

  // Poster -> Quiz (manual "Continue" from the poster step)
  proceedToQuizFromPoster(): void {
    this.showPoster = false;
    this.showQuiz = true;
    this.cdr.detectChanges();
  }

  // Poster -> Video ("back" link on the poster step)
  backToVideoFromPoster(): void {
    this.showPoster = false;
    this.showVideo = true;
    this.cdr.detectChanges();
  }

  get quizProgressPercent(): number {
    if (!this.questions.length) return 0;
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

  isCurrentQuestionAnswered(): boolean {
    const q = this.currentQuestion;
    if (!q) return false;
    const control = this.quizForm.get(`question_${q.id}`);
    return !!control && control.valid;
  }

  // Explicit read/write for each option's radio state, keyed by the
  // question actually passed in from the template (rather than relying on
  // the formControlName directive, which does not rebind when its bound
  // expression changes on a reused DOM element across questions).
  isOptionSelected(question: MappedQuestion, opt: string): boolean {
    if (!question) return false;
    return this.quizForm.get(`question_${question.id}`)?.value === opt;
  }

  selectOption(question: MappedQuestion, opt: string): void {
    if (!question) return;
    this.quizForm.get(`question_${question.id}`)?.setValue(opt);
  }

  nextQuestion(): void {
    const q = this.currentQuestion;
    if (!q) return;

    const control = this.quizForm.get(`question_${q.id}`);
    control?.markAsTouched();
    if (control?.invalid) return;

    if (this.isLastQuestion) {
      this.submitQuiz();
    } else {
      this.currentQuestionIndex++;
      this.cdr.detectChanges();
      this.resetAudioPlayer();
    }
  }

  previousQuestion(): void {
    if (this.isFirstQuestion) return;
    this.currentQuestionIndex--;
    this.cdr.detectChanges();
    this.resetAudioPlayer();
  }

  // Jump directly to a specific question index (e.g. from a progress
  // dot/stepper UI). Kept here so any future "jump to question" feature
  // reuses the same audio-reset logic instead of reintroducing the bug.
  goToQuestion(index: number): void {
    if (index < 0 || index >= this.questions.length) return;
    this.currentQuestionIndex = index;
    this.cdr.detectChanges();
    this.resetAudioPlayer();
  }

  // ------------------------------------------------------------
  // Question audio player
  // ------------------------------------------------------------
  // The <audio> element persists across questions (it's never destroyed
  // by *ngIf since currentQuestion stays truthy for the whole quiz), so
  // simply updating [src] isn't always enough on every browser. This
  // pauses playback, resets position, and forces the browser to reload
  // the new question's audio_path.
  private resetAudioPlayer(): void {
    setTimeout(() => {
      const audioEl = this.audioPlayerRef?.nativeElement;
      if (audioEl) {
        audioEl.pause();
        audioEl.currentTime = 0;
        audioEl.load();
      }
    });
  }

  // ------------------------------------------------------------
  // Navigation
  // ------------------------------------------------------------
  goToHome(): void {
    this.showResultModal = false;
    this.certificationId = null;
    this.initRegistrationForm();
    this.licensePhotoPreview = null;
    this.licensePhotoFileName = null;
    this.driverPhotoPreview = null;
    this.driverPhotoFileName = null;
    this.showLanguageSelection = true;
    this.showConsent = false;
    this.showRegistration = false;
    this.showVideo = false;
    this.showPoster = false;
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
    // Always go straight to the video itself (never the poster step) — the
    // driver expects "Watch Video" to show the video, then drop them back
    // into the quiz at the same question they left.
    this.returningToQuizFromVideo = true;
    this.showQuiz = false;
    this.showPoster = false;
    this.showVideo = true;
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

  // Called when the driver taps a language card on the Language Selection step.
  // Loads content for that language, then automatically advances to the
  // Consent step (registration happens only after consent is given).
  selectLanguage(languageId: number): void {
    const selectedLang = this.languages.find(
      (l) => l.language_id === languageId,
    );
    if (selectedLang) {

      this.termsContent = ''
      this.subscriptions.add(
        this.consentService.getConsentByLanguageId(languageId).subscribe({
          next: (res) => {
            if (res?.success && res?.data?.length > 0 && res.data[0]?.description && res.data[0]?.description.trim().length > 0) {
              const description = res.data[0]?.description;
              this.termsContent = description;
              this.selectedLanguageId = selectedLang.language_id;
              const langCode = selectedLang.language_code.toLowerCase();
              this.selectedLanguageCode = langCode;
              this.languageService.setLanguage(langCode);
              this.languageSelected = true;
              this.loadTrainingContent(selectedLang.language_id);
              this.initRegistrationForm();
              // Auto-advance: Language Selection -> Consent

              this.showLanguageSelection = false;
              this.showConsent = true;
              this.cdr.detectChanges();

            } else {
              this.toastService.open("Please select other language", "error");
              this.cdr.detectChanges();
            }

          },
          error: (err) => {
            this.toastService.open("Please select other language", "error");
            this.cdr.detectChanges();
          },
        }),
      );
    }
  }

  getConsentPoints(): string[] {
    if (!this.termsContent) {
      return [];
    }

    return this.termsContent
      .split(".")
      .map(point => point.trim())
      .filter(point => point.length > 0)
      .map(point => point + ".");
  }

  // ------------------------------------------------------------
  // Consent step navigation
  // ------------------------------------------------------------
  backToLanguageSelection(): void {
    this.showConsent = false;
    this.showRegistration = false;
    this.showLanguageSelection = true;
    this.cdr.detectChanges();
  }

  proceedFromConsent(): void {
    this.showConsent = false;
    this.showRegistration = true;
    this.cdr.detectChanges();
  }

  private loadTrainingContent(languageId: number): void {
    this.isLoading = true;

      // Poster (now fetched by terminal id instead of language id)
    this.loadPostersByTerminalId();

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
    console.log(this.terminalId);
    const formData = new FormData();
    formData.append("language_id", formValue.language_id);
    formData.append("full_name", formValue.full_name);
    formData.append("mobile_number", formValue.mobile_number);
    formData.append("driving_license_number", formValue.driving_license_number);
    formData.append(
      "driving_license_expiry_date",
      formValue.driving_license_expiry_date,
    );
    if (formValue.driving_license) {
      formData.append("driving_license", formValue.driving_license);
    }
    if (formValue.driving_img) {
      formData.append("driving_img", formValue.driving_img);
    }
    formData.append("terminal_id", formValue.terminal_id);

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
              this.licensePhotoPreview = null;
              this.licensePhotoFileName = null;
              this.driverPhotoPreview = null;
              this.driverPhotoFileName = null;
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

    // Re-watching the video from an in-progress quiz: skip the poster step
    // and drop straight back into the quiz (same question, nothing reset).
    if (this.returningToQuizFromVideo) {
      this.returningToQuizFromVideo = false;
      this.showQuiz = true;
      this.cdr.detectChanges();
      return;
    }

    // Normal forward flow: show poster images first if this language has
    // any, otherwise skip straight to the quiz automatically.
    if (this.posters.length > 0) {
      this.currentPosterIndex = 0;
      this.showPoster = true;
    } else {
      this.showQuiz = true;
    }
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
        next: () => { },
        error: () => { },
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
                this.licensePhotoPreview = null;
                this.licensePhotoFileName = null;
                this.driverPhotoPreview = null;
                this.driverPhotoFileName = null;
                this.showRegistration = false;
                this.showVideo = false;
                this.showCertification = true;
              }
            },
            error: () => { },
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
    this.returningToQuizFromVideo = false;
    this.videoProgress = 0;
    this.quizResult = null;
    this.initQuizForm();
    const video = this.videoPlayer?.nativeElement;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => { });
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

  onFileSelected(
    event: Event,
    target: "license" | "driving_img" = "license"
  ): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.setCapturedPhoto(file, target);
    } else {
      const controlName = target === "driving_img" ? "driving_img" : "driving_license";
      this.registrationForm.patchValue({ [controlName]: null });
    }
    // Reset the input value so selecting the same file again still fires "change"
    input.value = "";
  }

  // Shared by both the license photo and driver photo fields: patches the
  // right form control and builds a preview for whichever field is the target.
  private setCapturedPhoto(
    file: File,
    target: "license" | "driving_img" = "license"
  ): void {
    const controlName = target === "driving_img" ? "driving_img" : "driving_license";
    this.registrationForm.patchValue({ [controlName]: file });
    this.registrationForm.get(controlName)?.updateValueAndValidity();
    this.registrationForm.get(controlName)?.markAsTouched();

    // Build a preview so the driver can see the photo they captured/uploaded
    const reader = new FileReader();
    reader.onload = () => {
      if (target === "driving_img") {
        this.driverPhotoFileName = file.name;
        this.driverPhotoPreview = reader.result as string;
      } else {
        this.licensePhotoFileName = file.name;
        this.licensePhotoPreview = reader.result as string;
      }
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  // ------------------------------------------------------------
  // Live camera capture (works on desktop webcams AND mobile cameras)
  // ------------------------------------------------------------
  // The `capture="environment"` attribute on a hidden file input only works
  // on mobile OS file pickers - desktop browsers ignore it and just open the
  // normal file picker. To get a real camera experience on every device we
  // open a live getUserMedia() preview in a modal instead, and only fall
  // back to the hidden file input if getUserMedia isn't available/denied.
  async openLiveCamera(
    target: "license" | "driving_img" = "license"
  ): Promise<void> {
    this.activeCameraTarget = target;
    this.cameraError = null;
    this.capturedFrame = null;

    if (!navigator.mediaDevices?.getUserMedia) {
      // Very old / unsupported browser - fall back to native picker
      this.openCameraFallback();
      return;
    }

    this.showCameraModal = true;
    this.cdr.detectChanges();

    // License photo uses the rear camera (documents); driver photo is a
    // selfie so it defaults to the front camera.
    const preferredFacingMode = target === "driving_img" ? "user" : "environment";

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: preferredFacingMode },
        audio: false,
      });
    } catch (err) {
      // Some desktops/devices don't have the preferred camera - retry with any camera
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      } catch (fallbackErr) {
        this.cameraError = this.translate.instant(
          "REGISTRATION.LICENSE_PHOTO_CAMERA_DENIED"
        );
        this.cameraStreamActive = false;
        this.cdr.detectChanges();
        return;
      }
    }

    if (this.cameraVideo?.nativeElement) {
      this.cameraVideo.nativeElement.srcObject = this.mediaStream;
      await this.cameraVideo.nativeElement.play();
    }
    this.cameraStreamActive = true;
    this.cdr.detectChanges();
  }

  capturePhoto(): void {
    const video = this.cameraVideo?.nativeElement;
    const canvas = this.cameraCanvas?.nativeElement;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    this.capturedFrame = canvas.toDataURL("image/jpeg", 0.92);
    this.cdr.detectChanges();
  }

  retakePhoto(): void {
    this.capturedFrame = null;
    this.cdr.detectChanges();
    // Safety net: some browsers pause a hidden <video>; make sure it's playing
    const video = this.cameraVideo?.nativeElement;
    if (video && video.paused) {
      video.play().catch(() => { });
    }
  }

  confirmCapturedPhoto(): void {
    const canvas = this.cameraCanvas?.nativeElement;
    if (!canvas) return;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const filePrefix =
          this.activeCameraTarget === "driving_img" ? "driver-photo" : "license-photo";
        const file = new File([blob], `${filePrefix}-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        this.setCapturedPhoto(file, this.activeCameraTarget);
        this.closeCamera();
      },
      "image/jpeg",
      0.92
    );
  }

  closeCamera(): void {
    this.stopCameraStream();
    this.showCameraModal = false;
    this.capturedFrame = null;
    this.cameraError = null;
    this.cdr.detectChanges();
  }

  private stopCameraStream(): void {
    this.mediaStream?.getTracks().forEach((track) => track.stop());
    this.mediaStream = null;
    this.cameraStreamActive = false;
    if (this.cameraVideo?.nativeElement) {
      this.cameraVideo.nativeElement.srcObject = null;
    }
  }

  // Fallback: only used if getUserMedia is unavailable or permission is denied.
  // Opens the hidden file input with the `capture` attribute (mobile only).
  openCameraFallback(): void {
    this.showCameraModal = false;
    if (this.activeCameraTarget === "driving_img") {
      this.driverPhotoCameraInput?.nativeElement.click();
    } else {
      this.cameraInput?.nativeElement.click();
    }
  }

  // Opens the regular file/photo picker (gallery, files app, etc.)
  openFileUpload(target: "license" | "driving_img" = "license"): void {
    this.activeCameraTarget = target;
    if (target === "driving_img") {
      this.driverPhotoFileInput?.nativeElement.click();
    } else {
      this.fileInput?.nativeElement.click();
    }
  }

  removeLicensePhoto(event?: Event): void {
    event?.stopPropagation();
    this.licensePhotoPreview = null;
    this.licensePhotoFileName = null;
    this.registrationForm.patchValue({ driving_license: null });
    this.registrationForm.get("driving_license")?.updateValueAndValidity();
    if (this.cameraInput) this.cameraInput.nativeElement.value = "";
    if (this.fileInput) this.fileInput.nativeElement.value = "";
  }

  removeDriverPhoto(event?: Event): void {
    event?.stopPropagation();
    this.driverPhotoPreview = null;
    this.driverPhotoFileName = null;
    this.registrationForm.patchValue({ driving_img: null });
    this.registrationForm.get("driving_img")?.updateValueAndValidity();
    if (this.driverPhotoCameraInput) this.driverPhotoCameraInput.nativeElement.value = "";
    if (this.driverPhotoFileInput) this.driverPhotoFileInput.nativeElement.value = "";
  }

  // ------------------------------------------------------------
  // Shared camera modal labels - reflect whichever field (license or
  // driver photo) triggered the modal, so the header/buttons read correctly.
  // ------------------------------------------------------------
  get cameraCaptureLabelKey(): string {
    return this.activeCameraTarget === "driving_img"
      ? "REGISTRATION.DRIVER_PHOTO_TAKE"
      : "REGISTRATION.LICENSE_PHOTO_TAKE";
  }

  get cameraRetakeLabelKey(): string {
    return this.activeCameraTarget === "driving_img"
      ? "REGISTRATION.DRIVER_PHOTO_RETAKE"
      : "REGISTRATION.LICENSE_PHOTO_RETAKE";
  }

  get cameraUseLabelKey(): string {
    return this.activeCameraTarget === "driving_img"
      ? "REGISTRATION.DRIVER_PHOTO_USE"
      : "REGISTRATION.LICENSE_PHOTO_USE";
  }

  get cameraUploadLabelKey(): string {
    return this.activeCameraTarget === "driving_img"
      ? "REGISTRATION.DRIVER_PHOTO_UPLOAD"
      : "REGISTRATION.LICENSE_PHOTO_UPLOAD";
  }

}