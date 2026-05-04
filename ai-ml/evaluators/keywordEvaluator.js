import techKeywords from "../data/techKeywords.json" with { type: "json" };

// --- Stop words (non-technical noise) ---
const STOP_WORDS = new Set([
  "the","and","or","with","for","in","on","at","a","an","to","of","is","are",
  "strong","modern","maintain","build","good","collaborate","participate",
  "understanding","knowledge","experience","familiarity","requirements",
  "responsibilities","working","ability","skills","developer","team",
  "existing","replaced","implementation","using","based","system","file","module",
  "looking","who","can","web","applications","such","work",
  "develop","application"
]);

// --- Normalize text ---
function normalizeText(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\w\s.+#]/g, " ") // keep . + # (node.js, c++, c#)
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Enhanced Keyword Evaluator:
 * 1. Extract keywords from JD (if provided)
 * 2. Fallback to domain-specific keywords from techKeywords.json
 */
export const keywordEvaluator = ({
  resumeText = "",
  jobDescription = "",
  weight = 0.2,
}) => {
  const lowerResume = normalizeText(resumeText);
  const lowerJD = normalizeText(jobDescription);

  // Combine JD keywords with our database keywords for broader detection
  const allDomainKeywords = Object.values(techKeywords).flat();
  
  // Extract keywords from JD by checking against our master list
  const jdKeywordsFound = allDomainKeywords.filter(k => 
    lowerJD.includes(k.toLowerCase())
  );
  
  // If no JD or no tech keywords found in JD, use a baseline set
  const keywordsToSearch = jdKeywordsFound.length > 0 
    ? [...new Set(jdKeywordsFound)] 
    : ["react", "node.js", "javascript", "python", "aws", "docker", "sql", "api", "git", "typescript"];

  const matchedKeywords = [];
  const missingKeywords = [];

  keywordsToSearch.forEach((keyword) => {
    if (lowerResume.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const total = keywordsToSearch.length;
  const score = total > 0 ? Math.round((matchedKeywords.length / total) * 100) : 100;

  const feedback = [];
  if (score < 50) {
    feedback.push("Your resume is missing many key industry keywords found in the job description.");
  } else if (score < 80) {
    feedback.push("Good keyword alignment, but adding a few more specific technologies could improve ATS ranking.");
  } else {
    feedback.push("Excellent keyword alignment with the job requirements.");
  }

  // Suggest up to 5 missing keywords in feedback
  missingKeywords.slice(0, 5).forEach(k => {
    feedback.push(`Consider adding: ${k}`);
  });

  return {
    score,
    weight,
    feedback,
    matchedKeywords: matchedKeywords.slice(0, 15),
    missingKeywords: missingKeywords.slice(0, 15),
    name: "keywordMatch"
  };
};
