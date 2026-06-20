import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'boolFromNumber', standalone: true })
export class BoolFromNumberPipe implements PipeTransform {
    transform(value: any): string {
        if (value === 1) return 'True';
        if (value === 0) return 'False';
        return '';
    }
}
