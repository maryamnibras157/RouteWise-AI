import { Destination, Settings } from '@/types';
import { DESTINATIONS } from './destinationEngine';

export interface RecommendedDestination {
  destination: Destination;
  score: number; // 0 to 100
  matchReason: string;
}

export function getRecommendations(
  interests: string[],
  budgetLevel: 'budget' | 'moderate' | 'premium' | 'luxury' | string,
  travelStyle: string
): RecommendedDestination[] {
  return DESTINATIONS.map(dest => {
    let score = 50; // Base score
    const matchingInterests: string[] = [];

    // 1. Match interests with attractions categories
    interests.forEach(interest => {
      const cleanInterest = interest.toLowerCase();
      const hasMatch = dest.attractions.some(attr => {
        const cat = attr.category.toLowerCase();
        // Match terms like 'nature' to 'nature', 'spiritual' to 'spiritual', 'history' to 'history'/'culture'
        return cat.includes(cleanInterest) || 
               cleanInterest.includes(cat) ||
               (cleanInterest === 'photography' && cat === 'nature') ||
               (cleanInterest === 'culture' && cat === 'history') ||
               (cleanInterest === 'adventure' && cat === 'nature');
      });

      if (hasMatch) {
        score += 12;
        matchingInterests.push(interest);
      }
    });

    // 2. Match travel style features
    const style = travelStyle.toLowerCase();
    const isFamily = style === 'family-friendly' || style === 'family';
    const isBackpacker = style === 'backpacker';
    const isLuxuryStyle = style === 'luxury';

    const hasFamilyAttractions = dest.attractions.some(attr => attr.category === 'family');
    const destBudgetEstimate = dest.budgetEstimate.toLowerCase();

    if (isFamily && hasFamilyAttractions) {
      score += 15;
    }
    if (isBackpacker && destBudgetEstimate.includes('budget-friendly')) {
      score += 15;
    }
    if (isLuxuryStyle && destBudgetEstimate.includes('premium')) {
      score += 15;
    }

    // 3. Match budget level
    const budget = budgetLevel.toLowerCase();
    if (budget === 'budget' && destBudgetEstimate.includes('budget-friendly')) {
      score += 10;
    } else if (budget === 'moderate' && destBudgetEstimate.includes('moderate')) {
      score += 10;
    } else if ((budget === 'premium' || budget === 'luxury') && (destBudgetEstimate.includes('premium') || destBudgetEstimate.includes('luxury'))) {
      score += 10;
    }

    // Cap score at 100 and floor at 10
    score = Math.max(10, Math.min(100, score));

    // Construct a contextual reason
    let matchReason = '';
    if (matchingInterests.length > 0) {
      const interestList = matchingInterests.slice(0, 3).join(' & ');
      matchReason = `Highly matches your interest in ${interestList}. `;
    } else {
      matchReason = `Matches your general travel profile. `;
    }

    if (isFamily && hasFamilyAttractions) {
      matchReason += `Offers excellent family-friendly attractions like ${dest.attractions.find(a => a.category === 'family')?.name}. `;
    } else if (isBackpacker && destBudgetEstimate.includes('budget-friendly')) {
      matchReason += `Fits backpacker budgets with affordable accommodation and transport. `;
    } else if (destBudgetEstimate.includes(budget)) {
      matchReason += `Aligns well with your ${budgetLevel} spending preference. `;
    } else {
      matchReason += `Perfect season is ${dest.bestTime}. `;
    }

    return {
      destination: dest,
      score,
      matchReason
    };
  }).sort((a, b) => b.score - a.score);
}
