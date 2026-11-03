/**
 * The API can append a fee breakdown to a student's subject name, e.g.
 * "Maths (₹1000 + ₹200 Admin Fee)". Students should only see the name and the
 * total fee, so strip any trailing "(₹x + ₹y ...)" part.
 */
export const cleanSubjectName = (name?: string | null): string =>
  String(name ?? "")
    .replace(/\s*\(\s*₹\s*[\d.,]+\s*\+\s*₹\s*[\d.,]+[^)]*\)\s*$/u, "")
    .trim();
