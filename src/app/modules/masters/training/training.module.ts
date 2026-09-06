import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingRoutingModule } from './training-routing.module';
import { TrainingComponent } from './training.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiLanguageService } from '@shared/_http/language.service';
import { VideoService } from '@shared/_http/video.service';
import { TranslateModule } from '@ngx-translate/core';
import { DriverTrainingService } from '@shared/_http/driver-training.service';
import { NoRecordFoundComponent } from '@shared/component/no-record-found/no-record-found.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NoRecordFoundComponent,
    TrainingRoutingModule
  ],
  providers: [ApiLanguageService, VideoService, DriverTrainingService]
})
export class TrainingModule { }
