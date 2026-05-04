// --- Normalize text ---
function normalize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// --- Split into sentences ---
function splitSentences(text) {
  return text.split(/[.!?]/).map(s => s.trim()).filter(Boolean);
}

// --- Build frequency map ---
function getWordFrequency(text) {
  const words = text.split(" ");
  const freq = {};

  words.forEach(word => {
    if (word.length < 3) return; // ignore small words
    freq[word] = (freq[word] || 0) + 1;
  });

  return freq;
}

// --- Detect overused words ---
function detectOverusedWords(freqMap, threshold = 5) {
  return Object.entries(freqMap)
    .filter(([_, count]) => count >= threshold)
    .map(([word]) => word);
}

// --- Detect duplicate sentences (simple similarity) ---
function detectDuplicateSentences(sentences) {
  const duplicates = [];
  const seen = new Set();

  sentences.forEach(sentence => {
    const key = sentence.slice(0, 50); // lightweight similarity
    if (seen.has(key)) {
      duplicates.push(sentence);
    } else {
      seen.add(key);
    }
  });

  return duplicates;
}

// --- Generic weak phrases ---
const GENERIC_PHRASES = [
  "hardworking",
  "team player",
  "quick learner",
  "detail oriented",
  "self motivated"
];

// --- Detect generic phrases ---
function detectGeneric(text) {
  return GENERIC_PHRASES.filter(phrase => text.includes(phrase));
}

// --- MAIN EVALUATOR ---
export default function consistencyEvaluator({
  resumeText = "",
  weight = 0.2
}) {
  const clean = normalize(resumeText);

  const sentences = splitSentences(clean);
  const freqMap = getWordFrequency(clean);

  const overusedWords = detectOverusedWords(freqMap);
  const duplicateSentences = detectDuplicateSentences(sentences);
  const genericPhrases = detectGeneric(clean);

  // --- Scoring logic ---
  let penalty = 0;

  penalty += overusedWords.length * 5;
  penalty += duplicateSentences.length * 10;
  penalty += genericPhrases.length * 7;

  let score = Math.max(0, 100 - penalty);

  // --- Feedback ---
  const feedback = [];

  if (overusedWords.length) {
    feedback.push(`Reduce overuse of words: ${overusedWords.join(", ")}`);
  }

  if (duplicateSentences.length) {
    feedback.push("Avoid repeating similar sentences across sections");
  }

  if (genericPhrases.length) {
    feedback.push(`Replace generic phrases: ${genericPhrases.join(", ")}`);
  }

  if (score > 80) {
    feedback.push("Content is well structured and non-repetitive");
  }

  return {
    score,
    weight,
    overusedWords,
    duplicateSentences,
    genericPhrases,
    feedback
  };
}
