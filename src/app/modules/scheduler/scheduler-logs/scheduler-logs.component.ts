import { Component } from '@angular/core';
import { SchedulerService } from '@shared/_http/scheduler.service';
import { schedulerLogsDetailsData } from '@shared/configs/scheduler-config';
import { RowData } from '@shared/models/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-scheduler-logs',
  standalone: false,
  templateUrl: './scheduler-logs.component.html',
  styleUrl: './scheduler-logs.component.scss'
})
export class SchedulerLogsComponent {

  schedulerLogsDetailsData: RowData = schedulerLogsDetailsData;
  subs: any;

  constructor(private schedulerservice: SchedulerService) { }

  ngOnInit(): void {
    this.subs = new Subscription()
    this.getAllScheduler();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  getAllScheduler() {
    // this.subs.add(this.schedulerservice.getAllSchedulerLogDetails().subscribe({
    //   next: (value) => {
    //     this.schedulerLogsDetailsData.data = value.data;
    //   }
    // }))
    this.subs.add(
      this.schedulerservice.getAllSchedulerLogDetails().subscribe({
        next: (value) => {

          this.schedulerLogsDetailsData.data = value.data.map((row: any) => {

            return {
              ...row,

              // ✅ Parse json_details
              parsed_json_details: this.parseJsonSafe(row.json_details),

              // ✅ Parse errors_json
              parsed_errors: this.parseJsonSafe(row.errors_json)
            };

          });

        }
      })
    );
  }

  parseJsonSafe(value: any) {
    try {
      if (!value) return [];

      // Already array
      if (Array.isArray(value)) return value;

      let cleaned = value;

      if (typeof cleaned !== 'string') {
        cleaned = String(cleaned);
      }

      cleaned = cleaned.trim();

      // 🔥 Remove wrapping quotes repeatedly
      while (
        (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
        (cleaned.startsWith("'") && cleaned.endsWith("'"))
      ) {
        cleaned = cleaned.slice(1, -1).trim();
      }

      // 🔥 Fix escape characters
      cleaned = cleaned
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');

      let parsed = JSON.parse(cleaned);

      // 🔥 Handle double JSON
      while (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }

      return Array.isArray(parsed) ? parsed : [];

    } catch (e) {
      console.error('Parse Error:', e, value);
      return [];
    }
  }
}

