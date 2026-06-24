// src/app/modules/quiz-config/quiz-config.component.ts
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
} from "@angular/forms";
import { LanguageService } from "../../shared/_http/language.service";
import { QuizService } from "../../shared/_http/quiz.service";
import {
  QuestionHeaderText,
  OptionText,
  QuestionOption,
  QuestionPayload,
} from "../../shared/models/quiz-config";
import { Subscription } from "rxjs";
import { ModalService } from "../../shared/services/modal.service";
import { ModalComponent } from "@shared/component/modal/modal.component";

@Component({
  selector: "app-quiz-config",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./quiz-config.component.html",
  styleUrls: ["./quiz-config.component.scss"],
})
export class QuizConfigComponent implements OnInit {
  // Language properties
  languages: any[] = [];
  selectedLanguageId: number | null = null;
  isLoading = false;

  // Questions array
  questions: any[] = [];

  // Form properties
  questionForm: FormGroup;
  optionControls: FormArray;

  // Media previews
  questionImagePreview: string | null = null;
  questionAudioPreview: string | null = null;
  questionImageFile: File | null = null;
  questionAudioFile: File | null = null;

  // Option image files
  optionImageFiles: { [key: number]: File } = {};

  // UI state
  isSaving = false;
  isEditing = false;
  editingQuestionId: number | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private languageService: LanguageService,
    private quizService: QuizService,
    private modalService: ModalService,
  ) {
    this.questionForm = this.fb.group({
      questionText: ["", Validators.required],
    });

    this.optionControls = this.fb.array([]);
    this.questionForm.addControl("options", this.optionControls);

    this.initializeOptions(4);
  }

  ngOnInit() {
    this.loadLanguages();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // ============ LANGUAGE METHODS ============
  loadLanguages() {
    this.isLoading = true;
    this.subscriptions.add(
      this.languageService.getAllLanguages().subscribe({
        next: (response: any) => {
          if (response && response.data && Array.isArray(response.data)) {
            this.languages = response.data;
          } else if (Array.isArray(response)) {
            this.languages = response;
          } else {
            this.languages = [];
          }

          this.isLoading = false;
          console.log("Languages loaded:", this.languages);

          if (this.languages.length > 0) {
            const englishLang = this.languages.find(
              (lang) =>
                lang.language_code === "EN" || lang.language_name === "ENGLISH",
            );
            if (englishLang) {
              this.selectedLanguageId = englishLang.language_id;
              this.loadQuestions();
            } else {
              this.selectedLanguageId = this.languages[0].language_id;
              this.loadQuestions();
            }
          }
        },
        error: (err) => {
          console.error("Error loading languages:", err);
          this.isLoading = false;
        },
      }),
    );
  }

  // ============ QUESTION METHODS ============
  loadQuestions() {
    if (!this.selectedLanguageId) {
      this.questions = [];
      return;
    }

    this.isLoading = true;
    this.subscriptions.add(
      this.quizService.getQuestions().subscribe({
        next: (response) => {
          this.questions = response
            .filter((q: any) => {
              return q.question_header_text?.some(
                (ht: any) => ht.language_id === Number(this.selectedLanguageId),
              );
            })
            .map((q: any) => this.transformQuestion(q));
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Error loading questions:", err);
          this.isLoading = false;
        },
      }),
    );
  }

  transformQuestion(question: any): any {
    const headerText = question.question_header_text?.find(
      (ht: any) => ht.language_id === Number(this.selectedLanguageId),
    );

    const options =
      question.options?.map((opt: any) => {
        const optionText = opt.texts?.find(
          (t: any) => t.language_id === Number(this.selectedLanguageId),
        );
        return {
          optionId: opt.question_option_id,
          optionType: opt.option_type || "text",
          text: optionText?.text || "",
          imageUrl: opt.media_url, // This already has the full URL
          isCorrect: opt.is_correct,
        };
      }) || [];

    return {
      questionId: question.question_header_id,
      questionText: headerText?.text || "",
      questionMedia: {
        audioUrl: question.audio_path, // This already has the full URL
        imageUrl: question.image_path, // This already has the full URL
      },
      language: this.selectedLanguageId,
      options: options,
    };
  }

  // ============ FORM METHODS ============
  initializeOptions(count: number) {
    this.optionControls.clear();
    for (let i = 0; i < count; i++) {
      this.optionControls.push(this.createOptionGroup());
    }
  }

  createOptionGroup(): FormGroup {
    return this.fb.group({
      text: ["", Validators.required],
      imageUrl: [null],
      imagePreview: [null],
      isCorrect: [false],
    });
  }

  getOptionControl(index: number, controlName: string): FormControl {
    const control = this.optionControls.at(index).get(controlName);
    return control as FormControl;
  }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  getLanguageName(languageId: number): string {
    const lang = this.languages.find(
      (l) => l.language_id === Number(languageId),
    );
    return lang ? lang.language_name : "Unknown";
  }

  getLanguageDisplay(languageId: number): string {
    if (!languageId) return "Unknown";
    const lang = this.languages.find(
      (l) => l.language_id === Number(languageId),
    );
    return lang ? `${lang.language_name} (${lang.language_code})` : "Unknown";
  }

  // ============ FILE UPLOAD METHODS ============
  triggerFileInput(type: string) {
    if (type === "questionImage") {
      const input = document.querySelector(
        "#questionImageInput",
      ) as HTMLInputElement;
      if (input) {
        input.value = "";
        input.click();
      }
    } else if (type === "questionAudio") {
      const input = document.querySelector(
        "#questionAudioInput",
      ) as HTMLInputElement;
      if (input) {
        input.value = "";
        input.click();
      }
    }
  }

  triggerOptionImageInput(index: number) {
    const input = document.querySelector(
      `#optionImageInput_${index}`,
    ) as HTMLInputElement;
    if (input) {
      input.value = "";
      input.click();
    }
  }

  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === "questionImage") {
          this.questionImagePreview = e.target?.result as string;
          this.questionImageFile = file;
        } else if (type === "questionAudio") {
          this.questionAudioPreview = e.target?.result as string;
          this.questionAudioFile = file;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onOptionImageSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const optionGroup = this.optionControls.at(index) as FormGroup;
        optionGroup.patchValue({
          imageUrl: e.target?.result,
          imagePreview: e.target?.result,
        });
        // Store with correct index (0-based)
        this.optionImageFiles[index] = file;
        console.log(`Option ${index} image stored:`, file.name);
      };
      reader.readAsDataURL(file);
    }
  }

  removeQuestionMedia(type: string) {
    if (type === "image") {
      this.questionImagePreview = null;
      this.questionImageFile = null;
      const input = document.querySelector(
        "#questionImageInput",
      ) as HTMLInputElement;
      if (input) input.value = "";
    } else if (type === "audio") {
      this.questionAudioPreview = null;
      this.questionAudioFile = null;
      const input = document.querySelector(
        "#questionAudioInput",
      ) as HTMLInputElement;
      if (input) input.value = "";
    }
  }

  removeOptionImage(index: number) {
    const optionGroup = this.optionControls.at(index) as FormGroup;
    optionGroup.patchValue({ imageUrl: null, imagePreview: null });
    delete this.optionImageFiles[index];
    const input = document.querySelector(
      `#optionImageInput_${index}`,
    ) as HTMLInputElement;
    if (input) input.value = "";
  }

  // ============ OPTION METHODS ============
  removeOption(index: number) {
    if (this.optionControls.length > 2) {
      this.optionControls.removeAt(index);
      delete this.optionImageFiles[index];
    } else {
      alert("Minimum 2 options required");
    }
  }

  setCorrectOption(selectedIndex: number) {
    for (let i = 0; i < this.optionControls.length; i++) {
      this.optionControls.at(i).get("isCorrect")?.setValue(false);
    }
    this.optionControls.at(selectedIndex).get("isCorrect")?.setValue(true);
  }

  // ============ CRUD OPERATIONS ============
  saveQuestion(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    if (this.questionForm.invalid) {
      this.modalService.warning(
        "Incomplete Form",
        "Please enter question text",
      );
      return;
    }
    let hasCorrect = false;
    let hasEmptyOption = false;

    for (let i = 0; i < this.optionControls.length; i++) {
      const optionText = this.optionControls.at(i).get("text")?.value;
      if (!optionText || optionText.trim() === "") {
        hasEmptyOption = true;
        break;
      }
      if (this.optionControls.at(i).get("isCorrect")?.value === true) {
        hasCorrect = true;
      }
    }

    if (hasEmptyOption) {
      this.modalService.warning(
        "Incomplete Options",
        "Please fill in all option texts",
      );
      return;
    }

    if (!hasCorrect) {
      this.modalService.warning(
        "No Correct Answer",
        "Please mark at least one option as correct",
      );
      return;
    }

    // Build payload
    const payload: QuestionPayload = {
      question_header_text: [
        {
          language_id: Number(this.selectedLanguageId),
          text: this.questionForm.get("questionText")?.value,
        },
      ],
      options: this.optionControls.controls.map((control, index) => ({
        option_type: control.get("imagePreview")?.value ? "image" : "text",
        display_order: index + 1,
        is_correct: control.get("isCorrect")?.value || false,
        texts: [
          {
            language_id: Number(this.selectedLanguageId),
            text: control.get("text")?.value,
          },
        ],
      })),
      display_order: this.questions.length + 1,
    };

    // Only include optionImages that actually have files
    const optionImages: { [key: number]: File } = {};
    for (let i = 0; i < this.optionControls.length; i++) {
      const hasImagePreview = !!this.optionControls.at(i).get("imagePreview")
        ?.value;
      const hasFile = !!this.optionImageFiles[i];

      if (hasImagePreview && hasFile) {
        optionImages[i] = this.optionImageFiles[i];
        console.log(
          `✅ Option ${i} has image file:`,
          this.optionImageFiles[i].name,
        );
      }
    }

    console.log("=== optionImages to send ===");
    console.log(optionImages);
    console.log("Keys:", Object.keys(optionImages));

    this.isSaving = true;

    if (this.isEditing && this.editingQuestionId) {
      this.quizService
        .updateQuestion(
          this.editingQuestionId,
          payload,
          this.questionImageFile || undefined,
          this.questionAudioFile || undefined,
          Object.keys(optionImages).length > 0 ? optionImages : undefined,
        )
        .subscribe({
          next: (event: any) => {
            if (event.type === 4) {
              this.isSaving = false;
              this.modalService.success(
                "Success",
                "Question updated successfully!",
              );
              this.resetForm();
              this.loadQuestions();
            }
          },
          error: (err) => {
            console.error("Update error:", err);
            this.isSaving = false;
            this.modalService.error(
              "Update Failed",
              err.error?.message || "Failed to update question",
            );
          },
        });
    } else {
      this.quizService
        .createQuestion(
          payload,
          this.questionImageFile || undefined,
          this.questionAudioFile || undefined,
          Object.keys(optionImages).length > 0 ? optionImages : undefined,
        )
        .subscribe({
          next: (event: any) => {
            if (event.type === 4) {
              this.isSaving = false;
              this.modalService.success(
                "Success",
                "Question created successfully!",
              );
              this.resetForm();
              this.loadQuestions();
            }
          },
          error: (err) => {
            console.error("Create error:", err);
            this.isSaving = false;
            this.modalService.error(
              "Creation Failed",
              err.error?.message || "Failed to create question",
            );
          },
        });
    }
  }

  editQuestion(question: any, index: number) {
    this.isEditing = true;
    this.editingQuestionId = question.questionId;

    this.questionForm.patchValue({
      questionText: question.questionText,
    });

    this.optionControls.clear();

    question.options.forEach((opt: any) => {
      const group = this.createOptionGroup();
      group.patchValue({
        text: opt.text,
        imageUrl: opt.imageUrl,
        imagePreview: opt.imageUrl,
        isCorrect: opt.isCorrect,
      });
      this.optionControls.push(group);
    });

    this.questionImagePreview = question.questionMedia.imageUrl;
    this.questionAudioPreview = question.questionMedia.audioUrl;
  }

  deleteQuestion(index: number) {
    const question = this.questions[index];
    if (!question) return;

    this.modalService.confirm(
      "Delete Question",
      `Are you sure you want to delete "${question.questionText}"?`,
      () => {
        // On Confirm
        this.isLoading = true;
        this.quizService.deleteQuestion(question.questionId).subscribe({
          next: () => {
            this.isLoading = false;
            this.modalService.success(
              "Deleted",
              "Question deleted successfully!",
            );
            this.loadQuestions();
          },
          error: (err) => {
            console.error("Delete error:", err);
            this.isLoading = false;
            this.modalService.error(
              "Delete Failed",
              err.error?.message || "Failed to delete question",
            );
          },
        });
      },
      () => {
        // On Cancel - Do nothing
        console.log("Delete cancelled");
      },
      "Yes, Delete",
      "Cancel",
    );
  }

  // ============ UI HELPERS ============
  onLanguageChange() {
    const langId =
      this.selectedLanguageId !== null ? Number(this.selectedLanguageId) : null;
    this.selectedLanguageId = langId;
    console.log("Language changed to:", this.selectedLanguageId);
    this.resetForm();
    this.loadQuestions();
  }

  resetForm() {
    this.questionForm.reset();
    this.initializeOptions(4);
    this.questionImagePreview = null;
    this.questionAudioPreview = null;
    this.questionImageFile = null;
    this.questionAudioFile = null;
    this.optionImageFiles = {};
    this.isEditing = false;
    this.editingQuestionId = null;
    this.isSaving = false;

    const imageInput = document.querySelector(
      "#questionImageInput",
    ) as HTMLInputElement;
    if (imageInput) imageInput.value = "";
    const audioInput = document.querySelector(
      "#questionAudioInput",
    ) as HTMLInputElement;
    if (audioInput) audioInput.value = "";
    for (let i = 0; i < 4; i++) {
      const input = document.querySelector(
        `#optionImageInput_${i}`,
      ) as HTMLInputElement;
      if (input) input.value = "";
    }
  }

  refresh() {
    this.loadQuestions();
  }

  openImage(imageUrl: string) {
    // Open image in a new tab or modal
    window.open(imageUrl, "_blank");
  }

  hasOptionImages(question: any): boolean {
    return question.options?.some((option: any) => option.imageUrl) || false;
  }
}
