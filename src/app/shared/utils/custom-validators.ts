// src/app/validators/custom-validators.ts
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

// Custom validator for contact number (10-digit)
export function contactNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    const pattern = /^\d{10}$/;
    return pattern.test(control.value) ? null : { invalidContactNumber: true };
  };
}

// Custom validator for PAN card
export function pancardValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    const pattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return pattern.test(control.value) ? null : { invalidPancard: true };
  };
}

// Custom validator for Aadhaar card
export function adharcardValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    const pattern = /^\d{12}$/;
    return pattern.test(control.value) ? null : { invalidAdharcard: true };
  };
}

// Custom validator for passport number
export function passportValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    const pattern = /^[A-Z]{1}[0-9]{7}$/;
    return pattern.test(control.value) ? null : { invalidPassport: true };
  };
}

// Custom validator for eamil
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(control.value) ? null : { email: true };
  };
}