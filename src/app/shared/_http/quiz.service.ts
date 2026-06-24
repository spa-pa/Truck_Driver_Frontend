// src/app/shared/_http/quiz.service.ts
import { HttpClient, HttpEvent, HttpEventType } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { Observable, map } from "rxjs";
import {QuestionHeaderText, OptionText, QuestionOption, QuestionPayload} from "../models/quiz-config"

@Injectable({
  providedIn: "root",
})
export class QuizService {
  private baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.API_BASE_URL;
  }

  // Get all questions
  getQuestions(): Observable<any[]> {
    return this.httpClient
      .get<{ success: boolean; data: any[] }>(`${this.baseUrl}questions`)
      .pipe(map((response) => response.data || []));
  }

  // Get question by ID
  getQuestionById(id: number): Observable<any> {
    return this.httpClient
      .get<{ success: boolean; data: any }>(`${this.baseUrl}questions/${id}`)
      .pipe(map((response) => response.data));
  }

  // Create question
  createQuestion(
    payload: QuestionPayload,
    questionImage?: File | null,
    questionAudio?: File | null,
    optionImages?: { [key: number]: File | null },
  ): Observable<any> {

    const formData = new FormData();

    formData.append("payload", JSON.stringify(payload));

    if (
      questionImage &&
      questionImage instanceof File &&
      questionImage.size > 0
    ) {
      formData.append("questionImage", questionImage, questionImage.name);
    }

    if (
      questionAudio &&
      questionAudio instanceof File &&
      questionAudio.size > 0
    ) {
      formData.append("questionAudio", questionAudio, questionAudio.name);
    }

    if (optionImages) {
      const sortedKeys = Object.keys(optionImages).sort(
        (a, b) => Number(a) - Number(b),
      );
      sortedKeys.forEach((key) => {
        const file = optionImages[parseInt(key)];
        if (file && file instanceof File && file.size > 0) {
          formData.append(`optionMedia${key}`, file, file.name);
          console.log(`✅ Added optionMedia${key}:`, file.name);
        }
      });
    }

    // IMPORTANT: Remove any optionImage fields that were added automatically
    const cleanedFormData = new FormData();
    formData.forEach((value, key) => {
      // Skip any fields that start with optionImage
      if (!key.startsWith("optionImage")) {
        cleanedFormData.append(key, value);
      } else {
        console.warn(`⚠️ Removing unwanted field: ${key}`);
      }
    });

    console.log("=== FINAL FORM DATA ===");
    cleanedFormData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`  ${key}: ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    });

    return this.httpClient.post(`${this.baseUrl}questions`, cleanedFormData, {
      reportProgress: true,
      observe: "events",
    });
  }

  // Update question
  updateQuestion(
    id: number,
    payload: QuestionPayload,
    questionImage?: File | null,
    questionAudio?: File | null,
    optionImages?: { [key: number]: File | null },
  ): Observable<any> {
    const formData = new FormData();

    formData.append("payload", JSON.stringify(payload));

    if (
      questionImage &&
      questionImage instanceof File &&
      questionImage.size > 0
    ) {
      formData.append("questionImage", questionImage, questionImage.name);
    }
    if (
      questionAudio &&
      questionAudio instanceof File &&
      questionAudio.size > 0
    ) {
      formData.append("questionAudio", questionAudio, questionAudio.name);
    }

    // IMPORTANT: Use optionMedia{index}
    if (optionImages) {
      const sortedKeys = Object.keys(optionImages).sort(
        (a, b) => Number(a) - Number(b),
      );
      sortedKeys.forEach((key) => {
        const file = optionImages[parseInt(key)];
        if (file && file instanceof File && file.size > 0) {
          formData.append(`optionMedia${key}`, file, file.name);
        }
      });
    }

    return this.httpClient.put(`${this.baseUrl}questions/${id}`, formData, {
      reportProgress: true,
      observe: "events",
    });
  }

  // Delete question
  deleteQuestion(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}questions/${id}`);
  }
}
