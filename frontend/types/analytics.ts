export interface AnalysisResult {
    text: string;
    prediction: string;
    confidence: number;
    confidence_percentage: number;
    reliability_score: number;
    explanation: string[];
    red_flags: string[];
    credibility_marks: string[];
    key_phrases: KeyPhrase[];
    features: {
      word_count: number;
      char_count: number;
      sentence_count: number;
      avg_word_length: number;
      fake_phrase_count: number;
      real_phrase_count: number;
      fake_phrase_categories: Record<string, number>;
      real_phrase_categories: Record<string, number>;
      credibility_indicators: {
        claim_count: number;
        hedge_count: number;
        quoted_text_count: number;
        url_count: number;
      };
      pos_analysis: {
        noun_ratio: number;
        verb_ratio: number;
        adj_ratio: number;
        adv_ratio: number;
      };
      sentiment: {
        compound: number;
        positive: number;
        negative: number;
        neutral: number;
      };
      style_metrics: {
        exclamation_count: number;
        question_count: number;
        all_caps_ratio: number;
        punctuation_ratio: number;
        complex_word_ratio: number;
        readability_score: number;
      };
    };
  }
  
  export interface KeyPhrase {
    phrase: string;
    category: string;
    context: string;
  }
  
  export interface HistoryItem extends AnalysisResult {
    timestamp: Date;
  }
  