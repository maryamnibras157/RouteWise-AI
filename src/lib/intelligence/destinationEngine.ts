import { Destination, Place } from '@/types';

export const DESTINATIONS: Destination[] = [
  {
    id: 'chennai',
    name: 'Chennai',
    description: 'Capital of Tamil Nadu, known for its rich culture, beaches, temples, and South Indian culinary delights.',
    lat: 13.0827,
    lng: 80.2707,
    attractions: [
      { id: 'ch1', name: 'Marina Beach', description: 'The second longest natural urban beach in the world.', lat: 13.0499, lng: 80.2824, category: 'nature', rating: 4.5, costEstimate: 0 },
      { id: 'ch2', name: 'Kapaleeshwarar Temple', description: '7th-century Dravidian temple dedicated to Lord Shiva.', lat: 13.0335, lng: 80.2694, category: 'spiritual', rating: 4.7, costEstimate: 50 },
      { id: 'ch3', name: 'Fort St. George', description: 'First English fortress in India, housing a rich history museum.', lat: 13.0792, lng: 80.2882, category: 'history', rating: 4.2, costEstimate: 100 },
      { id: 'ch4', name: 'Santhome Cathedral', description: 'Stunning white neo-gothic basilica built over the tomb of St. Thomas.', lat: 13.0340, lng: 80.2783, category: 'spiritual', rating: 4.4, costEstimate: 0 },
      { id: 'ch5', name: 'DakshinaChitra', description: 'Living museum showcasing South Indian heritage, crafts, and lifestyles.', lat: 12.8136, lng: 80.2422, category: 'culture', rating: 4.6, costEstimate: 150 }
    ],
    cuisines: ['Idli & Sambar', 'Filter Coffee', 'Masala Dosa', 'Chettinad Chicken Kurma'],
    bestTime: 'November to February (Cooler winter months)',
    budgetEstimate: 'Budget-friendly to Mid-range',
    safetyTips: [
      'Dress modestly when visiting temples and religious shrines.',
      'Stay hydrated; the climate can be very humid throughout the year.',
      'Beware of pickpockets on public transportation and crowded beaches.'
    ],
    emergencyContacts: {
      police: '100',
      hospital: '044-25305000 (Government General Hospital)',
      fire: '101'
    }
  },
  {
    id: 'pondicherry',
    name: 'Pondicherry',
    description: 'A charming coastal town with a distinctive French legacy, mustard-colored colonial villas, and quiet beaches.',
    lat: 11.9416,
    lng: 79.8083,
    attractions: [
      { id: 'pd1', name: 'Promenade Beach', description: 'Scenic rocky beachfront ideal for sunrise walks and evening sea breezes.', lat: 11.9358, lng: 79.8354, category: 'nature', rating: 4.6, costEstimate: 0 },
      { id: 'pd2', name: 'Auroville Matrimandir', description: 'Universal township focused on human unity, featuring a golden geodesic dome.', lat: 12.0069, lng: 79.8105, category: 'spiritual', rating: 4.8, costEstimate: 200 },
      { id: 'pd3', name: 'French Quarter heritage walk', description: 'Stroll along colonial streets with yellow-painted villas and bougainvillea.', lat: 11.9333, lng: 79.8315, category: 'culture', rating: 4.7, costEstimate: 100 },
      { id: 'pd4', name: 'Paradise Beach', description: 'Pristine sandbar accessible via a beautiful backwater boat ride.', lat: 11.8790, lng: 79.8174, category: 'nature', rating: 4.4, costEstimate: 250 },
      { id: 'pd5', name: 'Sri Aurobindo Ashram', description: 'Spiritual community founded by Sri Aurobindo and the Mother in 1926.', lat: 11.9442, lng: 79.8335, category: 'spiritual', rating: 4.5, costEstimate: 0 }
    ],
    cuisines: ['French Crepes', 'Pondy Fish Curry', 'Croissants', 'Woodfired Pizza'],
    bestTime: 'October to March (Pleasant weather)',
    budgetEstimate: 'Moderate',
    safetyTips: [
      'Use caution while swimming at beaches; undercurrents can be strong.',
      'Rent a scooter to explore the town, but ensure you wear a helmet.',
      'Reserve entry passes to Auroville in advance.'
    ],
    emergencyContacts: {
      police: '100',
      hospital: '0413-2236363 (JIPMER Hospital)',
      fire: '101'
    }
  },
  {
    id: 'ooty',
    name: 'Ooty',
    description: 'Queen of Hill Stations nestled in the Nilgiri hills, featuring tea plantations, mist-covered valleys, and heritage trains.',
    lat: 11.4102,
    lng: 76.6950,
    attractions: [
      { id: 'ot1', name: 'Ooty Botanical Gardens', description: 'Lush terraced gardens housing rare trees and a fossil tree trunk.', lat: 11.4190, lng: 76.7125, category: 'nature', rating: 4.4, costEstimate: 50 },
      { id: 'ot2', name: 'Doddabetta Peak', description: 'The highest mountain peak in the Nilgiri Hills, offering panoramic views.', lat: 11.4005, lng: 76.7377, category: 'nature', rating: 4.5, costEstimate: 20 },
      { id: 'ot3', name: 'Nilgiri Mountain Railway', description: 'UNESCO World Heritage toy train steam ride passing through tunnels and bridges.', lat: 11.4082, lng: 76.7020, category: 'history', rating: 4.8, costEstimate: 300 },
      { id: 'ot4', name: 'Ooty Lake', description: 'Scenic artificial lake offering motorboats, rowboats, and paddleboats.', lat: 11.4075, lng: 76.6853, category: 'family', rating: 4.1, costEstimate: 120 },
      { id: 'ot5', name: 'Pykara Waterfalls & Lake', description: 'Breathtaking waterfalls and a peaceful lake surrounded by shola forests.', lat: 11.5283, lng: 76.6022, category: 'nature', rating: 4.6, costEstimate: 100 }
    ],
    cuisines: ['Nilgiri Tea', 'Homemade Chocolates', 'Ooty Varkey', 'Warm Stews'],
    bestTime: 'October to June (Avoid heavy monsoon in July-September)',
    budgetEstimate: 'Moderate to Premium',
    safetyTips: [
      'Carry warm clothing even in summer as temperatures drop at night.',
      'Roads are winding ghats; carry motion sickness remedies if needed.',
      'Protect your food from monkeys near major viewpoints.'
    ],
    emergencyContacts: {
      police: '100',
      hospital: '0423-2442212 (District HQ Hospital)',
      fire: '101'
    }
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    description: 'The Manchester of South India, known for industrial ingenuity, pleasant weather, and proximity to scenic hills.',
    lat: 11.0168,
    lng: 76.9558,
    attractions: [
      { id: 'cb1', name: 'Adiyogi Shiva Temple', description: '112-foot tall steel bust of Lord Shiva, listed by Guinness World Records.', lat: 10.9764, lng: 76.7360, category: 'spiritual', rating: 4.8, costEstimate: 0 },
      { id: 'cb2', name: 'Gass Forest Museum', description: 'Historical forestry museum housing taxidermy, specimens, and old artifacts.', lat: 11.0152, lng: 76.9458, category: 'history', rating: 4.3, costEstimate: 40 },
      { id: 'cb3', name: 'Marudhamalai Temple', description: 'A hilltop temple dedicated to Lord Murugan with peaceful panoramic views.', lat: 11.0475, lng: 76.8833, category: 'spiritual', rating: 4.6, costEstimate: 20 },
      { id: 'cb4', name: 'Siruvani Waterfalls', description: 'Waterfalls feeding water reputed to be the second sweetest in the world.', lat: 10.9400, lng: 76.6900, category: 'nature', rating: 4.5, costEstimate: 50 }
    ],
    cuisines: ['Kari Dosa', 'Coimbatore Biryani', 'Kollu Soup', 'Pallipalayam Chicken'],
    bestTime: 'September to March',
    budgetEstimate: 'Budget-friendly',
    safetyTips: [
      'Adiyogi is outside the main city; plan return transport beforehand.',
      'Waterfalls may be closed during heavy rain due to flash flood risks.'
    ],
    emergencyContacts: {
      police: '100',
      hospital: '0422-2301393 (Coimbatore Medical College)',
      fire: '101'
    }
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    description: 'Indias Silicon Valley, famous for its parks, gardens, microbreweries, and modern urban lifestyle.',
    lat: 12.9716,
    lng: 77.5946,
    attractions: [
      { id: 'bl1', name: 'Lalbagh Botanical Garden', description: 'Scenic park featuring a historic glass house and ancient trees.', lat: 12.9507, lng: 77.5844, category: 'nature', rating: 4.5, costEstimate: 30 },
      { id: 'bl2', name: 'Bangalore Palace', description: 'Stunning royal palace modeled after Windsor Castle, showcasing old grandeur.', lat: 12.9980, lng: 77.5921, category: 'history', rating: 4.4, costEstimate: 230 },
      { id: 'bl3', name: 'Cubbon Park', description: 'Massive green lung of the city, perfect for jogging and picnics.', lat: 12.9739, lng: 77.5960, category: 'nature', rating: 4.6, costEstimate: 0 },
      { id: 'bl4', name: 'Nandi Hills', description: 'A popular hill fortress nearby, legendary for breathtaking sunrise views.', lat: 13.3702, lng: 77.6835, category: 'adventure', rating: 4.5, costEstimate: 100 }
    ],
    cuisines: ['Bisi Bele Bath', 'Mysore Pak', 'Craft Beers', 'Rava Idli'],
    bestTime: 'October to February',
    budgetEstimate: 'Moderate to Premium',
    safetyTips: [
      'Plan travel around peak hours to avoid severe traffic congestion.',
      'Use app-based taxis for predictable travel pricing.',
      'Pre-book sunrise passes if traveling to Nandi Hills on weekends.'
    ],
    emergencyContacts: {
      police: '100',
      hospital: '080-22238260 (St. Johns Hospital)',
      fire: '101'
    }
  },
  {
    id: 'kochi',
    name: 'Kochi',
    description: 'Kerala coastal city blending colonial history, spice trade, and serene backwater passages.',
    lat: 9.9312,
    lng: 76.2673,
    attractions: [
      { id: 'kc1', name: 'Fort Kochi & Chinese Fishing Nets', description: 'Historic seaside neighborhood lined with colonial architecture and fishing nets.', lat: 9.9678, lng: 76.2427, category: 'culture', rating: 4.5, costEstimate: 0 },
      { id: 'kc2', name: 'Mattancherry Palace', description: 'Also known as the Dutch Palace, featuring mural paintings of Hindu temple art.', lat: 9.9592, lng: 76.2592, category: 'history', rating: 4.3, costEstimate: 20 },
      { id: 'kc3', name: 'Jew Town & Paradesi Synagogue', description: 'Antiques shopping hub housing the oldest active synagogue in the Commonwealth.', lat: 9.9576, lng: 76.2598, category: 'culture', rating: 4.5, costEstimate: 10 },
      { id: 'kc4', name: 'Kerala Kathakali Centre', description: 'Traditional theater featuring elaborate Kathakali dance and martial arts.', lat: 9.9642, lng: 76.2443, category: 'culture', rating: 4.7, costEstimate: 300 }
    ],
    cuisines: ['Kerala Puttu & Kadala', 'Karimeen Pollichathu', 'Banana Chips', 'Appam & Stew'],
    bestTime: 'September to March',
    budgetEstimate: 'Moderate',
    safetyTips: [
      'Take public ferries between Fort Kochi and Ernakulam to save time and money.',
      'Drink bottled water and try local coconut water.'
    ],
    emergencyContacts: {
      police: '100',
      hospital: '0484-2361234 (Ernakulam General Hospital)',
      fire: '101'
    }
  },
  {
    id: 'munnar',
    name: 'Munnar',
    description: 'Mist-clad mountains, sprawling cardamom and tea gardens, and rich wildlife sanctuaries in Kerala.',
    lat: 10.0889,
    lng: 77.0595,
    attractions: [
      { id: 'mn1', name: 'Eravikulam National Park', description: 'Home to the endangered Nilgiri Tahr mountain goat and rare orchids.', lat: 10.1983, lng: 77.0864, category: 'nature', rating: 4.6, costEstimate: 200 },
      { id: 'mn2', name: 'Mattupetty Dam & Lake', description: 'Storage concrete gravity dam with boating activities, surrounded by green hills.', lat: 10.1060, lng: 77.1245, category: 'family', rating: 4.2, costEstimate: 100 },
      { id: 'mn3', name: 'Tata Tea Museum', description: 'Exhibition of processing methods, antique tea-rollers, and history archives.', lat: 10.0934, lng: 77.0601, category: 'history', rating: 4.3, costEstimate: 75 },
      { id: 'mn4', name: 'Top Station', description: 'Breathtaking viewpoint on the Kerala-Tamil Nadu border offering cloud valleys.', lat: 10.1250, lng: 77.2460, category: 'nature', rating: 4.7, costEstimate: 50 }
    ],
    cuisines: ['Spiced Tea', 'Idiyappam', 'Malabar Parotta', 'Banana Fritters'],
    bestTime: 'October to May',
    budgetEstimate: 'Moderate to Premium',
    safetyTips: [
      'Mist can cause poor driving visibility; avoid traveling along ghat roads after dark.',
      'Wear sturdy trekking shoes to prevent slips on muddy paths.',
      'Watch out for leeches during forest walks.'
    ],
    emergencyContacts: {
      police: '100',
      hospital: '0486-5230263 (Tata General Hospital)',
      fire: '101'
    }
  },
  {
    id: 'madurai',
    name: 'Madurai',
    description: 'One of Indias oldest continuously inhabited cities, celebrated for its spectacular temples and street food culture.',
    lat: 9.9252,
    lng: 78.1198,
    attractions: [
      { id: 'md1', name: 'Meenakshi Amman Temple', description: 'Historical Hindu temple complex famed for its 14 towering gopurams.', lat: 9.9195, lng: 78.1193, category: 'spiritual', rating: 4.9, costEstimate: 50 },
      { id: 'md2', name: 'Thirumalai Nayakkar Mahal', description: '17th-century palace featuring huge white pillars and sound & light shows.', lat: 9.9152, lng: 78.1244, category: 'history', rating: 4.4, costEstimate: 50 },
      { id: 'md3', name: 'Gandhi Memorial Museum', description: 'Historical museum featuring rare artifacts related to Gandhi, including blood-stained clothes.', lat: 9.9298, lng: 78.1360, category: 'history', rating: 4.5, costEstimate: 10 },
      { id: 'md4', name: 'Alagar Kovil', description: 'Ancient temple situated at the foot of scenic hills with detailed sculpture ruins.', lat: 10.0762, lng: 78.2144, category: 'spiritual', rating: 4.6, costEstimate: 20 }
    ],
    cuisines: ['Jigarthanda', 'Kari Dosa', 'Idli from Murugan Idli Shop', 'Paruthi Paal'],
    bestTime: 'October to March',
    budgetEstimate: 'Budget-friendly',
    safetyTips: [
      'Temple rules are strict; no mobile phones or cameras are allowed inside the main temple premises.',
      'Avoid drinking unbottled tap water.'
    ],
    emergencyContacts: {
      police: '100',
      hospital: '0452-2532535 (Government Rajaji Hospital)',
      fire: '101'
    }
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    description: 'City of Pearls and Nizams, renowned for monumental heritage, IT hubs, and world-class Biryanis.',
    lat: 17.3850,
    lng: 78.4867,
    attractions: [
      { id: 'hy1', name: 'Charminar', description: 'Iconic 16th-century mosque with four minarets overlooking bustling markets.', lat: 17.3616, lng: 78.4747, category: 'history', rating: 4.6, costEstimate: 40 },
      { id: 'hy2', name: 'Golconda Fort', description: 'Massive fortress complex renowned for acoustic echoes and diamond trade history.', lat: 17.3833, lng: 78.4011, category: 'history', rating: 4.7, costEstimate: 80 },
      { id: 'hy3', name: 'Ramoji Film City', description: 'Huge movie production studios complex with interactive shows and parks.', lat: 17.2543, lng: 78.6808, category: 'family', rating: 4.4, costEstimate: 1300 },
      { id: 'hy4', name: 'Salargunj Museum', description: 'A massive collection of global art, clocks, and sculptures owned by Salar Jung III.', lat: 17.3713, lng: 78.4804, category: 'culture', rating: 4.5, costEstimate: 50 }
    ],
    cuisines: ['Hyderabadi Biryani', 'Double Ka Meetha', 'Haleem', 'Irani Chai with Osmania Biscuits'],
    bestTime: 'September to March',
    budgetEstimate: 'Moderate',
    safetyTips: [
      'The markets surrounding Charminar are extremely crowded; guard belongings closely.',
      'Ramoji Film City takes a whole day; start early.'
    ],
    emergencyContacts: {
      police: '100',
      hospital: '040-23489000 (NIMS Hospital)',
      fire: '101'
    }
  },
  {
    id: 'goa',
    name: 'Goa',
    description: 'Indias beach paradise, featuring historic Portuguese churches, vibrant markets, and scenic coastlines.',
    lat: 15.2993,
    lng: 74.1240,
    attractions: [
      { id: 'go1', name: 'Basilica of Bom Jesus', description: 'UNESCO World Heritage church containing the mortal remains of St. Francis Xavier.', lat: 15.5008, lng: 73.9116, category: 'history', rating: 4.7, costEstimate: 0 },
      { id: 'go2', name: 'Calangute & Baga Beaches', description: 'Lively beaches with water sports, seafood shacks, and nightlife options.', lat: 15.5479, lng: 73.7548, category: 'nature', rating: 4.2, costEstimate: 0 },
      { id: 'go3', name: 'Dudhsagar Waterfalls', description: 'Four-tiered waterfall on the Mandovi River, looking like a sea of milk.', lat: 15.3185, lng: 74.3129, category: 'adventure', rating: 4.6, costEstimate: 400 },
      { id: 'go4', name: 'Anjuna Flea Market', description: 'Bustling beachside bazaar with spices, handicrafts, clothing, and food.', lat: 15.5794, lng: 73.7424, category: 'shopping', rating: 4.1, costEstimate: 50 }
    ],
    cuisines: ['Fish Curry Rice', 'Pork Vindaloo', 'Bebinca', 'Feni'],
    bestTime: 'November to February (Summer is hot, Monsoon is scenic but beaches are closed)',
    budgetEstimate: 'Moderate to Premium',
    safetyTips: [
      'Never drive a rented vehicle under the influence of alcohol.',
      'Do not go deep into the sea when red flags are raised by lifeguards.',
      'Negotiate cab fares beforehand as standard taxi meters are rarely used.'
    ],
    emergencyContacts: {
      police: '100',
      hospital: '0832-2458727 (Goa Medical College)',
      fire: '101'
    }
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    description: 'The city of dreams, home of Bollywood, colonial architecture, coastal drives, and dynamic street life.',
    lat: 19.0760,
    lng: 72.8777,
    attractions: [
      { id: 'mb1', name: 'Gateway of India', description: 'Famous basalt arch monument overlooking the Arabian Sea built in 1924.', lat: 18.9220, lng: 72.8347, category: 'history', rating: 4.6, costEstimate: 0 },
      { id: 'mb2', name: 'Marine Drive', description: 'C-shaped boulevard along the coastline, popularly called the Queens Necklace.', lat: 18.9430, lng: 72.8230, category: 'nature', rating: 4.7, costEstimate: 0 },
      { id: 'mb3', name: 'Chhatrapati Shivaji Terminus', description: 'UNESCO World Heritage railway station showcasing Victorian Gothic style.', lat: 18.9400, lng: 72.8354, category: 'history', rating: 4.5, costEstimate: 0 },
      { id: 'mb4', name: 'Elephanta Caves', description: 'Rock-cut cave temples dedicated to Shiva, located on an island off the harbor.', lat: 18.9633, lng: 72.9315, category: 'history', rating: 4.4, costEstimate: 200 }
    ],
    cuisines: ['Vada Pav', 'Pav Bhaji', 'Bhel Puri', 'Bombay Sandwich'],
    bestTime: 'October to March',
    budgetEstimate: 'Moderate to Luxury',
    safetyTips: [
      'Travel by local train outside rush hours (11:00 to 16:00) to avoid danger.',
      'Carry umbrellas and protective shoes during the monsoon (June to September).'
    ],
    emergencyContacts: {
      police: '100',
      hospital: '022-22620242 (St. George Hospital)',
      fire: '101'
    }
  },
  {
    id: 'delhi',
    name: 'Delhi',
    description: 'Capital of India, rich in mughal monuments, historical museums, shopping hubs, and diverse street food.',
    lat: 28.6139,
    lng: 77.2090,
    attractions: [
      { id: 'dl1', name: 'Red Fort', description: 'Mughal emperors main fortress residence, built of red sandstone in 1638.', lat: 28.6562, lng: 77.2410, category: 'history', rating: 4.5, costEstimate: 80 },
      { id: 'dl2', name: 'Qutub Minar', description: 'UNESCO heritage 73-meter towering minaret built of red sandstone and marble.', lat: 28.5244, lng: 77.1855, category: 'history', rating: 4.7, costEstimate: 50 },
      { id: 'dl3', name: 'India Gate', description: 'War memorial arch dedicated to soldiers of World War I, surrounded by lawns.', lat: 28.6129, lng: 77.2295, category: 'history', rating: 4.6, costEstimate: 0 },
      { id: 'dl4', name: 'Lotus Temple', description: 'Bahai House of Worship shaped like a blooming lotus flower, open to all.', lat: 28.5535, lng: 77.2588, category: 'spiritual', rating: 4.5, costEstimate: 0 }
    ],
    cuisines: ['Chole Bhature', 'Butter Chicken', 'Aloo Chaat', 'Paranthas of Gali Paranthe Wali'],
    bestTime: 'October to March (Winters are chilly but pleasant; summers are extremely hot)',
    budgetEstimate: 'Budget-friendly to Luxury',
    safetyTips: [
      'Use metro rail to travel swiftly and safely across the capital.',
      'Be cautious of scam tour operators around key train stations.',
      'Avoid unlit streets and areas late at night.'
    ],
    emergencyContacts: {
      police: '100',
      hospital: '011-26588500 (AIIMS Hospital)',
      fire: '101'
    }
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    description: 'The Pink City of Rajasthan, famed for majestic palaces, ancient astronomical observatories, and vibrant block prints.',
    lat: 26.9124,
    lng: 75.7873,
    attractions: [
      { id: 'jp1', name: 'Hawa Mahal', description: 'Palace of Winds with 953 small windows designed for royal women to observe street life.', lat: 26.9239, lng: 75.8267, category: 'history', rating: 4.6, costEstimate: 50 },
      { id: 'jp2', name: 'Amer Fort', description: 'Hilltop fort complex with majestic courtyards, mirror halls, and elephant rides.', lat: 26.9855, lng: 75.8513, category: 'history', rating: 4.8, costEstimate: 200 },
      { id: 'jp3', name: 'City Palace', description: 'Royal residence combining Rajput and Mughal design, containing museums.', lat: 26.9258, lng: 75.8236, category: 'history', rating: 4.5, costEstimate: 300 },
      { id: 'jp4', name: 'Jantar Mantar', description: 'UNESCO astronomical observatory housing the worlds largest stone sundial.', lat: 26.9248, lng: 75.8245, category: 'history', rating: 4.6, costEstimate: 50 }
    ],
    cuisines: ['Dal Baati Churma', 'Laal Maas', 'Ghevar', 'Pyaaz Kachori'],
    bestTime: 'October to March',
    budgetEstimate: 'Moderate to Premium',
    safetyTips: [
      'Hire official guides with identity cards to avoid overcharging scams.',
      'Beware of pushy souvenir vendors and street sellers near monuments.'
    ],
    emergencyContacts: {
      police: '100',
      hospital: '0141-2560291 (SMS Hospital)',
      fire: '101'
    }
  },
  {
    id: 'mysore',
    name: 'Mysore',
    description: 'Cultural capital of Karnataka, celebrated for imperial palaces, sandalwood carvings, and royal heritage.',
    lat: 12.2958,
    lng: 76.6394,
    attractions: [
      { id: 'my1', name: 'Mysore Palace', description: 'Stunning Indo-Saracenic palace illuminated by nearly 100,000 bulbs on Sundays.', lat: 12.3051, lng: 76.6551, category: 'history', rating: 4.8, costEstimate: 100 },
      { id: 'my2', name: 'Chamundi Hill & Temple', description: 'Ancient temple on top of a hill, guarded by a massive monolith Nandi statue.', lat: 12.2748, lng: 76.6784, category: 'spiritual', rating: 4.5, costEstimate: 20 },
      { id: 'my3', name: 'Brindavan Gardens', description: 'Beautiful terraced gardens famous for symmetric lawns and musical dancing fountains.', lat: 12.4222, lng: 76.5725, category: 'family', rating: 4.2, costEstimate: 50 },
      { id: 'my4', name: 'Mysore Zoo', description: 'One of the oldest and most popular zoological parks in India housing rare animals.', lat: 12.3023, lng: 76.6663, category: 'family', rating: 4.6, costEstimate: 100 }
    ],
    cuisines: ['Mysore Masala Dosa', 'Mysore Pak', 'Saffron Pulao', 'Sandalwood tea'],
    bestTime: 'October to March',
    budgetEstimate: 'Budget-friendly to Moderate',
    safetyTips: [
      'Sundays are extremely crowded at the Palace due to the illumination ceremony; plan entry early.',
      'Be cautious of fake sandalwood oils offered on streets.'
    ],
    emergencyContacts: {
      police: '100',
      hospital: '0821-2520855 (KR Hospital)',
      fire: '101'
    }
  },
  {
    id: 'kodaikanal',
    name: 'Kodaikanal',
    description: 'Princess of Hill Stations, offering misty pine forests, lakes, and trekking trails in Tamil Nadu.',
    lat: 10.2381,
    lng: 77.4892,
    attractions: [
      { id: 'kk1', name: 'Kodaikanal Lake', description: 'Man-made star-shaped lake where tourists can boat and cycle on peripheral paths.', lat: 10.2329, lng: 77.4855, category: 'nature', rating: 4.4, costEstimate: 100 },
      { id: 'kk2', name: 'Coakers Walk', description: 'Stunning paved pedestrian path offering scenic views of valleys and clouds.', lat: 10.2338, lng: 77.4947, category: 'nature', rating: 4.5, costEstimate: 20 },
      { id: 'kk3', name: 'Pillar Rocks', description: 'Three massive vertical granite rock boulders standing tall at 122 meters.', lat: 10.2036, lng: 77.4667, category: 'nature', rating: 4.3, costEstimate: 10 },
      { id: 'kk4', name: 'Pine Forest', description: 'Enchanting dense forest of tall pine trees, a popular photography location.', lat: 10.2185, lng: 77.4589, category: 'nature', rating: 4.5, costEstimate: 10 }
    ],
    cuisines: ['Hot Cocoa', 'Plums & Pears', 'Homemade Chocolates', 'Tibetan Dumplings'],
    bestTime: 'April to June and September to November',
    budgetEstimate: 'Moderate',
    safetyTips: [
      'Ghat roads are narrow; avoid driving yourself if you have no hills experience.',
      'Mist can envelope the viewpoints quickly; check weather forecasts before visiting Pillar Rocks.'
    ],
    emergencyContacts: {
      police: '100',
      hospital: '04542-240212 (Government Hospital)',
      fire: '101'
    }
  }
];

export function getDestinationById(id: string): Destination | undefined {
  return DESTINATIONS.find(d => d.id === id.toLowerCase());
}

export function searchDestinations(query: string): Destination[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return DESTINATIONS;
  return DESTINATIONS.filter(
    d => d.name.toLowerCase().includes(clean) || d.description.toLowerCase().includes(clean)
  );
}
