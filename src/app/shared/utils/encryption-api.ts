import * as CryptoJS from 'crypto-js';

export class EncryptionAPILayer {

    private encryptionKey: string;
    private iv: string;

    constructor() {
        // Must match backend ENCRYPTION_SECRET_KEY
        // 64 hex characters = 32 bytes = AES-256
        this.encryptionKey =
            '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

        // Must match backend ENCRYPTION_IV
        // 32 hex characters = 16 bytes
        this.iv = 'abcdef0123456789abcdef0123456789';
    }

    encryptData(data: any): string {
        return this.encrypt(data);
    }

    decryptData(encrypted: string): any {
        return this.decrypt(encrypted);
    }

    private encrypt(value: any): string {

        const key = CryptoJS.enc.Hex.parse(
            this.encryptionKey
        );

        const iv = CryptoJS.enc.Hex.parse(
            this.iv
        );

        // JSON.stringify keeps Unicode characters correctly
        const plaintext = JSON.stringify(value);

        const encrypted = CryptoJS.AES.encrypt(
            CryptoJS.enc.Utf8.parse(plaintext),
            key,
            {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        );

        // CryptoJS ciphertext → HEX
        const encryptedHex = encrypted.ciphertext.toString(
            CryptoJS.enc.Hex
        );

        // Return IV + encrypted data
        return (
            iv.toString(CryptoJS.enc.Hex) +
            encryptedHex
        );
    }

    private decrypt(value: string): any {

        if (!value) {
            throw new Error(
                'Encrypted value is empty'
            );
        }

        const key = CryptoJS.enc.Hex.parse(
            this.encryptionKey
        );

        // First 32 hex characters = 16-byte IV
        const ivHex = value.substring(0, 32);

        // Remaining data = encrypted payload
        const encryptedHex = value.substring(32);

        const iv = CryptoJS.enc.Hex.parse(ivHex);

        const ciphertext = CryptoJS.enc.Hex.parse(
            encryptedHex
        );

        const cipherParams =
            CryptoJS.lib.CipherParams.create({
                ciphertext: ciphertext
            });

        const decrypted = CryptoJS.AES.decrypt(
            cipherParams,
            key,
            {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        );

        // IMPORTANT:
        // CryptoJS directly converts decrypted bytes to UTF-8.
        // Do NOT use atob() here.
        const decryptedText =
            decrypted.toString(CryptoJS.enc.Utf8);

        if (!decryptedText) {
            throw new Error(
                'Unable to decrypt response'
            );
        }
        return JSON.parse(decryptedText);
    }
}