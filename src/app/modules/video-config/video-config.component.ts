// src/app/modules/video-config/video-config.component.ts
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApiLanguageService } from "../../shared/_http/language.service";
import { VideoService } from "../../shared/_http/video.service";
import {
  VideoData,
  VideoResponse,
  Language,
} from "../../shared/models/video-config";
import { FileSizePipe } from "../../shared/pipes/file-size.pipe";
import { TruncatePipe } from "../../shared/pipes/truncate.pipe";
import { Subscription } from "rxjs";
import { ModalService } from "../../shared/services/modal.service";

@Component({
  selector: "app-video-config",
  standalone: true,
  imports: [CommonModule, FormsModule, FileSizePipe, TruncatePipe],
  templateUrl: "./video-config.component.html",
  styleUrls: ["./video-config.component.scss"],
})
export class VideoConfigComponent implements OnInit {
  @ViewChild("videoPlayer") videoPlayer!: ElementRef<HTMLVideoElement>;

  languages: any[] = [];
  selectedLanguageId: number | null = null;
  videos: VideoResponse[] = [];
  currentVideo: string | null = null;
  currentVideoName: string = "";
  currentVideoId: number | null = null;
  videoKey: number = 0;

  // Upload properties
  selectedFile: File | null = null;
  uploadProgress = 0;
  isDragging = false;
  isUploading = false;
  isLoading = false;
  isVideoLoaded = false;

