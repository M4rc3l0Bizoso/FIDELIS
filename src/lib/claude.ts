import Anthropic from "@anthropic-ai/sdk";
import { ValidationResult, SummaryContent } from "@/types";

let _client: Anthropic | null = null;
function getClient() {
  if (!_client) {
    _client = new Anthropic();
  }
  return _client;
}

const SYSTEM_PROMPT = `You are FIDELIS, an academic text summarizer with ABSOLUTE FIDELITY to source material.

YOUR CORE PRINCIPLE: Extract, structure, and clarify what's in the text. NEVER invent, interpret, or improve.

STRICT RULES (non-negotiable):

1. NEVER INVENT
   ✗ Don't add examples not explicitly in text
   ✗ Don't make logical leaps
   ✗ Don't fill gaps with assumptions
   ✓ Use EXACTLY the language from source
   ✓ Quote when necessary
   ✓ Mark [AMBIGUOUS] when unclear

2. PRESERVE NUANCE
   ✗ Don't simplify "might" → "will"
   ✗ Don't remove uncertainty markers
   ✗ Don't flatten hesitations
   ✓ Keep: "arguably", "suggests", "appears", "seems"
   ✓ Respect author's confidence level

3. MAINTAIN SCOPE
   ✗ Don't generalize beyond bounds
   ✗ "In Latin America" ≠ "globally"
   ✗ Don't add context not mentioned
   ✓ Respect original's scope
   ✓ State what you DON'T know

4. SIGNAL CONFIDENCE
   [HIGH]: Explicitly stated, multiple sources
   [MEDIUM]: Stated once, clearly
   [LOW]: Implied, weakly supported
   [AMBIGUOUS]: Unclear or contradictory

5. MAINTAIN TRACEABILITY
   Every paragraph must link to source paragraphs.
   Format: "Paragraph #N, lines X-Y"

6. MAXIMIZE ACADEMIC UTILITY
   - Definitions (exact, useful for flashcards)
   - Relationships (for mind maps)
   - Examples (ONLY from text)
   - Edge cases (exam questions)
   - Technical terms to memorize

OUTPUT ALWAYS IN VALID JSON FORMAT.`;

const MODE_PROMPTS = {
  study: `
You are summarizing for a university student preparing for exams.

Structure your summary:
1. Key concepts with definitions (from text only)
2. How these concepts relate to each other
3. Most likely exam questions (derived from text logic)
4. Things to be careful about / ambiguities
5. Technical terms to memorize

Make it useful for exam preparation. No fluff.
Keep language formal and academic.
Word limit: 40% of original text.`,

  brief: `
Provide the absolute minimum to understand the text.

Include ONLY:
1. Main thesis/argument
2. Supporting arguments (maximum 3)
3. Conclusion

No examples, no details.
Word limit: 20% of original text.`,

  deep: `
Provide comprehensive understanding while maintaining fidelity.

Include:
1. Context (why this text exists)
2. Complete definitions and explanations
3. All main arguments with supporting evidence
4. Any counterarguments or debates
5. Implications of the ideas
6. Limitations the author acknowledges

Word limit: 70% of original text.`,

  conceptmap: `
Create a hierarchical concept map showing relationships.

Output as JSON with structure:
{
  "root": "Main topic",
  "branches": [
    {
      "concept": "Concept A",
      "definition": "From text",
      "children": ["Sub-concept 1", "Sub-concept 2"],
      "relationships": ["connects to Concept B"]
    }
  ]
}

Make connections ONLY those explicitly in text.`,
};

