/**
 * Payload Integrity & Cryptographic Request Signature Utility
 * Generates HMAC-SHA256 signatures with Unix Epoch timestamps and unique Nonces.
 * Works seamlessly in both Modern Browsers and Node.js (SSR / Edge / API Routes).
 */

export interface SignatureHeaders {
  "X-Signature": string;
  "X-Timestamp": string;
  "X-Nonce": string;
}

export interface SignedPayloadResult {
  headers: SignatureHeaders;
  bodyString: string;
}

/**
 * Calculates SHA-256 hex hash of a string using Web Crypto API
 */
export async function computeSha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message || "");

  // Use globalThis.crypto.subtle (Standard in Browsers and Node 18+)
  const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("").toLowerCase();
}

/**
 * Calculates HMAC-SHA256 hex signature using Web Crypto API
 */
export async function computeHmacSha256(keyText: string, messageText: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(keyText);
  const messageData = encoder.encode(messageText);

  const cryptoKey = await globalThis.crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await globalThis.crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  return signatureArray.map((byte) => byte.toString(16).padStart(2, "0")).join("").toLowerCase();
}

/**
 * Extracts and normalizes the URL pathname (e.g., "/api/v1/manage-titles/42")
 */
export function extractCanonicalPath(rawUrl: string, baseUrl?: string): string {
  if (!rawUrl) return "/";

  let path = rawUrl;
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    try {
      path = new URL(rawUrl).pathname;
    } catch {
      path = rawUrl;
    }
  } else if (baseUrl && (baseUrl.startsWith("http://") || baseUrl.startsWith("https://"))) {
    try {
      const full = new URL(rawUrl, baseUrl);
      path = full.pathname;
    } catch {
      path = rawUrl;
    }
  }

  // Strip query strings and hash anchors
  const questionIndex = path.indexOf("?");
  if (questionIndex !== -1) {
    path = path.substring(0, questionIndex);
  }

  // Ensure leading slash and lowercase
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  return path.toLowerCase();
}

/**
 * Generates HMAC-SHA256 integrity headers for a mutating HTTP request.
 *
 * Canonical String Format:
 * METHOD\nPATH\nTIMESTAMP(UNIX_EPOCH)\nNONCE\nBODY_SHA256
 */
export async function generateRequestSignature(
  method: string,
  url: string,
  data: any,
  secretKey: string,
  baseUrl?: string
): Promise<SignedPayloadResult> {
  // 1. Current Unix Epoch Timestamp in Seconds
  const timestamp = Math.floor(Date.now() / 1000).toString();

  // 2. Unique cryptographic Nonce (UUIDv4)
  const nonce =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : Math.random().toString(36).substring(2) + Date.now().toString(36);

  // 3. Stringify & Hash the body
  let bodyString = "";
  if (data !== undefined && data !== null) {
    bodyString = typeof data === "string" ? data : JSON.stringify(data);
  }
  const bodyHash = await computeSha256(bodyString);

  // 4. Normalize Path and Method
  const normalizedMethod = method.toUpperCase();
  const normalizedPath = extractCanonicalPath(url, baseUrl);

  // 5. Construct Canonical String
  const canonicalString = `${normalizedMethod}\n${normalizedPath}\n${timestamp}\n${nonce}\n${bodyHash}`;

  // 6. Compute HMAC-SHA256 Signature
  const signature = await computeHmacSha256(secretKey, canonicalString);

  return {
    headers: {
      "X-Signature": signature,
      "X-Timestamp": timestamp,
      "X-Nonce": nonce,
    },
    bodyString,
  };
}
