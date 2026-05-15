import re
from typing import Dict

# Common filler words to detect in answers
FILLER_WORDS = [
    "um", "uh", "umm", "uhh",
    "like",
    "you know",
    "basically",
    "actually",
    "so yeah",
    "i mean",
    "kind of",
    "sort of",
    "right",
    "okay so",
]


def analyze_communication(transcript: str) -> Dict:
    """
    Analyze communication quality of a student's answer.

    Evaluates:
    - Filler word count
    - Speaking speed (based on word count)
    - Answer structure (sentence count, avg sentence length)
    - Overall communication score (0-100)

    Args:
        transcript: The student's answer text.

    Returns:
        Dict with communication score, filler word count, speaking speed, and details.
    """
    if not transcript.strip():
        return {
            "communication": 0,
            "fillerWords": 0,
            "speakingSpeed": "normal",
            "details": {
                "wordCount": 0,
                "sentenceCount": 0,
                "avgSentenceLength": 0,
            },
        }

    transcript_lower = transcript.lower()
    words = transcript.split()
    word_count = len(words)

    # Count filler words
    filler_count = 0
    for filler in FILLER_WORDS:
        pattern = r"\b" + re.escape(filler) + r"\b"
        matches = re.findall(pattern, transcript_lower)
        filler_count += len(matches)

    # Count sentences
    sentences = re.split(r"[.!?]+", transcript)
    sentences = [s.strip() for s in sentences if s.strip()]
    sentence_count = max(len(sentences), 1)
    avg_sentence_length = round(word_count / sentence_count, 1)

    # Determine speaking speed
    if word_count < 20:
        speaking_speed = "slow"
    elif word_count > 200:
        speaking_speed = "fast"
    else:
        speaking_speed = "normal"

    # Calculate communication score
    score = 70  # base score

    # Penalty for filler words (-5 per filler, max -30)
    filler_penalty = min(30, filler_count * 5)
    score -= filler_penalty

    # Bonus for good answer length (30-150 words is ideal)
    if 30 <= word_count <= 150:
        score += 15
    elif 15 <= word_count <= 200:
        score += 5
    else:
        score -= 10  # too short or too long

    # Bonus for structured answers (multiple sentences)
    if sentence_count >= 3:
        score += 10
    elif sentence_count >= 2:
        score += 5

    # Penalty for very long or very short sentences
    if avg_sentence_length > 35:
        score -= 5  # sentences too long / run-on
    elif avg_sentence_length < 5 and word_count > 10:
        score -= 5  # very fragmented

    # Clamp score
    score = max(0, min(100, score))

    return {
        "communication": score,
        "fillerWords": filler_count,
        "speakingSpeed": speaking_speed,
        "details": {
            "wordCount": word_count,
            "sentenceCount": sentence_count,
            "avgSentenceLength": avg_sentence_length,
        },
    }
