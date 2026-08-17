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
import { environment } from "../../../environments/environment";

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
  videos: VideoResponse | null = null;
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
  isPlaying = false;

  // Track current loading language to prevent race conditions
  private currentLoadingLanguageId: number | null = null;
  private subscriptions: Subscription = new Subscription();

  // Max allowed video upload size, driven by environment config (in MB)
  readonly maxVideoSizeMB: number = environment.maxVideoSizeMB;
  readonly maxVideoSizeBytes: number =
    this.maxVideoSizeMB * 1024 * 1024;

  constructor(
    private apilanguageService: ApiLanguageService,
    private videoService: VideoService,
    private modalService: ModalService,
  ) { }

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
    this.isLoading = true;

    this.subscriptions.add(
      this.videoService.getVideoByLanguageId(langId).subscribe({
        next: (videos) => {
          this.isLoading = false;

          if (this.currentLoadingLanguageId !== langId) {
            return;
          }

          this.videos = videos.data || [];

          if (this.videos && this.videos.path && langId== this.videos?.dataValues?.language_id) {
            const video = this.videos;
            this.currentVideo = video.path;
            this.currentVideoName = video.path.split("/").pop() || "video.mp4";
            this.currentVideoId = video.dataValues.video_id;
            this.isVideoLoaded = true;
            this.videoKey++;
          } else {
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
    this.videos = null;
    this.currentVideo = null;
    this.currentVideoName = "";
    this.currentVideoId = null;
    this.isVideoLoaded = false;
    this.currentLoadingLanguageId = null;
    this.videoKey++;
  }

  // ============ DELETE VIDEO ============
  deleteVideo(videoId: number) {
    if (!videoId) return;

    this.modalService.confirm(
      "Delete Video",
      "Are you sure you want to delete this video? This action cannot be undone.",
      () => {
        // On Confirm - delete the video
        this.isLoading = true;
        this.subscriptions.add(
          this.videoService.deleteVideo(videoId).subscribe({
            next: () => {
              this.isLoading = false;
              this.modalService.success(
                "Video Deleted",
                "Video has been deleted successfully!",
              );
              // Clear current video and reload
              this.clearVideo();
              this.clearFile();
              if (this.selectedLanguageId !== null) {
                this.loadVideosByLanguage(this.selectedLanguageId);
              }
            },
            error: (error) => {
              console.error("Delete error:", error);
              this.isLoading = false;
              this.modalService.error(
                "Delete Failed",
                error.error?.message ||
                "Failed to delete video. Please try again.",
              );
            },
          }),
        );
      },
      () => {
        // On Cancel - do nothing
      },
      "Yes, Delete",
      "Cancel",
    );
  }

  // ============ UPLOAD METHODS ============
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!this.isFileSizeValid(file)) {
        event.target.value = "";
        return;
      }
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
      const file = files[0];
      if (!this.isFileSizeValid(file)) {
        return;
      }
      this.selectedFile = file;
      this.uploadProgress = 0;
    }
  }

  // Validates the selected file against the max allowed size (from environment config)
  private isFileSizeValid(file: File): boolean {
    if (file.size > this.maxVideoSizeBytes) {
      this.modalService.warning(
        "File Too Large",
        `The selected video "${file.name}" is larger than the allowed limit of ${this.maxVideoSizeMB} MB. Please upload a video within the size limit.`,
      );
      return false;
    }
    return true;
  }

  uploadVideo() {
    if (!this.selectedFile || !this.selectedLanguageId) {
      this.modalService.warning(
        "Missing Information",
        "Please select a language and a video file.",
      );
      return;
    }

    // Safety-net check in case selectedFile was set through another path
    if (!this.isFileSizeValid(this.selectedFile)) {
      return;
    }

    if (this.videos && this.videos?.path && this.videos?.dataValues?.video_id) {
      // Show confirmation modal using ModalService
      this.modalService.confirm(
        "Replace Video",
        `A video already exists for ${this.getLanguageDisplay(this.selectedLanguageId!)}. Do you want to replace it?`,
        () => {
          // On Confirm - update existing video
          this.updateExistingVideo(this.videos?.dataValues?.video_id);
        },
        () => {
          // On Cancel - do nothing
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

  updateExistingVideo(videoId: any) {
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
    return this.videos?.dataValues.language_id === Number(languageId)
  }

  getVideoName(): string {
    return this.currentVideoName;
  }

  onLanguageChange() {
    const langId =
      this.selectedLanguageId !== null ? Number(this.selectedLanguageId) : null;
    this.selectedLanguageId = langId;

    // Clear everything when language changes
    this.clearVideo();
    this.clearFile();
    this.isUploading = false;
    this.uploadProgress = 0;

    if (this.selectedLanguageId !== null) {
      this.loadVideosByLanguage(this.selectedLanguageId);
    }
  }
}