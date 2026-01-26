import type { Country } from '../types';

const turkey: Country = {
  id: 'tr',
  name: 'Turkey',
  localName: 'T\u00FCrkiye',
  flag: '\uD83C\uDDF9\uD83C\uDDF7',
  region: 'middle_east',
  greeting: 'Merhaba',
  culturalValue: 'Hospitality (Misafirperverlik)',
  description:
    'Where East meets West, famous for legendary hospitality and rich heritage.',
  quests: [
    {
      id: 'tr-q1',
      countryId: 'tr',
      type: 'cultural_scenario',
      difficulty: 'easy',
      title: 'Turkish Hospitality',
      points: 50,
      data: {
        type: 'cultural_scenario',
        culturalValue: 'Hospitality',
        situation:
          'A guest has arrived at your home in Turkey for the first time. How do you welcome them?',
        options: {
          left: {
            text: 'Warmly invite them in, offer Turkish tea and homemade treats, and make them feel at home.',
            isKind: true,
          },
          right: {
            text: 'Ask them what they need and get straight to business without offering refreshments.',
            isKind: false,
          },
        },
        explanation:
          'In Turkish culture, hospitality (misafirperverlik) is sacred. A guest is considered "a gift from God" (Tanr\u0131 misafiri). Offering tea, food, and a warm welcome is not just polite \u2014 it is a deeply rooted tradition that reflects generosity and respect.',
      },
    },
    {
      id: 'tr-q2',
      countryId: 'tr',
      type: 'trivia_quiz',
      difficulty: 'medium',
      title: 'Discover Turkey',
      points: 80,
      data: {
        type: 'trivia_quiz',
        question:
          'Turkey is known for many cultural treasures. Which of these is a famous Turkish confection enjoyed worldwide?',
        choices: [
          'Mochi',
          'Turkish Delight (Lokum)',
          'Baklava Cake',
          'Churros',
        ],
        correctIndex: 1,
        explanation:
          'Turkish Delight (lokum) is a centuries-old confection made from starch and sugar, often flavored with rosewater or lemon and dusted with powdered sugar. Turkey is also famous for its Grand Bazaar in Istanbul, traditional hammam (Turkish baths), and the tulip \u2014 which was originally cultivated in the Ottoman Empire before being exported to the Netherlands.',
      },
    },
    {
      id: 'tr-q3',
      countryId: 'tr',
      type: 'cultural_practice',
      difficulty: 'hard',
      title: 'The Turkish Tea Ceremony',
      points: 120,
      data: {
        type: 'cultural_practice',
        instruction:
          'Learn the art of Turkish tea service! Tea (\u00E7ay) is the heartbeat of Turkish social life. Follow the traditional steps to prepare and serve tea the Turkish way.',
        steps: [
          'Fill the bottom kettle of the double teapot (\u00E7aydanl\u0131k) with water and bring it to a boil.',
          'Add loose black tea leaves to the top pot and pour boiling water over them to brew a strong concentrate.',
          'Let the tea steep for 10-15 minutes on low heat while chatting with your guest.',
          'Pour the dark concentrate into a tulip-shaped glass, filling it about one-third full.',
          'Top off with hot water from the bottom kettle to reach the desired strength \u2014 dark (koyu) or light (a\u00E7\u0131k).',
          'Serve on a small saucer with two sugar cubes and always offer a refill \u2014 an empty glass is quickly noticed!',
        ],
        tapsRequired: 12,
        completionMessage:
          'Wonderful! You have mastered the Turkish tea ceremony. In Turkey, refusing tea is almost unthinkable \u2014 it is a symbol of friendship and connection. \u00C7ay i\u00E7elim! (Let\'s drink tea!)',
      },
    },
  ],
};

const uae: Country = {
  id: 'ae',
  name: 'UAE',
  localName: '\u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062A',
  flag: '\uD83C\uDDE6\uD83C\uDDEA',
  region: 'middle_east',
  greeting: 'As-salamu alaykum',
  culturalValue: 'Generosity (Karama)',
  description:
    'A modern oasis blending ancient Bedouin traditions with futuristic vision.',
  quests: [
    {
      id: 'ae-q1',
      countryId: 'ae',
      type: 'cultural_scenario',
      difficulty: 'easy',
      title: 'Emirati Customs',
      points: 50,
      data: {
        type: 'cultural_scenario',
        culturalValue: 'Respect for customs',
        situation:
          'You are meeting an Emirati business partner for the first time. They extend their right hand for a greeting. How do you respond?',
        options: {
          left: {
            text: 'Reach out with your left hand since it is closer.',
            isKind: false,
          },
          right: {
            text: 'Accept with your right hand, place your left hand over your heart as a sign of respect, and greet them with "As-salamu alaykum."',
            isKind: true,
          },
        },
        explanation:
          'In Emirati and broader Arab culture, the right hand is used for greetings, eating, and giving gifts. The left hand is considered unclean. Placing your hand over your heart after a handshake shows sincerity and respect. "As-salamu alaykum" (peace be upon you) is the traditional greeting.',
      },
    },
    {
      id: 'ae-q2',
      countryId: 'ae',
      type: 'trivia_quiz',
      difficulty: 'medium',
      title: 'Discover the UAE',
      points: 80,
      data: {
        type: 'trivia_quiz',
        question:
          'The UAE is known for its blend of tradition and modernity. Which of the following is a traditional Emirati practice that is still celebrated as a national heritage sport?',
        choices: [
          'Surfing competitions',
          'Falconry',
          'Ice hockey',
          'Mountain biking',
        ],
        correctIndex: 1,
        explanation:
          'Falconry has been practiced in the Arabian Peninsula for over 2,000 years and is recognized by UNESCO as Intangible Cultural Heritage. The UAE is also home to the Burj Khalifa (the world\'s tallest building), has a deep tradition of offering dates and Arabic coffee (gahwa) to guests, and hosts one of the world\'s most valued falcon beauty contests.',
      },
    },
    {
      id: 'ae-q3',
      countryId: 'ae',
      type: 'history_lesson',
      difficulty: 'hard',
      title: 'The Birth of a Nation',
      points: 120,
      data: {
        type: 'history_lesson',
        story:
          'The United Arab Emirates was formed on December 2, 1971, when six Trucial States \u2014 Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, and Fujairah \u2014 united under one flag. Ras Al Khaimah joined shortly after in 1972. Before the discovery of oil in the 1950s, the region\'s people were primarily Bedouin nomads, pearl divers, and traders. The Bedouin way of life was defined by values of generosity, loyalty, and resilience in the harsh desert environment. Sharing food and water with strangers was not just custom \u2014 it was survival. Sheikh Zayed bin Sultan Al Nahyan, the founding father, envisioned transforming the nation while preserving these core Bedouin values. Today, the UAE stands as one of the most cosmopolitan nations on Earth, home to over 200 nationalities, yet its people still honor the traditions of their ancestors.',
        question:
          'How many Trucial States originally united to form the UAE on December 2, 1971?',
        choices: ['Four', 'Five', 'Six', 'Seven'],
        correctIndex: 2,
        funFact:
          'The Bedouin tradition of hospitality lives on in the UAE today. When you visit an Emirati home, you will be offered Arabic coffee (gahwa) and dates \u2014 a ritual unchanged for centuries. It is customary to accept at least one cup, and your host will keep pouring until you gently shake your cup to signal you have had enough!',
      },
    },
  ],
};

export const MIDDLE_EAST_COUNTRIES: Country[] = [turkey, uae];
