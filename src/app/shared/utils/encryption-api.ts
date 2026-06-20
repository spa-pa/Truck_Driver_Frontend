import * as CryptoJS from 'crypto-js';

export class EncryptionAPILayer {
    private encryptionKey: string;
    private iv: string;
    constructor() {
        this.encryptionKey = 'DF0C22A40B6D827FAD1A22E122A0138F50D0B9BDE2A3EDDDC4583F098FD2F8DE';
        this.iv = "ab9c7b62b8b1b5c330f4d1089a9e6804"
    }

    encryptData(data: any): string {
        return this.encrypt(this.encryptionKey, data);
    }
    decryptData(encrypted: any): string | any {
        return this.decrypt(this.encryptionKey, encrypted);
    }

    // Encryption and Decryption
    private encrypt(keys: string, value: any) {
        var key = CryptoJS.enc.Hex.parse(this.encryptionKey);
        var iv = CryptoJS.enc.Hex.parse(this.iv);
        var encrypted = CryptoJS.AES.encrypt(
            CryptoJS.enc.Utf8.parse(JSON.stringify(value)),
            key,
            {
                keySize: 256 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            }
        );
        var b64 = encrypted.toString();
        var e64 = CryptoJS.enc.Base64.parse(b64);
        var eHex = e64.toString(CryptoJS.enc.Hex);
        return iv.toString(CryptoJS.enc.Hex) + eHex;
    }

    //The get method is use for decrypt the value.
    private decrypt(keys: string, value: string) {
        var key = CryptoJS.enc.Hex.parse(this.encryptionKey);
        var iv = CryptoJS.enc.Hex.parse(this.iv);
        var decrypted = CryptoJS.AES.decrypt(
            CryptoJS.enc.Hex.parse(value.substring(32)).toString(CryptoJS.enc.Base64), key, {
            keySize: 256 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        var hex = decrypted.toString(CryptoJS.enc.Base64);
        var convertedString = atob(hex);
        var convertedJSON = JSON.parse(convertedString);
        return convertedJSON;
    }
}
