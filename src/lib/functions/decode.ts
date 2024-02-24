import CryptoJS from 'crypto-js';
import { DecodedIds } from '../types/decode.types';

export function decodeIds(
  encodedString: string,
  secretKey: string
): DecodedIds | null {
  try {
    const bytes = CryptoJS.AES.decrypt(encodedString, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    if (decryptedData.includes(':')) {
      const [id, slug] = decryptedData.split(':');
      return {
        id: id,
        slug: slug,
      };
    } else {
      return {
        id: decryptedData,
        slug: null,
      };
    }
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
}