  // Track current loading language to prevent race conditions
  private currentLoadingLanguageId: number | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private apilanguageService: ApiLanguageService,
    private videoService: VideoService,
    private modalService: ModalService, // Add ModalService
  ) {}

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
      this.apilanguageService.getAllLanguages().subscribe({
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
              if (this.selectedLanguageId !== null) {
                this.loadVideosByLanguage(this.selectedLanguageId);
              }
            } else {
              this.selectedLanguageId = this.languages[0].language_id;
              if (this.selectedLanguageId !== null) {
                this.loadVideosByLanguage(this.selectedLanguageId);
              }
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

  // ============ VIDEO METHODS ============
  loadVideosByLanguage(languageId: number) {
    if (!languageId) {
      this.clearVideo();
      return;
    }

    // Clear current video before loading new one
    this.clearVideo();

    const langId = Number(languageId);
    this.currentLoadingLanguageId = langId;
    console.log("Loading videos for language ID:", langId);
    this.isLoading = true;

    this.subscriptions.add(
      this.videoService.getVideoByLanguageId(langId).subscribe({
        next: (videos) => {
          this.isLoading = false;

          if (this.currentLoadingLanguageId !== langId) {
            console.log("Ignoring stale response for language:", langId);
            return;
          }

          this.videos = videos || [];

          console.log("Videos response for language", langId, ":", this.videos);

          if (this.videos.length > 0) {
            const video = this.videos[0];
            this.currentVideo = video.path;
            this.currentVideoName = video.path.split("/").pop() || "video.mp4";
            this.currentVideoId = video.dataValues.video_id;
            this.isVideoLoaded = true;
            this.videoKey++;
            console.log(
              "Video loaded for language",
              langId,
              ":",
              this.currentVideo,
            );
          } else {
            console.log("No video found for language ID:", langId);
            this.clearVideo();
          }
        },
        error: (err) => {
          console.error("Error loading videos:", err);
          this.isLoading = false;
          if (this.currentLoadingLanguageId === langId) {
            this.clearVideo();
          }
        },
      }),
    );
  }

  clearVideo() {
    this.videos = [];
    this.currentVideo = null;
    this.currentVideoName = "";
    this.currentVideoId = null;
    this.isVideoLoaded = false;
    this.currentLoadingLanguageId = null;
    this.videoKey++;
  }

  // ============ UPLOAD METHODS ============
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
    if (!this.selectedFile || !this.selectedLanguageId) {
      this.modalService.warning(
        "Missing Information",
        "Please select a language and a video file.",
      );
      return;
    }

    // Check if video already exists for this language
    const existingVideo = this.videos.find(
      (v) =>
        v.dataValues.language_id === this.selectedLanguageId &&
        v.dataValues.is_active === true,
    );

    if (existingVideo) {
      // Show confirmation modal using ModalService
      this.modalService.confirm(
        "Replace Video",
        `A video already exists for ${this.getLanguageDisplay(this.selectedLanguageId!)}. Do you want to replace it?`,
        () => {
          // On Confirm - update existing video
          this.updateExistingVideo(existingVideo.dataValues.video_id);
        },
        () => {
          // On Cancel - do nothing
          console.log("Replace cancelled");
        },
        "Yes, Replace",
        "Cancel",
      );
      return;
    }

    this.uploadNewVideo();
  }

  uploadNewVideo() {
    if (!this.selectedFile || !this.selectedLanguageId) return;

    this.isUploading = true;
    this.uploadProgress = 0;

    this.subscriptions.add(
      this.videoService
        .uploadVideo(this.selectedLanguageId, this.selectedFile)
        .subscribe({
          next: (event) => {
            if (event.progress) {
              this.uploadProgress = event.progress;
            }
            if (event.data) {
              this.uploadProgress = 100;

              this.modalService.success(
                "Upload Successful!",
                `Video "${this.selectedFile?.name}" has been uploaded successfully for ${this.getLanguageDisplay(this.selectedLanguageId!)}.`,
              );

              this.selectedFile = null;
              this.isUploading = false;

              if (this.selectedLanguageId !== null) {
                this.loadVideosByLanguage(this.selectedLanguageId);
              }
            }
          },
          error: (error) => {
            console.error("Upload error:", error);
            this.isUploading = false;
            this.uploadProgress = 0;

            this.modalService.error(
              "Upload Failed",
              error.error?.message ||
                "Failed to upload video. Please try again.",
            );
          },
        }),
    );
  }

  updateExistingVideo(videoId: number) {
    if (!this.selectedFile || !this.selectedLanguageId) return;

    this.isUploading = true;
    this.uploadProgress = 0;

    this.subscriptions.add(
      this.videoService
        .updateVideo(videoId, this.selectedLanguageId, this.selectedFile)
        .subscribe({
          next: (response) => {
            this.uploadProgress = 100;

            this.modalService.success(
              "Video Updated!",
              `Video "${this.selectedFile?.name}" has been updated successfully for ${this.getLanguageDisplay(this.selectedLanguageId!)}.`,
            );

            this.isUploading = false;
            this.selectedFile = null;
            this.uploadProgress = 0;

            if (this.selectedLanguageId !== null) {
              this.loadVideosByLanguage(this.selectedLanguageId);
            }
          },
          error: (error) => {
            console.error("Update error:", error);
            this.isUploading = false;
            this.uploadProgress = 0;

            this.modalService.error(
              "Update Failed",
              error.error?.message ||
                "Failed to update video. Please try again.",
            );
          },
        }),
    );
  }

  clearFile() {
    this.selectedFile = null;
    this.uploadProgress = 0;
  }

  // ============ HELPER METHODS ============
  getLanguageName(languageId: number): string {
    const lang = this.languages.find(
      (l) => l.language_id === Number(languageId),
    );
    return lang ? lang.language_name : "Unknown";
  }

  getLanguageCode(languageId: number): string {
    const lang = this.languages.find(
      (l) => l.language_id === Number(languageId),
    );
    return lang ? lang.language_code : "";
  }

  getLanguageDisplay(languageId: number): string {
    if (!languageId) return "Unknown";
    const lang = this.languages.find(
      (l) => l.language_id === Number(languageId),
    );
    return lang ? `${lang.language_name} (${lang.language_code})` : "Unknown";
  }

  getLanguageStatus(languageId: number): boolean {
    if (!languageId) return false;
    return this.videos.some(
      (v) =>
        v.dataValues.language_id === Number(languageId) &&
        v.dataValues.is_active === true,
    );
  }

  getVideoName(): string {
    return this.currentVideoName;
  }

  onLanguageChange() {
    const langId =
      this.selectedLanguageId !== null ? Number(this.selectedLanguageId) : null;
    this.selectedLanguageId = langId;

    console.log("Language changed to ID:", this.selectedLanguageId);

    this.clearVideo();
    if (this.selectedLanguageId !== null) {
      this.loadVideosByLanguage(this.selectedLanguageId);
    }
  }
}
