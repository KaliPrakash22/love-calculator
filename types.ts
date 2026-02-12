
export interface LoveResult {
  percentage: number;
  verdict: string;
  advice: string;
  compatibilityFactors: {
    passion: number;
    trust: number;
    communication: number;
    fun: number;
  };
  logicInsights: {
    flames: string;
    numerologyMatch: string;
    sharedTraits: string[];
  };
}

export interface LoveAnalysisParams {
  name1: string;
  name2: string;
}
