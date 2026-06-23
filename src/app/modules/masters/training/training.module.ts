import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingRoutingModule } from './training-routing.module';
import { TrainingComponent } from './training.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '@shared/_http/language.service';
import { VideoService } from '@shared/_http/video.service';


@NgModule({
  declarations: [TrainingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TrainingRoutingModule
  ],
  providers: [LanguageService, VideoService]
})
export class TrainingModule { }
