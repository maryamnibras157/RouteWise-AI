import { Trip } from '@/types';
import { getBudgetReport } from './budgetEngine';
import { generateTripSummary } from './summaryEngine';

export interface AssistantResponse {
  answer: string;
  suggestions: string[];
}

export function askRouteWiseAssistant(query: string, trip: Trip | null): AssistantResponse {
  const cleanQuery = query.toLowerCase().trim();

  // If no trip is currently open
  if (!trip) {
    return {
      answer: "I am ready to help, but you don't have an active trip selected. Please open or plan a trip first so I can assist you with your itinerary, budget, or packing list!",
      suggestions: ['Plan a New Trip', 'Browse Sample Trips']
    };
  }

  // Helper to list uncompleted items
  const getUncompletedActivities = () => {
    const list: string[] = [];
    trip.itinerary.forEach(day => {
      day.activities.forEach(act => {
        if (!act.completed) {
          list.push(`Day ${day.dayNumber}: ${act.title} (${act.time})`);
        }
      });
    });
    return list;
  };

  // 1. INTENT: Budget / Expenses
  if (
    cleanQuery.includes('budget') ||
    cleanQuery.includes('spend') ||
    cleanQuery.includes('spent') ||
    cleanQuery.includes('cost') ||
    cleanQuery.includes('money') ||
    cleanQuery.includes('expense')
  ) {
    const report = getBudgetReport(trip.budgetLimit, trip.expenses);
    const answer = `On your trip to ${trip.destinationName}, you have spent INR ${report.totalSpent.toLocaleString()} out of your INR ${report.totalBudgetLimit.toLocaleString()} budget limit.
    
Status: ${report.budgetStatus.toUpperCase()} (${report.spentPercentage}% spent)
Remaining: INR ${report.remainingBudget.toLocaleString()}

${report.statusMessage}`;

    return {
      answer,
      suggestions: ['Add an Expense', 'Show Expense Charts', 'Summarize my trip']
    };
  }

  // 2. INTENT: Packing
  if (
    cleanQuery.includes('pack') ||
    cleanQuery.includes('clothing') ||
    cleanQuery.includes('toiletries') ||
    cleanQuery.includes('items') ||
    cleanQuery.includes('bag')
  ) {
    const totalItems = trip.packingList.length;
    const packedItems = trip.packingList.filter(i => i.packed).length;
    const unpacked = trip.packingList.filter(i => !i.packed);

    let answer = `You have packed ${packedItems} of ${totalItems} items (${Math.round(
      (packedItems / (totalItems || 1)) * 100
    )}%).`;

    if (unpacked.length > 0) {
      answer += `\n\nStill left to pack:\n` + unpacked.slice(0, 5).map(i => `- [ ] ${i.name} (${i.category})`).join('\n');
      if (unpacked.length > 5) {
        answer += `\n... and ${unpacked.length - 5} more items.`;
      }
    } else {
      answer += `\n\nAwesome! You are fully packed and ready to go!`;
    }

    return {
      answer,
      suggestions: ['View Packing List', 'Add Packing Item', 'What is the weather?']
    };
  }

  // 3. INTENT: Itinerary / Schedule / Next activity
  if (
    cleanQuery.includes('itinerary') ||
    cleanQuery.includes('schedule') ||
    cleanQuery.includes('tomorrow') ||
    cleanQuery.includes('do next') ||
    cleanQuery.includes('what to do') ||
    cleanQuery.includes('next') ||
    cleanQuery.includes('plan')
  ) {
    const uncompleted = getUncompletedActivities();
    let answer = '';

    if (uncompleted.length > 0) {
      answer = `Here are your next upcoming activities:\n\n` + uncompleted.slice(0, 4).join('\n') + 
        (uncompleted.length > 4 ? `\n... and ${uncompleted.length - 4} more activities scheduled.` : '');
    } else {
      answer = `You have completed all planned itinerary items! You can add new custom activities directly to any day on your Itinerary page.`;
    }

    return {
      answer,
      suggestions: ['View Itinerary', 'Add Custom Activity', 'Show map']
    };
  }

  // 4. INTENT: Not visited / Pending
  if (
    cleanQuery.includes('visit') ||
    cleanQuery.includes('completed') ||
    cleanQuery.includes('incomplete') ||
    cleanQuery.includes('pending') ||
    cleanQuery.includes('missed')
  ) {
    const uncompleted = getUncompletedActivities();
    let answer = '';

    if (uncompleted.length > 0) {
      answer = `You have not yet visited or completed these planned spots:\n\n` + uncompleted.slice(0, 5).join('\n') +
        (uncompleted.length > 5 ? `\n... and ${uncompleted.length - 5} other items pending.` : '');
    } else {
      answer = `Awesome! You have completed all scheduled visits for this trip.`;
    }

    return {
      answer,
      suggestions: ['View Itinerary', 'View Summary']
    };
  }

  // 5. INTENT: Summary
  if (cleanQuery.includes('summary') || cleanQuery.includes('summarize') || cleanQuery.includes('review')) {
    const answer = generateTripSummary(trip);
    return {
      answer,
      suggestions: ['View Timeline', 'View Expenses', 'View Safety Center']
    };
  }

  // 6. INTENT: Interests match
  if (cleanQuery.includes('interest') || cleanQuery.includes('recommend') || cleanQuery.includes('match')) {
    const matches: string[] = [];
    trip.itinerary.forEach(day => {
      day.activities.forEach(act => {
        const matchesInterest = trip.interests.some(interest => 
          act.category.toLowerCase().includes(interest.toLowerCase()) || 
          act.title.toLowerCase().includes(interest.toLowerCase())
        );
        if (matchesInterest) {
          matches.push(`Day ${day.dayNumber}: ${act.title} (${act.category})`);
        }
      });
    });

    let answer = '';
    if (matches.length > 0) {
      answer = `These activities match your interests (${trip.interests.join(', ')}):\n\n` + matches.slice(0, 5).join('\n');
    } else {
      answer = `I could not find any specific activities matching your selected interests in the current itinerary. You can search the Explore section to discover and add matching spots!`;
    }

    return {
      answer,
      suggestions: ['Explore Places', 'View Itinerary']
    };
  }

  // DEFAULT FALLBACK
  return {
    answer: `Hi there! I am your RouteWise Assistant. I have details about your trip to ${trip.destinationName}.
    
You can ask me questions like:
- "How much have I spent?" (Budget check)
- "What should I pack?" (Packing progress)
- "What should I do next?" (Itinerary check)
- "Summarize my trip" (Trip narrative)
- "Which activities match my interests?" (Interest analysis)
- "What places are still unvisited?" (Unfinished tasks)`,
    suggestions: [
      'What should I pack?',
      'How much have I spent?',
      'What should I do next?',
      'Summarize my trip'
    ]
  };
}
