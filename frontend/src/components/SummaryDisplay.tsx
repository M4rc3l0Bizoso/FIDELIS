import React, { useState } from 'react';
import { Copy, Download, Share2, Settings } from 'lucide-react';

interface SummaryDisplayProps {
  originalText: string;
  summaryText: string;
  keyPoints?: string[];
  metadata?: {
    wordCount: number;
    sentenceCount: number;
    compressionRatio: number;
    confidenceScore: number;
    processingTime: number;
  };
  onExport?: (format: 'pdf' | 'txt') => void;
  onShare?: () => void;
  onRegenerateSummary?: (ratio: number) => void;
}

export function SummaryDisplay({
  originalText,
  summaryText,
  keyPoints = [],
  metadata,
  onExport,
  onShare,
  onRegenerateSummary,
}: SummaryDisplayProps) {
  const [viewMode, setViewMode] = useState<'summary' | 'comparison'>('summary');
  const [copiedText, setCopiedText] = useState(false);
  const [compressionRatio, setCompressionRatio] = useState(0.3);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summaryText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleExport = (format: 'pdf' | 'txt') => {
    if (onExport) {
      onExport(format);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 pb-4 border-b border-secondary-200">
        <button
          onClick={() => setViewMode('summary')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'summary'
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setViewMode('comparison')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'comparison'
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300'
          }`}
        >
          Side by Side
        </button>

        <div className="flex-1" />

        <button
          onClick={handleCopy}
          className="btn-secondary flex items-center gap-2"
          title="Copy summary"
        >
          <Copy className="w-4 h-4" />
          {copiedText ? 'Copied!' : 'Copy'}
        </button>
        <button onClick={() => handleExport('pdf')} className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" />
          PDF
        </button>
        <button onClick={() => handleExport('txt')} className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" />
          TXT
        </button>
        {onShare && (
          <button onClick={onShare} className="btn-secondary flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        )}
      </div>

      {/* Metrics */}
      {metadata && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-secondary-50 p-4 rounded-lg">
          <div>
            <p className="text-xs text-secondary-600 uppercase font-semibold">Words</p>
            <p className="text-xl font-bold text-secondary-900">{metadata.wordCount}</p>
          </div>
          <div>
            <p className="text-xs text-secondary-600 uppercase font-semibold">Sentences</p>
            <p className="text-xl font-bold text-secondary-900">{metadata.sentenceCount}</p>
          </div>
          <div>
            <p className="text-xs text-secondary-600 uppercase font-semibold">Compression</p>
            <p className="text-xl font-bold text-secondary-900">
              {Math.round(metadata.compressionRatio * 100)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-secondary-600 uppercase font-semibold">Confidence</p>
            <p className="text-xl font-bold text-primary-600">
              {Math.round(metadata.confidenceScore * 100)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-secondary-600 uppercase font-semibold">Processing</p>
            <p className="text-xl font-bold text-secondary-900">{metadata.processingTime}ms</p>
          </div>
        </div>
      )}

      {/* Summary View */}
      {viewMode === 'summary' && (
        <div className="space-y-6">
          {/* Summary Text */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Summary</h3>
            <div className="prose prose-sm max-w-none text-secondary-700 leading-relaxed whitespace-pre-wrap">
              {summaryText}
            </div>
          </div>

          {/* Key Points */}
          {keyPoints.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Key Points</h3>
              <ul className="space-y-3">
                {keyPoints.map((point, idx) => (
                  <li key={idx} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-600">{idx + 1}</span>
                    </div>
                    <span className="text-secondary-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Regenerate Options */}
          {onRegenerateSummary && (
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Adjust Summary Length
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Compression Ratio: {Math.round(compressionRatio * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.1"
                    value={compressionRatio}
                    onChange={(e) => setCompressionRatio(parseFloat(e.target.value))}
                    className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <div className="flex justify-between text-xs text-secondary-600 mt-2">
                    <span>Shorter</span>
                    <span>Longer</span>
                  </div>
                </div>
                <button
                  onClick={() => onRegenerateSummary(compressionRatio)}
                  className="btn-primary w-full"
                >
                  Regenerate Summary
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comparison View */}
      {viewMode === 'comparison' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Original Text */}
          <div className="card max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 sticky top-0 bg-white pb-2">
              Original
            </h3>
            <div className="prose prose-sm max-w-none text-secondary-700 leading-relaxed text-sm whitespace-pre-wrap">
              {originalText}
            </div>
          </div>

          {/* Summary Text */}
          <div className="card max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 sticky top-0 bg-white pb-2">
              Summary
            </h3>
            <div className="prose prose-sm max-w-none text-secondary-700 leading-relaxed text-sm whitespace-pre-wrap">
              {summaryText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
