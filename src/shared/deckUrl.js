// Compact deck URL encoding — Approach B: type header + varint offsets + base62
//
// Wire format: [version=1] [payloadLen] [typeHeader:2] [varint offset × 8] [varint towerTroop?]
//
// Type header: 2 bits per card position (8 cards = 16 bits = 2 bytes)
//   0 = troop (26xxxxxx), 1 = building (27xxxxxx), 2 = spell (28xxxxxx)
// Offsets: distance from type base (e.g., 26000015 → type 0, offset 15)
// Tower troop: offset from 159000000 base

const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const TYPE_BASES = [26000000, 27000000, 28000000];
const TT_BASE = 159000000;
const VERSION = 1;

function classifyCard(cardId) {
  const id = Number(cardId);
  for (let t = TYPE_BASES.length - 1; t >= 0; t--) {
    if (id >= TYPE_BASES[t]) return { type: t, offset: id - TYPE_BASES[t] };
  }
  return null;
}

function writeVarint(value, out) {
  value = Number(value);
  do {
    let byte = value & 0x7f;
    value >>>= 7;
    if (value) byte |= 0x80;
    out.push(byte);
  } while (value);
}

function readVarint(bytes, pos) {
  let result = 0, shift = 0;
  while (pos < bytes.length) {
    const byte = bytes[pos++];
    result |= (byte & 0x7f) << shift;
    if (!(byte & 0x80)) return [result, pos];
    shift += 7;
  }
  return null;
}

function toBase62(bytes) {
  let n = 0n;
  for (const b of bytes) n = (n << 8n) | BigInt(b);
  if (n === 0n) return BASE62[0];
  let str = '';
  while (n > 0n) {
    str = BASE62[Number(n % 62n)] + str;
    n /= 62n;
  }
  return str;
}

function fromBase62(str) {
  let n = 0n;
  for (const ch of str) {
    const i = BASE62.indexOf(ch);
    if (i < 0) return null;
    n = n * 62n + BigInt(i);
  }
  const bytes = [];
  while (n > 0n) {
    bytes.unshift(Number(n & 0xffn));
    n >>= 8n;
  }
  return bytes;
}

export function encodeDeck(cardIds, towerTroop) {
  if (!cardIds || cardIds.length !== 8) return null;

  let typeHeader = 0;
  const offsets = [];

  for (let i = 0; i < 8; i++) {
    const info = classifyCard(cardIds[i]);
    if (!info) return null;
    typeHeader |= info.type << (14 - i * 2);
    offsets.push(info.offset);
  }

  const payload = [(typeHeader >> 8) & 0xff, typeHeader & 0xff];
  for (const off of offsets) writeVarint(off, payload);
  if (towerTroop) writeVarint(Number(towerTroop) - TT_BASE, payload);

  // Version byte (nonzero) prevents leading-zero loss in base62 roundtrip
  return toBase62([VERSION, payload.length, ...payload]);
}

export function decodeDeck(str) {
  if (!str || str.length < 4) return null;
  try {
    const raw = fromBase62(str);
    if (!raw || raw.length < 2) return null;
    if (raw[0] !== VERSION) return null;

    const payloadLen = raw[1];
    if (raw.length !== 2 + payloadLen) return null;

    let pos = 2;
    const th = (raw[pos] << 8) | raw[pos + 1];
    pos += 2;

    const cardIds = [];
    for (let i = 0; i < 8; i++) {
      const type = (th >> (14 - i * 2)) & 0x03;
      if (type >= TYPE_BASES.length) return null;
      const r = readVarint(raw, pos);
      if (!r) return null;
      cardIds.push(String(TYPE_BASES[type] + r[0]));
      pos = r[1];
    }

    let towerTroop = null;
    if (pos < raw.length) {
      const r = readVarint(raw, pos);
      if (r) towerTroop = String(TT_BASE + r[0]);
    }

    return { cardIds, towerTroop };
  } catch {
    return null;
  }
}
