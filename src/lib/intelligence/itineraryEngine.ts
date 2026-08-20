import { ItineraryDay, ItineraryActivity, Destination, Place } from '@/types';
import { DESTINATIONS } from './destinationEngine';

// Hardcoded generic activities when attractions run out, tailored to destinations
const MEAL_AND_LEISURE_TEMPLATES = {
  breakfast: [
    { title: 'Local South Indian Breakfast', desc: 'Savor fresh filter coffee, piping hot idlis, and crispy dosas at a heritage eatery.', cost: 150 },
    { title: 'Continental Cafe Breakfast', desc: 'Indulge in freshly baked pastries, sourdough toast, and artisanal brews.', cost: 350 },
    { title: 'Healthy Start Breakfast', desc: 'Fresh seasonal fruits, local cereals, and organic juices at a top-rated local café.', cost: 250 }
  ],
  lunch: [
    { title: 'Traditional Thali Lunch', desc: 'A rich multi-course meal served on a banana leaf showcasing local culinary traditions.', cost: 300 },
    { title: 'Seaside / Viewpoint Dining', desc: 'Enjoy fresh catch or local delicacies while overlooking beautiful scenery.', cost: 600 },
    { title: 'Bistro Lunch', desc: 'Quick and tasty woodfired sandwiches, burgers, or local quick-bites.', cost: 400 }
  ],
  evening: [
    { title: 'Local Market Walk', desc: 'Stroll through local bazaars, browse handicrafts, and sample popular street snacks.', cost: 100 },
    { title: 'Scenic Sunset View', desc: 'Find a peaceful spot or terrace café to watch the sun go down over the landscape.', cost: 0 },
    { title: 'Cultural Performance', desc: 'Attend a localized music, dance, or traditional puppet/art performance.', cost: 400 }
  ],
  dinner: [
    { title: 'Heritage Dinner', desc: 'Conclude the day at a restored colonial bungalow or traditional courtyard restaurant.', cost: 800 },
    { title: 'Street Food Trail', desc: 'Taste iconic local sweet items and savory snacks from legendary street vendors.', cost: 200 },
    { title: 'Premium Fine Dining', desc: 'A candlelit dinner featuring contemporary fusion dishes and local signature recipes.', cost: 1500 }
  ]
};

