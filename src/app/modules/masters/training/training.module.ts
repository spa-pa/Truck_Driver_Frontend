import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingRoutingModule } from './training-routing.module';
import { TrainingComponent } from './training.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiLanguageService } from '@shared/_http/language.service';
import { VideoService } from '@shared/_http/video.service';
import { TranslateModule } from '@ngx-translate/core';
import { DriverTrainingService } from '@shared/_http/driver-training.service';


@NgModule({
  declarations: [TrainingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TrainingRoutingModule
  ],
  providers: [ApiLanguageService, VideoService, DriverTrainingService]
})
export class TrainingModule { }
