import CryptoJS, { format } from 'crypto-js';

export function encodeIds(
  id: number,
  secretKey: string,
  slug?: string
): string {
  try {
    const dataToEncrypt = slug ? `${id}:${slug}` : `${id}`;
    const cipherText = CryptoJS.AES.encrypt(
      dataToEncrypt,
      secretKey
    ).toString();
    return cipherText;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
}
