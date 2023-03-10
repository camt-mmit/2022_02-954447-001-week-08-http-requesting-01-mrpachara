export function arrayBufferToBase64(
  buffer: ArrayBuffer,
  safeUrl = false,
): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  // NOTE: btoa() is not deprecated in browser.
  //       It only be deprecated in Node.js.
  const base64 = btoa(binary);

  return safeUrl ? safeURLencode(base64) : base64;
}

export function safeURLencode(str: string): string {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function randomString(length: number): string {
  const array = new Uint32Array(length / 2);
  crypto.getRandomValues(array);
  return Array.from(array, (dec) => ('0' + dec.toString(16)).slice(-2)).join(
    '',
  );
}

export async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
}
