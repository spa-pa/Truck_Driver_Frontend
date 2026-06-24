import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { currentUser } from "@shared/utils/current-user";
import { Observable, map, catchError, of } from "rxjs";
import { VideoData, VideoResponse, Language } from "../models/video-config"

@Injectable({
  providedIn: "root",
})
export class VideoService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.API_BASE_URL;
  }

  // Get all videos
  getAllVideos(): Observable<VideoResponse[]> {
    return this.http
      .get<{
        success: boolean;
        data: VideoResponse[];
      }>(`${this.baseUrl}videoMaster`)
      .pipe(map((response) => response.data || []));
  }

   // Get videos by language ID - returns array
   // Get videos by language ID - returns array
  getVideosByLanguageId(languageId: number): Observable<VideoResponse[]> {
    return this.http
      .get<{ success: boolean; data: VideoResponse }>(
        `${this.baseUrl}videoMaster/language/${languageId}`
      )
      .pipe(
        map((response) => {
          console.log('Raw API response:', response);
          
          // If success is false or no data, return empty array
          if (!response.success || !response.data) {
            console.log('No video found for language:', languageId);
            return [];
          }
          
          // Response.data is a single object, wrap it in an array
          const video = response.data;
          console.log('Video found for language:', languageId, video);
          
          // Verify the video belongs to the requested language
          if (video.dataValues && video.dataValues.language_id === Number(languageId)) {
            return [video];
          }
          
          // If language_id doesn't match, return empty array
          console.log('Language mismatch:', video.dataValues?.language_id, '!=', languageId);
          return [];
        }),
        catchError((error) => {
          console.log('API error:', error);
          return of([]);
        })
      );
  }

  // Upload video
  uploadVideo(
    languageId: number,
    file: File,
  ): Observable<{ progress: number; data?: any }> {
    const formData = new FormData();
    formData.append("video", file);
    formData.append("language_id", languageId.toString());

    return this.http
      .post(`${this.baseUrl}videoMaster`, formData, {
        reportProgress: true,
        observe: "events",
      })
      .pipe(
        map((event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress) {
            const progress = Math.round(
              (100 * event.loaded) / (event.total || 1),
            );
            return { progress };
          } else if (event.type === HttpEventType.Response) {
            return { progress: 100, data: event.body?.data };
          }
          return { progress: 0 };
        }),
      );
  }

  // Update video
  updateVideo(id: number, languageId: number, file?: File): Observable<any> {
    const formData = new FormData();
    if (file) {
      formData.append("video", file);
    }
    formData.append("language_id", languageId.toString());

    return this.http.put(`${this.baseUrl}videoMaster/${id}`, formData);
  }

  // Delete video (soft delete)
  deleteVideo(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}videoMaster/${id}`);
  }
}
