import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingRoutingModule } from './training-routing.module';
import { TrainingComponent } from './training.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiLanguageService } from '@shared/_http/language.service';
import { VideoService } from '@shared/_http/video.service';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [TrainingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TrainingRoutingModule
  ],
  providers: [ApiLanguageService, VideoService]
})
export class TrainingModule { }
