import { GlobalConfig } from '@shared/configs/global-config';
import * as CryptoJS from 'crypto-js';

export class EncryptedStorage {
    private encryptionKey: string;
    private iv: string;
    constructor() {
        this.encryptionKey =
            'DF0C22A40B6D827FAD1A22E122A0138F50D0B9BDE2A3EDDDC4583F098FD2F8DE';
        this.iv = 'ab9c7b62b8b1b5c330f4d1089a9e6804';
    }

    get IsLocalStorage() {
        return localStorage.getItem(new GlobalConfig().authToken) ? true : false;
    }

    public setItem(key: string, data: any, useSession = false) {
        if (!useSession) {
            localStorage.setItem(key, this.encrypt(this.encryptionKey, data));
        } else {
            sessionStorage.setItem(key, this.encrypt(this.encryptionKey, data));
        }
    }

    public getItem(key: string, useSession = false): string | null {
        if (!useSession) {
            return (
                this.decrypt(this.encryptionKey, localStorage.getItem(key)) ||
                this.decrypt(this.encryptionKey, sessionStorage.getItem(key))
            );
        } else {
            return this.decrypt(this.encryptionKey, sessionStorage.getItem(key));
        }
    }

    public findItemFromAllStorage(key: string): string | null {
        if (this.decrypt(this.encryptionKey, localStorage.getItem(key))) {
            return this.decrypt(this.encryptionKey, localStorage.getItem(key));
        } else {
            return this.decrypt(this.encryptionKey, sessionStorage.getItem(key));
        }
    }

    public removeItemFromAllStorage(key: any) {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    }
    public removeItemFromSessionStorage(key: string) {
        sessionStorage.removeItem(key);
    }
    public removeItemFromLocalStorage(key: string) {
        localStorage.removeItem(key);
    }

    public clearAll() {
        localStorage.clear();
        sessionStorage.clear();
    }
    public clearLocalStorage() {
        localStorage.clear();
    }
    public clearSessionStorage() {
        sessionStorage.clear();
    }

    // Encryption and Decryption
    private encrypt(keys: string, value: any) {
        var key = CryptoJS.enc.Utf8.parse(this.encryptionKey);
        var iv = CryptoJS.enc.Utf8.parse(this.iv);
        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value), key, {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        return encrypted.toString();
    }

    //The get method is use for decrypt the value.
    private decrypt(keys: string, value: string | null) {
        if (value) {
            var key = CryptoJS.enc.Utf8.parse(this.encryptionKey);
            var iv = CryptoJS.enc.Utf8.parse(this.iv);
            var decrypted = CryptoJS.AES.decrypt(value, key, {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            });

            return decrypted.toString(CryptoJS.enc.Utf8);
        } else {
            return null;
        }
    }
}
