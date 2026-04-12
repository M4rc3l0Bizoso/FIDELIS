/**
 * Extractive Summarizer Service
 * Implements TF-IDF based extractive summarization
 * Maintains fidelity to original text by extracting key sentences
 * Uses built-in tokenization (no external NLP dependencies)
 */

export interface SentenceScore {
  sentence: string;
  score: number;
  index: number;
  wordCount: number;
}

export interface SummarizationResult {
  originalText: string;
  summaryText: string;
  sentenceCount: number;
  wordCount: number;
  compressionRatio: number;
  confidenceScore: number;
  keyPoints: string[];
}

export class SummarizerService {
  /**
   * Tokenize text into sentences using regex
   */
  private tokenizeSentences(text: string): string[] {
    // Split on sentence-ending punctuation followed by whitespace or end of string
    // Handles: periods, exclamation marks, question marks
    // Preserves abbreviations like "Dr.", "Mr.", "e.g." by requiring space after period
    return text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  /**
   * Tokenize text into words
   */
  private tokenizeWords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\sáéíóúàèìòùäëïöüâêîôûñ]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 0);
  }

  /**
   * Generate summary from text with specified compression ratio
   */
  public summarize(text: string, compressionRatio: number = 0.3): SummarizationResult {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    if (compressionRatio <= 0 || compressionRatio >= 1) {
      throw new Error('Compression ratio must be between 0 and 1');
    }

    // Step 1: Sentence segmentation
    const sentences = this.tokenizeSentences(text);
    if (sentences.length === 0) {
      throw new Error('Could not tokenize text into sentences');
    }

    // If very short text, return as-is
    if (sentences.length <= 2) {
      return {
        originalText: text,
        summaryText: text.trim(),
        sentenceCount: sentences.length,
        wordCount: text.split(/\s+/).length,
        compressionRatio: 1,
        confidenceScore: 1,
        keyPoints: sentences,
      };
    }

    // Step 2: Calculate TF-IDF scores
    const scoredSentences = this.scoreSentences(sentences);

    // Step 3: Select top sentences based on compression ratio
    const summaryLength = Math.max(1, Math.ceil(sentences.length * compressionRatio));
    const selectedIndices = this.selectTopSentences(scoredSentences, summaryLength);

    // Step 4: Reconstruct summary in original order
    const summaryText = this.reconstructSummary(sentences, selectedIndices);

    // Step 5: Extract key points
    const keyPoints = this.extractKeyPoints(scoredSentences, Math.min(5, sentences.length));

    // Calculate metrics
    const originalWordCount = text.split(/\s+/).length;
    const summaryWordCount = summaryText.split(/\s+/).length;
    const actualCompressionRatio = summaryWordCount / originalWordCount;

    return {
      originalText: text,
      summaryText: summaryText.trim(),
      sentenceCount: selectedIndices.length,
      wordCount: summaryWordCount,
      compressionRatio: actualCompressionRatio,
      confidenceScore: this.calculateConfidenceScore(scoredSentences, selectedIndices),
      keyPoints,
    };
  }

  /**
   * Calculate TF-IDF scores for each sentence
   */
  private scoreSentences(sentences: string[]): SentenceScore[] {
    const wordFrequency = this.calculateWordFrequency(sentences.join(' '));
    const freqValues = Object.values(wordFrequency);
    const maxFreq = freqValues.length > 0 ? Math.max(...freqValues) : 1;

    return sentences.map((sentence, index) => {
      const words = this.tokenizeWords(sentence);
      const validWords = words.filter((word) => word.length > 2 && !this.isStopWord(word));

      let score = 0;
      for (const word of validWords) {
        const tf = (wordFrequency[word] || 0) / maxFreq;
        const idf = Math.log(
          sentences.length / (this.countSentencesWithWord(sentences, word) + 1)
        );
        score += tf * idf;
      }

      // Position bonus (first and last sentences get higher scores)
      if (index === 0) { score *= 1.5; }
      if (index === sentences.length - 1) { score *= 1.2; }

      // Longer sentences get slight boost (more content)
      const lengthBoost = Math.min(validWords.length / 20, 1.2);
      score *= lengthBoost;

      return {
        sentence: sentence.trim(),
        score,
        index,
        wordCount: validWords.length,
      };
    });
  }

  private calculateWordFrequency(text: string): Record<string, number> {
    const words = this.tokenizeWords(text);
    const frequency: Record<string, number> = {};

    for (const word of words) {
      if (word.length > 2 && !this.isStopWord(word)) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    }

    return frequency;
  }

  private countSentencesWithWord(sentences: string[], word: string): number {
    return sentences.filter((sentence) => sentence.toLowerCase().includes(word)).length;
  }

  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      // English
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
      'has', 'have', 'he', 'she', 'in', 'is', 'it', 'its', 'of', 'on',
      'or', 'that', 'the', 'to', 'was', 'will', 'with', 'this', 'but',
      'not', 'can', 'could', 'should', 'would', 'been', 'being', 'had',
      'did', 'does', 'do', 'were', 'they', 'them', 'their', 'there',
      'then', 'than', 'what', 'when', 'where', 'which', 'who', 'whom',
      'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
      'other', 'some', 'such', 'only', 'own', 'same', 'than', 'too',
      'very', 'just', 'because', 'about', 'into', 'through', 'during',
      'before', 'after', 'above', 'below', 'between', 'under', 'again',
      // Spanish
      'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'del',
      'al', 'es', 'son', 'fue', 'ser', 'estar', 'tiene', 'tiene',
      'hay', 'que', 'por', 'para', 'con', 'sin', 'sobre', 'entre',
      'pero', 'como', 'más', 'mas', 'muy', 'también', 'tambien',
      'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas',
      'aquel', 'aquella', 'todo', 'toda', 'todos', 'todas', 'otro',
      'otra', 'otros', 'otras', 'mismo', 'misma', 'donde', 'cuando',
      'porque', 'desde', 'hasta', 'durante', 'mientras', 'según',
      'solo', 'aún', 'aun', 'cada', 'poco', 'mucho', 'algo', 'nada',
      'sus', 'nos', 'les', 'ello',
    ]);

    return stopWords.has(word);
  }

  private selectTopSentences(scoredSentences: SentenceScore[], count: number): number[] {
    const sorted = [...scoredSentences].sort((a, b) => b.score - a.score).slice(0, count);
    return sorted.sort((a, b) => a.index - b.index).map((s) => s.index);
  }

  private reconstructSummary(sentences: string[], selectedIndices: number[]): string {
    const selectedSet = new Set(selectedIndices);
    return sentences
      .filter((_, index) => selectedSet.has(index))
      .join(' ')
      .replace(/\s+/g, ' ');
  }

  private extractKeyPoints(scoredSentences: SentenceScore[], count: number): string[] {
    return [...scoredSentences]
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map((s) => s.sentence);
  }

  private calculateConfidenceScore(
    scoredSentences: SentenceScore[],
    selectedIndices: number[]
  ): number {
    if (selectedIndices.length === 0) { return 0; }

    const selectedSet = new Set(selectedIndices);
    const selectedScores = scoredSentences
      .filter((s) => selectedSet.has(s.index))
      .map((s) => s.score);

    const avgScore = selectedScores.reduce((a, b) => a + b, 0) / selectedScores.length;
    const maxScore = Math.max(...scoredSentences.map((s) => s.score));

    return Math.min(avgScore / (maxScore + 0.1), 1);
  }
}

export default new SummarizerService();
