// Constant-time string comparison. Iterates over the longer of the two
// inputs so the response time does not depend on the position of the first
// differing byte or on the length difference between inputs.
export function timingSafeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder()
  const aBytes = encoder.encode(a)
  const bBytes = encoder.encode(b)
  const len = Math.max(aBytes.length, bBytes.length)
  // Seed with the length difference so unequal lengths can never produce 0.
  let diff = aBytes.length ^ bBytes.length
  for (let i = 0; i < len; i++) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0)
  }
  return diff === 0
}
