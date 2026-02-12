
import { GoogleGenAI, Type } from "@google/genai";
import { LoveResult } from "../types";

/**
 * Proper FLAMES algorithm:
 * Iteratively removes characters from the FLAMES string based on the count
 * of remaining letters after striking out common ones.
 */
const getFlames = (n1: string, n2: string): string => {
  const name1 = n1.toLowerCase().replace(/\s/g, '').split('');
  const name2 = n2.toLowerCase().replace(/\s/g, '').split('');
  
  // Strike out common letters logic
  const combined = [...new Set([...name1, ...name2])];
  let count = 0;
  combined.forEach(char => {
    const count1 = name1.filter(c => c === char).length;
    const count2 = name2.filter(c => c === char).length;
    count += Math.abs(count1 - count2);
  });

  if (count === 0) return "Soulmates";

  let flames = ["Friendship", "Love", "Affection", "Marriage", "Enmity", "Soulmates"];
  let currentIndex = 0;

  while (flames.length > 1) {
    let removeIndex = (currentIndex + count - 1) % flames.length;
    flames.splice(removeIndex, 1);
    currentIndex = removeIndex % flames.length;
  }

  return flames[0];
};

/**
 * Pythagorean Numerology reduction.
 * Handles Master Numbers (11, 22, 33).
 */
const getNumerologyScore = (name: string): number => {
  const n = name.toLowerCase().replace(/[^a-z]/g, '');
  let sum = 0;
  for (let i = 0; i < n.length; i++) {
    const val = (n.charCodeAt(i) - 96) % 9;
    sum += val === 0 ? 9 : val;
  }

  const reduce = (num: number): number => {
    if (num === 11 || num === 22 || num === 33) return num;
    if (num < 10) return num;
    const next = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    return reduce(next);
  };

  return reduce(sum);
};

/**
 * Evaluates harmony between two numerology numbers based on standard compatibility charts.
 */
const getNumerologyHarmony = (num1: number, num2: number): number => {
  const compatibility: Record<number, number[]> = {
    1: [1, 3, 5, 7, 9],
    2: [2, 4, 6, 8, 11],
    3: [1, 3, 6, 9],
    4: [2, 4, 7, 8, 22],
    5: [1, 5, 7, 33],
    6: [2, 3, 6, 9],
    7: [1, 4, 5, 7],
    8: [2, 4, 8],
    9: [1, 3, 6, 9],
    11: [2, 11, 22],
    22: [4, 11, 22],
    33: [6, 33]
  };

  const list1 = compatibility[num1] || [];
  const list2 = compatibility[num2] || [];

  if (num1 === num2) return 95;
  if (list1.includes(num2) || list2.includes(num1)) return 85;
  return 50;
};

const getLetterSymmetry = (n1: string, n2: string): number => {
  const s1 = new Set(n1.toLowerCase().replace(/\s/g, '').split(''));
  const s2 = new Set(n2.toLowerCase().replace(/\s/g, '').split(''));
  const intersection = new Set([...s1].filter(x => s2.has(x)));
  const union = new Set([...s1, ...s2]);
  if (union.size === 0) return 0;
  return Math.round((intersection.size / union.size) * 100);
};

export const calculateLoveAI = async (name1: string, name2: string): Promise<LoveResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const flamesResult = getFlames(name1, name2);
  const num1 = getNumerologyScore(name1);
  const num2 = getNumerologyScore(name2);
  const harmonyScore = getNumerologyHarmony(num1, num2);
  const symmetry = getLetterSymmetry(name1, name2);
  const sharedLetters = name1.toLowerCase().split('').filter(char => name2.toLowerCase().includes(char) && char !== ' ');

  const prompt = `
    Perform a special Valentine's Day "HeartBound Destiny Report" for ${name1} and ${name2}.
    Foundation Data (Unrigged Logic):
    - FLAMES Result: ${flamesResult}
    - Numerology: ${name1} (Number ${num1}), ${name2} (Number ${num2})
    - Harmony Score: ${harmonyScore}/100
    - Name Symmetry: ${symmetry}%
    - Shared Letters: ${[...new Set(sharedLetters)].join(', ')}

    Analyze these inputs with a romantic, Valentine's friendly tone. Be honest about the compatibility but wrap the verdict in poetic or witty Valentine-themed language.
    Include:
    1. percentage: Final compatibility score.
    2. verdict: A catchy Valentine-themed verdict.
    3. advice: Sweet relationship advice for this couple.
    4. logicInsights:
       - flames: The exact result calculated.
       - numerologyMatch: Romantic vibe between numbers ${num1} and ${num2}.
       - sharedTraits: 3 traits shared by these two names.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            percentage: { type: Type.NUMBER },
            verdict: { type: Type.STRING },
            advice: { type: Type.STRING },
            compatibilityFactors: {
              type: Type.OBJECT,
              properties: {
                passion: { type: Type.NUMBER },
                trust: { type: Type.NUMBER },
                communication: { type: Type.NUMBER },
                fun: { type: Type.NUMBER }
              },
              required: ["passion", "trust", "communication", "fun"]
            },
            logicInsights: {
              type: Type.OBJECT,
              properties: {
                flames: { type: Type.STRING },
                numerologyMatch: { type: Type.STRING },
                sharedTraits: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["flames", "numerologyMatch", "sharedTraits"]
            }
          },
          required: ["percentage", "verdict", "advice", "compatibilityFactors", "logicInsights"]
        }
      }
    });

    return JSON.parse(response.text || "{}") as LoveResult;
  } catch (error) {
    console.error("Gemini Error:", error);
    const combinedPct = Math.round((harmonyScore + symmetry) / 2);
    return {
      percentage: combinedPct,
      verdict: "A Valentine's connection that speaks through the stars.",
      advice: "Cherish the unique rhythm your hearts create together.",
      compatibilityFactors: { 
        passion: Math.min(100, symmetry + 20), 
        trust: Math.min(100, harmonyScore), 
        communication: Math.min(100, 50), 
        fun: Math.min(100, 70) 
      },
      logicInsights: {
        flames: flamesResult,
        numerologyMatch: `${num1} meets ${num2}`,
        sharedTraits: ["Authenticity", "Deep Connection", "Mutual Growth"]
      }
    };
  }
};
