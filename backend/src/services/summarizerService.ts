/**
 * Extractive Summarizer Service
 * Implements TF-IDF based extractive summarization
 * Maintains fidelity to original text by extracting key sentences
 */

import { natural } from 'natural';

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
  private tokenizer = new natural.SentenceTokenizer();
  private wordTokenizer = new natural.WordTokenizer();

  /**
   * Generate summary from text with specified compression ratio
   * @param text - Original text to summarize
   * @param compressionRatio - Target compression (0.2 = 20% of original)
   * @returns Summarization result
   */
  public summarize(text: string, compressionRatio: number = 0.3): SummarizationResult {
    // Validate inputs
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    if (compressionRatio <= 0 || compressionRatio >= 1) {
      throw new Error('Compression ratio must be between 0 and 1');
    }

    // Step 1: Sentence segmentation
    const sentences = this.tokenizer.tokenize(text);
    if (sentences.length === 0) {
      throw new Error('Could not tokenize text into sentences');
    }

    // Step 2: Calculate TF-IDF scores
    const scoredSentences = this.scoresentences(sentences);

    // Step 3: Select top sentences based on compression ratio
    const summaryLength = Math.max(1, Math.ceil(sentences.length * compressionRatio));
    const selectedIndices = this.selectTopSentences(scoredSentences, summaryLength);

    // Step 4: Reconstruct summary in original order
    const summaryText = this.reconstructSummary(sentences, selectedIndices);

    // Step 5: Extract key points
    const keyPoints = this.extractKeyPoints(scoredSentences, 5);

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
  private scoresentences(sentences: string[]): SentenceScore[] {
    // Build word frequency map
    const wordFrequency = this.calculateWordFrequency(sentences.join(' '));

    // Calculate max word frequency for normalization
    const maxFreq = Math.max(...Object.values(wordFrequency));

    return sentences.map((sentence, index) => {
      const words = this.wordTokenizer.tokenize(sentence.toLowerCase());
      const validWords = words.filter((word) => word.length > 2 && !this.isStopWord(word));

      // TF-IDF scoring
      let score = 0;
      for (const word of validWords) {
        const tf = (wordFrequency[word] || 0) / maxFreq;
        const idf = Math.log(sentences.length / (this.countSentencesWithWord(sentences, word) + 1));
        score += tf * idf;
      }

      // Position bonus (first and last sentences get higher scores)
      if (index === 0) score *= 1.5;
      if (index === sentences.length - 1) score *= 1.2;

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

  /**
   * Calculate word frequency in text
   */
  private calculateWordFrequency(text: string): Record<string, number> {
    const words = this.wordTokenizer.tokenize(text.toLowerCase());
    const frequency: Record<string, number> = {};

    for (const word of words) {
      // Filter short words and stop words
      if (word.length > 2 && !this.isStopWord(word)) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    }

    return frequency;
  }

  /**
   * Count how many sentences contain a specific word
   */
  private countSentencesWithWord(sentences: string[], word: string): number {
    return sentences.filter((sentence) => sentence.toLowerCase().includes(word)).length;
  }

  /**
   * Check if word is a common stop word
   */
  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'a',
      'an',
      'and',
      'are',
      'as',
      'at',
      'be',
      'by',
      'for',
      'from',
      'has',
      'he',
      'in',
      'is',
      'it',
      'its',
      'of',
      'on',
      'or',
      'that',
      'the',
      'to',
      'was',
      'will',
      'with',
      'the',
      'this',
      'but',
      'not',
      'can',
      'could',
      'should',
      'would',
    ]);

    return stopWords.has(word);
  }

  /**
   * Select top sentences by score while maintaining order
   */
  private selectTopSentences(scoredSentences: SentenceScore[], count: number): number[] {
    // Sort by score to get top N
    const sorted = [...scoredSentences].sort((a, b) => b.score - a.score).slice(0, count);

    // Return indices maintaining original order
    return sorted.sort((a, b) => a.index - b.index).map((s) => s.index);
  }

  /**
   * Reconstruct summary maintaining original sentence order
   */
  private reconstructSummary(sentences: string[], selectedIndices: number[]): string {
    const selectedSet = new Set(selectedIndices);
    return sentences
      .filter((_, index) => selectedSet.has(index))
      .join(' ')
      .replace(/\s+/g, ' ');
  }

  /**
   * Extract key points (top scoring sentences)
   */
  private extractKeyPoints(scoredSentences: SentenceScore[], count: number): string[] {
    return scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map((s) => s.sentence);
  }

  /**
   * Calculate confidence score based on sentence quality
   */
  private calculateConfidenceScore(
    scoredSentences: SentenceScore[],
    selectedIndices: number[]
  ): number {
    if (selectedIndices.length === 0) return 0;

    const selectedSet = new Set(selectedIndices);
    const selectedScores = scoredSentences.filter((s) => selectedSet.has(s.index)).map((s) => s.score);

    const avgScore = selectedScores.reduce((a, b) => a + b, 0) / selectedScores.length;
    const maxScore = Math.max(...scoredSentences.map((s) => s.score));

    // Normalize to 0-1 range
    return Math.min(avgScore / (maxScore + 0.1), 1);
  }
}

export default new SummarizerService();
