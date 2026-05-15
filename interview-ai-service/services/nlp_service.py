import re
from typing import List, Dict


def detect_concepts(transcript: str, expected_concepts: List[str]) -> Dict:
    """
    Detect which expected concepts are present in the student's answer.

    Uses keyword matching with normalization — converts concept IDs like
    'virtual-dom' to searchable forms like 'virtual dom' and 'virtualdom'.

    Args:
        transcript: The student's answer text.
        expected_concepts: List of concept IDs to look for (e.g. ['virtual-dom', 'reconciliation']).

    Returns:
        Dict with 'detected', 'missed' lists and 'relevance' score (0-100).
    """
    if not transcript.strip():
        return {
            "detected": [],
            "missed": expected_concepts,
            "relevance": 0,
        }

    transcript_lower = transcript.lower()
    # Remove punctuation for better matching
    transcript_clean = re.sub(r"[^\w\s]", " ", transcript_lower)

    detected = []
    missed = []

    for concept in expected_concepts:
        # Generate multiple search forms for each concept
        search_forms = _generate_search_forms(concept)

        found = any(form in transcript_clean for form in search_forms)
        if found:
            detected.append(concept)
        else:
            missed.append(concept)

    # Calculate relevance score
    total = len(expected_concepts)
    relevance = round((len(detected) / total) * 100) if total > 0 else 0

    return {
        "detected": detected,
        "missed": missed,
        "relevance": relevance,
    }


def _generate_search_forms(concept: str) -> List[str]:
    """
    Generate multiple searchable forms of a concept ID.

    Example: 'virtual-dom' → ['virtual dom', 'virtualdom', 'virtual-dom']
    Example: 'useEffect' → ['useeffect', 'use effect']
    """
    forms = set()

    concept_lower = concept.lower()
    forms.add(concept_lower)

    # Replace hyphens with spaces: 'virtual-dom' → 'virtual dom'
    forms.add(concept_lower.replace("-", " "))

    # Remove hyphens entirely: 'virtual-dom' → 'virtualdom'
    forms.add(concept_lower.replace("-", ""))

    # Split camelCase: 'useEffect' → 'use effect'
    camel_split = re.sub(r"([a-z])([A-Z])", r"\1 \2", concept).lower()
    forms.add(camel_split)

    # Remove underscores: 'time_complexity' → 'time complexity'
    forms.add(concept_lower.replace("_", " "))

    return list(forms)
