import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private currentLangSubject = new BehaviorSubject<string>('en');
    currentLang$ = this.currentLangSubject.asObservable();

    constructor(private translate: TranslateService) {
        // Set default language
        const savedLang = localStorage.getItem('language') || 'en';
        this.setLanguage(savedLang);
    }

    setLanguage(lang: string): void {
        this.translate.use(lang);
        this.currentLangSubject.next(lang);
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;

        // Set RTL for languages that need it
        if (lang === 'ar' || lang === 'he') {
            document.documentElement.dir = 'rtl';
        } else {
            document.documentElement.dir = 'ltr';
        }
    }

    getCurrentLanguage(): string {
        return this.currentLangSubject.value;
    }

    getSupportedLanguages(): { code: string; name: string }[] {
        return [
            { code: 'en', name: 'English' },
            { code: 'hi', name: 'हिंदी (Hindi)' },
            { code: 'mr', name: 'मराठी (Marathi)' },
            { code: 'gu', name: 'ગુજરાતી (Gujarati)' }
        ];
    }
}