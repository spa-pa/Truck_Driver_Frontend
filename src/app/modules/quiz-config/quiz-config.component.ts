import { Component, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';

interface QuestionMedia {
  audioUrl: string | null;
  imageUrl: string | null;
}

interface Option {
  optionId: number;
  optionType: 'text' | 'image' | 'audio';
  text: string;
  mediaUrl: string | null;
  isCorrect: boolean;
  mediaPreview?: string | null;
}

interface Question {
  questionId: number;
  questionText: string;
  questionMedia: QuestionMedia;
  options: Option[];
  language?: string;
}

@Component({
  selector: 'app-quiz-config',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './quiz-config.component.html',
  styleUrls: ['./quiz-config.component.scss']
})
export class QuizConfigComponent {
  @ViewChildren('questionImageInput') questionImageInputs!: QueryList<ElementRef>;
  @ViewChildren('questionAudioInput') questionAudioInputs!: QueryList<ElementRef>;

  selectedLanguage = '';
  languages: any[] = [];
  questions: Question[] = [];
  isLoading = false;
  isSaving = false;
  isEditing = false;
  editingIndex = -1;

  questionImagePreview: string | null = null;
  questionAudioPreview: string | null = null;
  questionImageFile: File | null = null;
  questionAudioFile: File | null = null;

  questionForm: FormGroup;
  optionControls: FormArray;

  // Dummy questions data
  private dummyQuestionsData: { [key: string]: Question[] } = {
    'en': [
      {
        questionId: 1,
        questionText: 'What is the capital of India?',
        questionMedia: { audioUrl: null, imageUrl: null },
        language: 'en',
        options: [
          { optionId: 1, optionType: 'text', text: 'Mumbai', mediaUrl: null, isCorrect: false },
          { optionId: 2, optionType: 'text', text: 'Delhi', mediaUrl: null, isCorrect: true },
          { optionId: 3, optionType: 'text', text: 'Pune', mediaUrl: null, isCorrect: false },
          { optionId: 4, optionType: 'text', text: 'Chennai', mediaUrl: null, isCorrect: false }
        ]
      },
      {
        questionId: 2,
        questionText: 'What is the national animal of India?',
        questionMedia: { audioUrl: null, imageUrl: null },
        language: 'en',
        options: [
          { optionId: 1, optionType: 'text', text: 'Lion', mediaUrl: null, isCorrect: false },
          { optionId: 2, optionType: 'text', text: 'Tiger', mediaUrl: null, isCorrect: true },
          { optionId: 3, optionType: 'text', text: 'Elephant', mediaUrl: null, isCorrect: false },
          { optionId: 4, optionType: 'text', text: 'Peacock', mediaUrl: null, isCorrect: false }
        ]
      },
      {
        questionId: 3,
        questionText: 'Identify the fruit shown below.',
        questionMedia: { 
          audioUrl: null, 
          imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80' 
        },
        language: 'en',
        options: [
          { optionId: 1, optionType: 'text', text: 'Banana', mediaUrl: null, isCorrect: false },
          { optionId: 2, optionType: 'text', text: 'Apple', mediaUrl: null, isCorrect: true },
          { optionId: 3, optionType: 'text', text: 'Orange', mediaUrl: null, isCorrect: false },
          { optionId: 4, optionType: 'text', text: 'Mango', mediaUrl: null, isCorrect: false }
        ]
      }
    ],
    'hi': [
      {
        questionId: 1,
        questionText: 'भारत की राजधानी क्या है?',
        questionMedia: { audioUrl: null, imageUrl: null },
        language: 'hi',
        options: [
          { optionId: 1, optionType: 'text', text: 'मुंबई', mediaUrl: null, isCorrect: false },
          { optionId: 2, optionType: 'text', text: 'दिल्ली', mediaUrl: null, isCorrect: true },
          { optionId: 3, optionType: 'text', text: 'पुणे', mediaUrl: null, isCorrect: false },
          { optionId: 4, optionType: 'text', text: 'चेन्नई', mediaUrl: null, isCorrect: false }
        ]
      },
      {
        questionId: 2,
        questionText: 'भारत का राष्ट्रीय पशु क्या है?',
        questionMedia: { audioUrl: null, imageUrl: null },
        language: 'hi',
        options: [
          { optionId: 1, optionType: 'text', text: 'शेर', mediaUrl: null, isCorrect: false },
          { optionId: 2, optionType: 'text', text: 'बाघ', mediaUrl: null, isCorrect: true },
          { optionId: 3, optionType: 'text', text: 'हाथी', mediaUrl: null, isCorrect: false },
          { optionId: 4, optionType: 'text', text: 'मोर', mediaUrl: null, isCorrect: false }
        ]
      }
    ]
  };

  constructor(private fb: FormBuilder) {
    this.questionForm = this.fb.group({
      questionText: ['', Validators.required]
    });

    this.optionControls = this.fb.array([]);
    this.questionForm.addControl('options', this.optionControls);
    
    // Initialize with 4 options
    this.initializeOptions(4);

    // Initialize languages
    this.languages = [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' },
      { code: 'ta', name: 'Tamil' },
      { code: 'te', name: 'Telugu' },
      { code: 'mr', name: 'Marathi' }
    ];
  }

  // Helper method to get option control as FormControl
  getOptionControl(index: number, controlName: string): FormControl {
    const control = this.optionControls.at(index).get(controlName);
    return control as FormControl;
  }

  // Helper method to get option form group
  getOptionGroup(index: number): FormGroup {
    return this.optionControls.at(index) as FormGroup;
  }

  getLanguageName(code: string): string {
    const lang = this.languages.find(l => l.code === code);
    return lang ? lang.name : code;
  }

  onLanguageChange() {
    this.loadQuestions();
    this.resetForm();
  }

  loadQuestions() {
    if (!this.selectedLanguage) {
      this.questions = [];
      return;
    }
    
    this.isLoading = true;
    
    // Simulate API delay
    setTimeout(() => {
      this.questions = this.dummyQuestionsData[this.selectedLanguage] || [];
      this.isLoading = false;
    }, 500);
  }

  loadDummyQuestions() {
    this.questions = this.dummyQuestionsData[this.selectedLanguage] || [];
  }

  initializeOptions(count: number) {
    this.optionControls.clear();
    for (let i = 0; i < count; i++) {
      this.optionControls.push(this.createOptionGroup());
    }
  }

  createOptionGroup(): FormGroup {
    return this.fb.group({
      text: ['', Validators.required],
      optionType: ['text'],
      mediaUrl: [null],
      mediaPreview: [null],
      isCorrect: [false]
    });
  }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D, ...
  }

  addOption() {
    if (this.optionControls.length < 6) {
      this.optionControls.push(this.createOptionGroup());
    } else {
      alert('Maximum 6 options allowed');
    }
  }

  removeOption(index: number) {
    if (this.optionControls.length > 2) {
      this.optionControls.removeAt(index);
    } else {
      alert('Minimum 2 options required');
    }
  }

  triggerFileInput(type: string) {
    if (type === 'questionImage') {
      const input = document.querySelector('#questionImageInput') as HTMLInputElement;
      if (input) input.click();
    } else if (type === 'questionAudio') {
      const input = document.querySelector('#questionAudioInput') as HTMLInputElement;
      if (input) input.click();
    }
  }

  triggerOptionFileInput(index: number, type: string) {
    const input = document.querySelector(`#optionFileInput_${index}_${type}`) as HTMLInputElement;
    if (input) input.click();
  }

  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'questionImage') {
          this.questionImagePreview = e.target?.result as string;
          this.questionImageFile = file;
        } else if (type === 'questionAudio') {
          this.questionAudioPreview = e.target?.result as string;
          this.questionAudioFile = file;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onOptionFileSelected(event: any, index: number, type: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const optionGroup = this.optionControls.at(index) as FormGroup;
        optionGroup.patchValue({
          mediaUrl: e.target?.result,
          mediaPreview: e.target?.result,
          optionType: type === 'image' ? 'image' : 'audio'
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    (event.target as HTMLElement).classList.add('dragover');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    (event.target as HTMLElement).classList.remove('dragover');
  }

  onDrop(event: DragEvent, type: string) {
    event.preventDefault();
    (event.target as HTMLElement).classList.remove('dragover');
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const fakeEvent = { target: { files: files } };
      this.onFileSelected(fakeEvent, type);
    }
  }

  saveQuestion() {
    if (this.questionForm.invalid) {
      alert('Please enter question text');
      return;
    }

    let hasCorrect = false;
    let hasEmptyOption = false;
    
    for (let i = 0; i < this.optionControls.length; i++) {
      const optionText = this.optionControls.at(i).get('text')?.value;
      if (!optionText || optionText.trim() === '') {
        hasEmptyOption = true;
        break;
      }
      if (this.optionControls.at(i).get('isCorrect')?.value === true) {
        hasCorrect = true;
      }
    }

    if (hasEmptyOption) {
      alert('Please fill in all option texts');
      return;
    }

    if (!hasCorrect) {
      alert('Please mark at least one option as correct');
      return;
    }

    this.isSaving = true;

    const question: Question = {
      questionId: Date.now(),
      questionText: this.questionForm.get('questionText')?.value,
      questionMedia: {
        audioUrl: this.questionAudioPreview,
        imageUrl: this.questionImagePreview
      },
      language: this.selectedLanguage,
      options: this.optionControls.controls.map((control, index) => ({
        optionId: index + 1,
        optionType: control.get('optionType')?.value || 'text',
        text: control.get('text')?.value,
        mediaUrl: control.get('mediaUrl')?.value || null,
        isCorrect: control.get('isCorrect')?.value || false
      }))
    };

    setTimeout(() => {
      if (!this.dummyQuestionsData[this.selectedLanguage]) {
        this.dummyQuestionsData[this.selectedLanguage] = [];
      }
      this.dummyQuestionsData[this.selectedLanguage].push(question);
      this.loadQuestions();
      this.resetForm();
      this.isSaving = false;
      alert('Question saved successfully!');
    }, 800);
  }

  editQuestion(question: Question, index: number) {
    this.isEditing = true;
    this.editingIndex = index;
    
    this.questionForm.patchValue({
      questionText: question.questionText
    });

    this.optionControls.clear();
    
    question.options.forEach((opt) => {
      const group = this.createOptionGroup();
      group.patchValue({
        text: opt.text,
        optionType: opt.optionType || 'text',
        mediaUrl: opt.mediaUrl,
        mediaPreview: opt.mediaUrl,
        isCorrect: opt.isCorrect
      });
      this.optionControls.push(group);
    });

    this.questionImagePreview = question.questionMedia.imageUrl;
    this.questionAudioPreview = question.questionMedia.audioUrl;

    document.querySelector('.card:last-child')?.scrollIntoView({ behavior: 'smooth' });
  }

  deleteQuestion(index: number) {
    if (confirm('Are you sure you want to delete this question?')) {
      if (this.dummyQuestionsData[this.selectedLanguage]) {
        this.dummyQuestionsData[this.selectedLanguage].splice(index, 1);
      }
      this.questions.splice(index, 1);
      alert('Question deleted successfully!');
    }
  }

  clearAllQuestions() {
    if (confirm('Are you sure you want to delete all questions for this language?')) {
      if (this.dummyQuestionsData[this.selectedLanguage]) {
        this.dummyQuestionsData[this.selectedLanguage] = [];
      }
      this.questions = [];
      alert('All questions deleted successfully!');
    }
  }

  resetForm() {
    this.questionForm.reset();
    this.initializeOptions(4);
    this.questionImagePreview = null;
    this.questionAudioPreview = null;
    this.questionImageFile = null;
    this.questionAudioFile = null;
    this.isEditing = false;
    this.editingIndex = -1;
    this.isSaving = false;
  }

  refresh() {
    this.loadQuestions();
    this.resetForm();
  }
}