export function generateItinerary(
  destinationId: string,
  startDateStr: string,
  duration: number,
  budgetLevel: 'budget' | 'moderate' | 'premium' | 'luxury',
  interests: string[],
  travelStyle: string
): ItineraryDay[] {
  const dest = DESTINATIONS.find(d => d.id === destinationId.toLowerCase()) || DESTINATIONS[0];
  const start = new Date(startDateStr);

  // 1. Sort attractions based on user interests
  const scoredAttractions = dest.attractions.map(attr => {
    let score = 0;
    interests.forEach(interest => {
      if (attr.category.toLowerCase().includes(interest.toLowerCase())) {
        score += 10;
      }
    });
    // Add minor random factor for variety
    score += Math.random() * 3;
    return { attr, score };
  }).sort((a, b) => b.score - a.score).map(x => x.attr);

  const itinerary: ItineraryDay[] = [];

  // Determine activities per day based on travel style
  // relaxed: 1 attraction + meals + leisure
  // balanced: 2 attractions + meals + leisure
  // fast-paced: 3 attractions + meals + leisure
  let attractionsPerDay = 2;
  const style = travelStyle.toLowerCase();
  if (style === 'relaxed') {
    attractionsPerDay = 1;
  } else if (style === 'fast-paced') {
    attractionsPerDay = 3;
  }

  // Tracking used attractions so we do not repeat them
  let attractionIndex = 0;

  for (let d = 0; d < duration; d++) {
    const currentDayDate = new Date(start);
    currentDayDate.setDate(start.getDate() + d);
    const dateStr = currentDayDate.toISOString().split('T')[0];

    const dayActivities: ItineraryActivity[] = [];
    let actCount = 1;

    // A. Morning: Breakfast (always)
    const breakfastTemplate = budgetLevel === 'budget' || budgetLevel === 'moderate'
      ? MEAL_AND_LEISURE_TEMPLATES.breakfast[0]
      : MEAL_AND_LEISURE_TEMPLATES.breakfast[1];
    
    dayActivities.push({
      id: `${dest.id}-d${d + 1}-act${actCount++}`,
      title: breakfastTemplate.title,
      category: 'food',
      time: '08:30',
      duration: '1 hour',
      description: breakfastTemplate.desc,
      cost: adjustCostForBudget(breakfastTemplate.cost, budgetLevel),
      locationName: `${dest.name} Town`,
      completed: false
    });

    // B. Mid-Morning Activity (Attraction or Local Point)
    let morningAttr: Place | null = null;
    if (attractionIndex < scoredAttractions.length) {
      morningAttr = scoredAttractions[attractionIndex++];
    }

    if (morningAttr) {
      dayActivities.push({
        id: morningAttr.id,
        title: morningAttr.name,
        category: morningAttr.category,
        time: '10:00',
        duration: '2.5 hours',
        description: morningAttr.description,
        cost: adjustCostForBudget(morningAttr.costEstimate, budgetLevel),
        locationName: morningAttr.name,
        completed: false,
        lat: morningAttr.lat,
        lng: morningAttr.lng
      });
    } else {
      // Fallback local spot
      dayActivities.push({
        id: `${dest.id}-d${d + 1}-act${actCount++}`,
        title: `Explore ${dest.name} Heritage Quarter`,
        category: 'culture',
        time: '10:00',
        duration: '2 hours',
        description: 'Take a self-guided walk through the historic paths, admiring local architecture.',
        cost: 0,
        locationName: dest.name,
        completed: false,
        lat: dest.lat + (Math.random() - 0.5) * 0.02,
        lng: dest.lng + (Math.random() - 0.5) * 0.02
      });
    }

    // C. Afternoon: Lunch (always)
    const lunchTemplate = budgetLevel === 'budget'
      ? MEAL_AND_LEISURE_TEMPLATES.lunch[0]
      : budgetLevel === 'moderate'
      ? MEAL_AND_LEISURE_TEMPLATES.lunch[2]
      : MEAL_AND_LEISURE_TEMPLATES.lunch[1];

    dayActivities.push({
      id: `${dest.id}-d${d + 1}-act${actCount++}`,
      title: lunchTemplate.title,
      category: 'food',
      time: '13:00',
      duration: '1.5 hours',
      description: lunchTemplate.desc,
      cost: adjustCostForBudget(lunchTemplate.cost, budgetLevel),
      locationName: dest.name,
      completed: false
    });

    // D. Mid-Afternoon Activity (For balanced or fast-paced style)
    if (attractionsPerDay >= 2) {
      let afternoonAttr: Place | null = null;
      if (attractionIndex < scoredAttractions.length) {
        afternoonAttr = scoredAttractions[attractionIndex++];
      }

      if (afternoonAttr) {
        dayActivities.push({
          id: afternoonAttr.id,
          title: afternoonAttr.name,
          category: afternoonAttr.category,
          time: '15:00',
          duration: '2 hours',
          description: afternoonAttr.description,
          cost: adjustCostForBudget(afternoonAttr.costEstimate, budgetLevel),
          locationName: afternoonAttr.name,
          completed: false,
          lat: afternoonAttr.lat,
          lng: afternoonAttr.lng
        });
      } else {
        // Fallback local craft view
        const eveningTemp = MEAL_AND_LEISURE_TEMPLATES.evening[0];
        dayActivities.push({
          id: `${dest.id}-d${d + 1}-act${actCount++}`,
          title: eveningTemp.title,
          category: 'shopping',
          time: '15:00',
          duration: '2 hours',
          description: eveningTemp.desc,
          cost: adjustCostForBudget(eveningTemp.cost, budgetLevel),
          locationName: `${dest.name} Market`,
          completed: false,
          lat: dest.lat + (Math.random() - 0.5) * 0.02,
          lng: dest.lng + (Math.random() - 0.5) * 0.02
        });
      }
    }

    // E. Late Afternoon / Evening (For fast-paced or just general leisure)
    if (attractionsPerDay >= 3) {
      let lateAttr: Place | null = null;
      if (attractionIndex < scoredAttractions.length) {
        lateAttr = scoredAttractions[attractionIndex++];
      }

      if (lateAttr) {
        dayActivities.push({
          id: lateAttr.id,
          title: lateAttr.name,
          category: lateAttr.category,
          time: '17:30',
          duration: '2 hours',
          description: lateAttr.description,
          cost: adjustCostForBudget(lateAttr.costEstimate, budgetLevel),
          locationName: lateAttr.name,
          completed: false,
          lat: lateAttr.lat,
          lng: lateAttr.lng
        });
      }
    } else {
      // For relaxed/balanced: add sunset/leisure view
      const sunsetTemp = MEAL_AND_LEISURE_TEMPLATES.evening[1];
      dayActivities.push({
        id: `${dest.id}-d${d + 1}-act${actCount++}`,
        title: `${dest.name} Sunset Spot`,
        category: 'nature',
        time: '17:30',
        duration: '1.5 hours',
        description: sunsetTemp.desc,
        cost: 0,
        locationName: dest.name,
        completed: false,
        lat: dest.lat + (Math.random() - 0.5) * 0.015,
        lng: dest.lng + (Math.random() - 0.5) * 0.015
      });
    }

    // F. Night: Dinner (always)
    const dinnerTemplate = budgetLevel === 'budget'
      ? MEAL_AND_LEISURE_TEMPLATES.dinner[1]
      : budgetLevel === 'moderate'
      ? MEAL_AND_LEISURE_TEMPLATES.dinner[0]
      : MEAL_AND_LEISURE_TEMPLATES.dinner[2];

    dayActivities.push({
      id: `${dest.id}-d${d + 1}-act${actCount++}`,
      title: dinnerTemplate.title,
      category: 'food',
      time: '20:00',
      duration: '1.5 hours',
      description: dinnerTemplate.desc,
      cost: adjustCostForBudget(dinnerTemplate.cost, budgetLevel),
      locationName: dest.name,
      completed: false
    });

    itinerary.push({
      dayNumber: d + 1,
      date: dateStr,
      activities: dayActivities
    });
  }

  return itinerary;
}

// Adjust prices dynamically based on budget tier
function adjustCostForBudget(baseCost: number, budgetLevel: string): number {
  if (baseCost === 0) return 0;
  const level = budgetLevel.toLowerCase();
  
  if (level === 'budget') {
    return Math.round(baseCost * 0.6);
  } else if (level === 'moderate') {
    return baseCost;
  } else if (level === 'premium') {
    return Math.round(baseCost * 1.5);
  } else if (level === 'luxury') {
    return Math.round(baseCost * 3.0);
  }
  return baseCost;
}
