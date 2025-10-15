import "server-only";

function fromBase64Url(input: string): Uint8Array {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin =
    typeof atob !== "undefined"
      ? atob(b64)
      : Buffer.from(b64, "base64").toString("binary");
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function toArrayBuffer(view: Uint8Array): ArrayBuffer {
  const ab = new ArrayBuffer(view.byteLength);
  new Uint8Array(ab).set(view);
  return ab;
}

async function sha256ArrayBuffer(text: string): Promise<ArrayBuffer> {
  const enc = new TextEncoder().encode(text);
  return crypto.subtle.digest("SHA-256", toArrayBuffer(enc));
}

async function importAesKey(
  secret: string,
  usage: KeyUsage[]
): Promise<CryptoKey> {
  const keyAB = await sha256ArrayBuffer(secret);
  return crypto.subtle.importKey(
    "raw",
    keyAB,
    { name: "AES-GCM" },
    false,
    usage
  );
}

/** Coba decrypt dengan 2 format:
 *  A) ciphertext||tag  (standar WebCrypto)
 *  B) tag||ciphertext  (kalau token lama)
 */
async function tryDecryptWithFormat(
  buf: Uint8Array,
  secret: string
): Promise<string> {
  if (buf.length < 12 + 16 + 1) throw new Error("Token too short");

  const iv = buf.slice(0, 12);
  const tag = buf.slice(12, 28);
  const rest = buf.slice(28);

  const key = await importAesKey(secret, ["decrypt"]);

  // Format A: CT||TAG
  const ctTagA = new Uint8Array(rest.length + tag.length);
  ctTagA.set(rest, 0);
  ctTagA.set(tag, rest.length);

  try {
    const plainAB = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv, tagLength: 128 },
      key,
      toArrayBuffer(ctTagA)
    );
    return new TextDecoder().decode(plainAB);
  } catch {
    // Format B: TAG||CT
    const ctTagB = new Uint8Array(tag.length + rest.length);
    ctTagB.set(tag, 0);
    ctTagB.set(rest, tag.length);

    const plainAB = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv, tagLength: 128 },
      key,
      toArrayBuffer(ctTagB)
    );
    return new TextDecoder().decode(plainAB);
  }
}

export async function decryptKtaToken(
  token: string,
  secret: string
): Promise<string> {
  const trimmed = secret.trim();
  if (!trimmed) throw new Error("Missing secret");
  const buf = fromBase64Url(token);
  return tryDecryptWithFormat(buf, trimmed);
}