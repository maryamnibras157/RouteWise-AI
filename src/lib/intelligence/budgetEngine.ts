import { Expense } from '@/types';

export interface BudgetReport {
  totalBudgetLimit: number;
  totalSpent: number;
  remainingBudget: number;
  spentPercentage: number;
  budgetStatus: 'healthy' | 'warning' | 'critical' | 'over';
  statusMessage: string;
}

export function estimateTripCost(
  duration: number,
  travelers: number,
  budgetLevel: 'budget' | 'moderate' | 'premium' | 'luxury'
): {
  total: number;
  categories: {
    Accommodation: number;
    Food: number;
    Transport: number;
    Shopping: number;
    Activities: number;
  };
} {
  const level = budgetLevel.toLowerCase();
  
  // Rate matrix per day per traveler (INR)
  let accommodationRate = 1200;
  let foodRate = 500;
  let transportRate = 400;
  let activitiesRate = 200;
  let shoppingRate = 1000; // per trip rate

  if (level === 'budget') {
    accommodationRate = 600;
    foodRate = 300;
    transportRate = 200;
    activitiesRate = 100;
    shoppingRate = 500;
  } else if (level === 'premium') {
    accommodationRate = 3000;
    foodRate = 1200;
    transportRate = 1000;
    activitiesRate = 600;
    shoppingRate = 3000;
  } else if (level === 'luxury') {
    accommodationRate = 8000;
    foodRate = 2500;
    transportRate = 2500;
    activitiesRate = 1500;
    shoppingRate = 8000;
  }

  // Calculate totals
  const accommodation = accommodationRate * (duration - 1) * travelers; // duration - 1 nights
  const food = foodRate * duration * travelers;
  const transport = transportRate * duration * travelers;
  const activities = activitiesRate * duration * travelers;
  const shopping = shoppingRate * travelers;

  const total = accommodation + food + transport + activities + shopping;

  return {
    total,
    categories: {
      Accommodation: accommodation,
      Food: food,
      Transport: transport,
      Shopping: shopping,
      Activities: activities
    }
  };
}

export function getBudgetReport(budgetLimit: number, expenses: Expense[]): BudgetReport {
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingBudget = budgetLimit - totalSpent;
  const spentPercentage = budgetLimit > 0 ? Math.round((totalSpent / budgetLimit) * 100) : 0;

  let budgetStatus: 'healthy' | 'warning' | 'critical' | 'over' = 'healthy';
  let statusMessage = 'Your budget is in good health. Keep capturing expenses as you travel!';

  if (spentPercentage > 100) {
    budgetStatus = 'over';
    statusMessage = `You are over budget by INR ${Math.abs(remainingBudget).toLocaleString()}! Review recent expenses and cut down on non-essential activities.`;
  } else if (spentPercentage >= 90) {
    budgetStatus = 'critical';
    statusMessage = `Critical budget alert! You have utilized ${spentPercentage}% of your total budget. Strongly recommend freezing leisure shopping and premium dining.`;
  } else if (spentPercentage >= 75) {
    budgetStatus = 'warning';
    statusMessage = `Budget warning. You have spent ${spentPercentage}% of your limit. Consider monitoring meal costs and walking where possible to save transport fees.`;
  }

  return {
    totalBudgetLimit: budgetLimit,
    totalSpent,
    remainingBudget,
    spentPercentage,
    budgetStatus,
    statusMessage
  };
}
