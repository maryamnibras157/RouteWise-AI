import { PackingItem } from '@/types';

export function generatePackingList(
  destinationId: string,
  duration: number,
  weatherCondition: string, // 'Rain' | 'Snow' | 'Clear' | 'Clouds' | etc.
  interests: string[],
  travelStyle: string
): PackingItem[] {
  const items: PackingItem[] = [];
  let idCounter = 1;

  const addItem = (name: string, category: string, reason: string) => {
    // Avoid duplicates
    if (!items.some(item => item.name.toLowerCase() === name.toLowerCase())) {
      items.push({
        id: `pck-${idCounter++}`,
        name,
        category,
        packed: false,
        isRecommended: true,
        recommendationReason: reason
      });
    }
  };

  // 1. Standard Essentials (Always added)
  addItem('Government ID Card & Photocopies', 'Documents', 'Essential travel ID');
  addItem('Toothbrush & Toothpaste', 'Toiletries', 'General hygiene');
  addItem('Mobile phone & charging cables', 'Electronics', 'Essential electronics');
  addItem('Cash & Credit/Debit cards', 'Documents', 'Payment methods');
  addItem('First aid band-aids & personal meds', 'Personal Care', 'Health and safety');
  addItem('Sanitizer & Face tissues', 'Personal Care', 'Hygiene on the go');
  addItem('Reusable water bottle', 'Travel Essentials', 'Hydration');

  // 2. Geography specific recommendations
  const dest = destinationId.toLowerCase();
  const isBeach = ['goa', 'pondicherry', 'chennai', 'mumbai', 'kochi'].includes(dest);
  const isCold = ['ooty', 'munnar', 'kodaikanal'].includes(dest);

  if (isBeach) {
    addItem('Swimwear', 'Clothing', 'Coastal beach destination');
    addItem('Sunscreen lotion (SPF 50+)', 'Toiletries', 'Coastal sun protection');
    addItem('Sunglasses', 'Travel Essentials', 'Bright coastal glare');
    addItem('Sandals / Flip-flops', 'Clothing', 'Beach walking');
    addItem('Light cotton t-shirts & shorts', 'Clothing', 'Humid coastal weather');
  } else if (isCold) {
    addItem('Heavy jacket or wool sweater', 'Clothing', 'Cold mountain climate');
    addItem('Thermal innerwear', 'Clothing', 'Chilly nights');
    addItem('Woolen socks & beanie cap', 'Clothing', 'Cold mountain climate');
    addItem('Cold cream & lip balm', 'Toiletries', 'Dry mountain wind protection');
    addItem('Thermos flask', 'Travel Essentials', 'Keeping water/tea hot');
  } else {
    // Plains/Hot areas
    addItem('Comfortable cotton wear', 'Clothing', 'Warm climate');
    addItem('Sunhat / Cap', 'Clothing', 'Sun protection');
    addItem('Sunscreen', 'Toiletries', 'Outdoor sun protection');
  }

  // 3. Weather specific recommendations
  const weather = weatherCondition.toLowerCase();
  if (weather.includes('rain') || weather.includes('drizzle') || weather.includes('thunderstorm')) {
    addItem('Compact umbrella', 'Travel Essentials', 'Rainy forecast');
    addItem('Raincoat / Waterproof jacket', 'Clothing', 'Rainy forecast');
    addItem('Waterproof footwear', 'Clothing', 'Wet streets');
    addItem('Zip-lock bags for electronics', 'Electronics', 'Protecting devices from moisture');
  } else if (weather.includes('snow') || weather.includes('freeze')) {
    addItem('Gloves & Muffler', 'Clothing', 'Freezing forecast');
    addItem('Insulated boots', 'Clothing', 'Snow/Freezing forecast');
  } else if (weather.includes('hot') || weather.includes('sunny') || weather.includes('clear')) {
    addItem('Electrolytes / ORS packets', 'Personal Care', 'Hot weather rehydration');
  }

  // 4. Interest specific recommendations
  interests.forEach(interest => {
    const term = interest.toLowerCase();
    if (term === 'adventure' || term === 'nature') {
      addItem('Sturdy hiking boots / trekking shoes', 'Activity Specific', 'Interests: Adventure trekking');
      addItem('Small daypack / backpack', 'Travel Essentials', 'Interests: Outdoor walking');
      addItem('Insect repellent spray', 'Personal Care', 'Forest hikes/outdoors');
      addItem('Energy bars & nuts', 'Activity Specific', 'Trek nourishment');
    }
    if (term === 'photography') {
      addItem('Camera, lenses & extra memory card', 'Electronics', 'Interests: Photography');
      addItem('Lens cleaning cloth & blower', 'Electronics', 'Interests: Photography maintenance');
      addItem('Portable power bank', 'Electronics', 'Extended photo shoots');
    }
    if (term === 'spiritual' || term === 'culture') {
      addItem('Modest temple-appropriate clothing', 'Clothing', 'Interests: Temple/religious site visits');
      addItem('Slip-on shoes', 'Clothing', 'Frequent shoe removal at shrines');
    }
  });

  // 5. Duration checks
  if (duration > 5) {
    addItem('Travel laundry wash packets', 'Toiletries', 'Long trip (>5 days)');
    addItem('Extra sets of underwear', 'Clothing', 'Long trip duration');
  }

  // 6. Travel Style adjustments
  const style = travelStyle.toLowerCase();
  if (style === 'backpacker') {
    addItem('Microfiber fast-dry towel', 'Travel Essentials', 'Style: Backpacker convenience');
    addItem('Universal travel lock', 'Travel Essentials', 'Style: Hostel locker security');
  } else if (style === 'luxury') {
    addItem('Semi-formal dinner outfits', 'Clothing', 'Style: Premium dining rules');
  }

  return items;
}
