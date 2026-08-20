import { Trip } from '@/types';

export function generateTripSummary(trip: Trip): string {
  const totalActivities = trip.itinerary.reduce((sum, day) => sum + day.activities.length, 0);
  const completedActivities = trip.itinerary.reduce(
    (sum, day) => sum + day.activities.filter(a => a.completed).length,
    0
  );

  const totalSpent = trip.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const journalCount = trip.journalEntries.length;

  if (trip.status === 'upcoming') {
    return `You have an upcoming trip to ${trip.destinationName} planned from ${trip.startDate} to ${trip.endDate}. Your itinerary includes ${totalActivities} exciting activities customized for your interest in ${trip.interests.slice(0, 3).join(', ')}. You have set a budget limit of INR ${trip.budgetLimit.toLocaleString()} for this ${trip.duration}-day journey.`;
  }

  let text = `Your ${trip.duration}-day journey to ${trip.destinationName} is ${trip.status === 'completed' ? 'complete' : 'ongoing'}. `;

  if (completedActivities > 0) {
    text += `You have successfully completed ${completedActivities} of the ${totalActivities} planned activities, exploring local favorites such as ${
      trip.itinerary
        .flatMap(d => d.activities)
        .filter(a => a.completed)
        .slice(0, 2)
        .map(a => a.title)
        .join(' and ') || 'the heritage sites'
    }. `;
  } else {
    text += `You have not checked off any itinerary activities yet. `;
  }

  if (journalCount > 0) {
    text += `You captured ${journalCount} beautiful memory ${journalCount === 1 ? 'entry' : 'entries'} in your travel journal, noting reflections from spots like ${
      trip.journalEntries[0].location
    }. `;
  }

  text += `Financially, you spent a total of INR ${totalSpent.toLocaleString()} out of your INR ${trip.budgetLimit.toLocaleString()} budget. `;

  if (totalSpent > trip.budgetLimit) {
    text += `This leaves you over budget by INR ${(totalSpent - trip.budgetLimit).toLocaleString()}. `;
  } else {
    text += `This leaves you with a healthy remaining balance of INR ${(trip.budgetLimit - totalSpent).toLocaleString()}! `;
  }

  if (trip.status === 'completed') {
    text += `Overall, it was a productive travel experience matching your ${trip.travelStyle} travel style.`;
  } else {
    text += `Keep logging activities and expenses to maintain your trip diary!`;
  }

  return text;
}