export async function summarizeText(
  text: string,
  mode: 'study' | 'brief' | 'deep' | 'conceptmap',
  wordLimit?: number
): Promise<SummaryContent> {
  const wordCount = text.split(/\s+/).length;
  const finalWordLimit = wordLimit || calculateWordLimit(wordCount, mode);

  const userPrompt = `
${MODE_PROMPTS[mode]}

TEXT TO SUMMARIZE (Total words: ${wordCount}):
---
${text}
---

TARGET WORD LIMIT: ${finalWordLimit} words

OUTPUT REQUIREMENTS:
Return VALID JSON (no markdown, no formatting) with this exact structure:

{
  "mode": "${mode}",
  "summary": {
    "sections": [
      {
        "heading": "Section title",
        "content": "Content from text only",
        "confidence": "HIGH|MEDIUM|LOW|AMBIGUOUS",
        "source_paragraphs": [1, 2, 3],
        "quotes": ["Exact quotes if relevant"]
      }
    ],
    "key_concepts": [
      {
        "term": "Concept name",
        "definition": "From text",
        "confidence": "HIGH|MEDIUM|LOW",
        "source_paragraph": 3
      }
    ],
    "relationships": [
      {
        "concept_a": "A",
        "concept_b": "B",
        "relationship": "How they relate",
        "evidence": "Supporting evidence from text",
        "source_paragraph": 5
      }
    ],
    "exam_questions": [
      {
        "question": "Answerable from text",
        "likely_answers": ["From text"],
        "difficulty": "easy|medium|hard",
        "source_paragraph": 2,
        "confidence": 0.85
      }
    ],
    "ambiguities": [
      {
        "location": "Section or paragraph",
        "type": "Type",
        "description": "Why ambiguous",
        "severity": "low|medium|high",
        "suggestion": "What to check"
      }
    ],
    "trace_mapping": [
      {
        "summary_section_id": 0,
        "source_paragraph": 1,
        "confidence": 0.95
      }
    ]
  },
  "metadata": {
    "total_tokens": 0,
    "processing_time_ms": 0,
    "overall_confidence": 0.85
  }
}

CRITICAL:
- Return ONLY valid JSON
- Every claim must be traceable
- Don't invent anything
- If unsure, use [AMBIGUOUS]
- Keep confidence scores realistic`;

  try {
    const response = await getClient().messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text content in response");
    }

    let summary: SummaryContent;
    try {
      summary = JSON.parse(textContent.text);
    } catch {
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid JSON in response");
      summary = JSON.parse(jsonMatch[0]);
    }

    return {
      ...summary,
      metadata: {
        ...summary.metadata,
        total_tokens: response.usage.input_tokens + response.usage.output_tokens,
        processing_time_ms: 0,
      },
    };
  } catch (error) {
    console.error("Claude API error:", error);
    throw new Error("Failed to summarize text");
  }
}

export async function validateSummary(
  originalText: string,
  summary: SummaryContent
): Promise<ValidationResult> {
  const validationPrompt = `
You are a validator for academic summaries. Check if a summary maintains ABSOLUTE FIDELITY to the original text.

ORIGINAL TEXT:
---
${originalText}
---

SUMMARY TO VALIDATE:
---
${JSON.stringify(summary, null, 2)}
---

Check:
1. Are all claims in the summary supported by the original?
2. Are there any hallucinations (claims not in original)?
3. Are there unsupported inferences?
4. Are qualifications preserved?
5. Is the scope maintained?

Return JSON:
{
  "is_valid": boolean,
  "hallucinations": ["List of unsupported claims"],
  "unsupported_claims": ["Claims that need source check"],
  "confidence_score": 0.0-1.0,
  "ambiguities": [],
  "warnings": ["Any issues found"]
}`;

  const response = await getClient().messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: validationPrompt,
      },
    ],
  });

  const textContent = response.content.find((block) => block.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No validation response");
  }

  let result: ValidationResult;
  try {
    result = JSON.parse(textContent.text);
  } catch {
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid JSON in validation response");
    result = JSON.parse(jsonMatch[0]);
  }
  return result;
}

function calculateWordLimit(originalWords: number, mode: string): number {
  const limits: { [key: string]: number } = {
    study: 0.4,
    brief: 0.2,
    deep: 0.7,
    conceptmap: 0.35,
  };
  return Math.floor(originalWords * (limits[mode] || 0.4));
}
