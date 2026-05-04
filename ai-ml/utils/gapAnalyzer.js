export default function gapAnalyzer({ 
  skillMatch, 
  keywordMatch, 
  experienceMatch,
  consistencyMatch,
  readabilityMatch,
  impactMatch,
  atsOptimization,
  techStandard
}) {
  const categorizedSuggestions = {
    critical: [],
    strategic: [],
    optimization: []
  };

  // 1. 🚨 Critical: Structural & ATS Gaps
  if (atsOptimization?.score < 80) {
    const missing = Object.keys(atsOptimization.sectionResults || {})
      .filter(k => !atsOptimization.sectionResults[k]);
    if (missing.length > 0) {
      categorizedSuggestions.critical.push(`Add clear headers for ${missing.join(" and ")} to ensure ATS readability.`);
    }
    
    const missingContact = Object.keys(atsOptimization.contactResults || {})
      .filter(k => !atsOptimization.contactResults[k]);
    if (missingContact.length > 0) {
      categorizedSuggestions.critical.push(`Ensure your ${missingContact.join(" and ")} are visible at the top of the document.`);
    }
  }

  // 2. 🎯 Strategic: Skills & Keywords (Only if JD provided)
  if (skillMatch?.score !== null && skillMatch.score < 70) {
    const prioritySkills = (skillMatch.missingSkills || []).slice(0, 3);
    if (prioritySkills.length > 0) {
      categorizedSuggestions.strategic.push(`Bridge the technical gap by highlighting experience with: ${prioritySkills.join(", ")}.`);
    }
  }

  if (keywordMatch?.score !== null && keywordMatch.score < 60) {
    const topKeywords = (keywordMatch.missingKeywords || []).slice(0, 3);
    if (topKeywords.length > 0) {
      categorizedSuggestions.strategic.push(`Increase your visibility for this role by integrating industry terms: ${topKeywords.join(", ")}.`);
    }
  }

  // 3. 📈 Optimization: Impact & Readability
  if (impactMatch?.score < 50) {
    categorizedSuggestions.optimization.push("Transform task-based descriptions into result-oriented bullet points using the XYZ formula (Accomplished [X] as measured by [Y], by doing [Z]).");
  }

  if (readabilityMatch?.passiveVoiceCount > 2) {
    categorizedSuggestions.optimization.push(`Convert passive phrases into active ones using power verbs like ${readabilityMatch.relevantVerbs?.slice(0, 2).join(" or ")}.`);
  }

  // 4. 🏛️ Domain Specialization
  if (techStandard?.score < 60) {
    techStandard.suggestions.forEach(s => categorizedSuggestions.strategic.push(s));
  }

  // Flatten and prioritize
  const allSuggestions = [
    ...categorizedSuggestions.critical.map(s => ({ priority: "Critical", text: s, icon: "AlertCircle" })),
    ...categorizedSuggestions.strategic.map(s => ({ priority: "Strategic", text: s, icon: "Zap" })),
    ...categorizedSuggestions.optimization.map(s => ({ priority: "Optimization", text: s, icon: "Layout" }))
  ];

  // If still too few, add highly contextual polish tips
  if (allSuggestions.length < 4) {
    const wordCount = (atsOptimization?.resumeText || "").split(/\s+/).length;
    if (wordCount > 1000) {
      allSuggestions.push({ priority: "Polish", text: "Your resume is quite long (~3+ pages). Aim for a concise 1-2 page format for maximum engagement.", icon: "CheckCircle2" });
    } else if (wordCount < 200) {
      allSuggestions.push({ priority: "Polish", text: "Your resume is very brief. Consider detailing your projects or certifications to show more depth.", icon: "CheckCircle2" });
    }
  }

  return {
    suggestions: allSuggestions.slice(0, 6)
  };
}


