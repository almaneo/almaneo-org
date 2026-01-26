import type { Country } from '../types';

const india: Country = {
  id: 'in',
  name: 'India',
  localName: '\u092D\u093E\u0930\u0924',
  flag: '\uD83C\uDDEE\uD83C\uDDF3',
  region: 'south_asia',
  greeting: 'Namaste',
  culturalValue: 'Namaste (Respect)',
  description:
    'A land of diverse cultures, ancient traditions, and warm hospitality.',
  quests: [
    {
      id: 'in-q1',
      countryId: 'in',
      type: 'cultural_scenario',
      difficulty: 'easy',
      title: 'The Namaste Greeting',
      points: 50,
      data: {
        type: 'cultural_scenario',
        culturalValue: 'Respect for elders',
        situation:
          'You are visiting a family in India and meeting a respected elder for the first time. How do you greet them?',
        options: {
          left: {
            text: 'Offer a firm handshake and introduce yourself casually.',
            isKind: false,
          },
          right: {
            text: 'Join your palms together, bow slightly, and say "Namaste" to show respect.',
            isKind: true,
          },
        },
        explanation:
          'In Indian culture, the Namaste greeting — pressing your palms together and bowing — is a sign of deep respect, especially toward elders. It means "I bow to the divine in you" and conveys humility and warmth.',
      },
    },
    {
      id: 'in-q2',
      countryId: 'in',
      type: 'trivia_quiz',
      difficulty: 'medium',
      title: 'Discover India',
      points: 80,
      data: {
        type: 'trivia_quiz',
        question:
          'India is famous for many things. Which of the following is the festival of lights celebrated across the country?',
        choices: ['Holi', 'Diwali', 'Pongal', 'Navratri'],
        correctIndex: 1,
        explanation:
          'Diwali, the festival of lights, is one of India\'s most beloved celebrations. Families light oil lamps (diyas), share sweets, set off fireworks, and celebrate the victory of light over darkness. India is also world-renowned for its spices, Bollywood cinema, and the ancient practice of yoga.',
      },
    },
    {
      id: 'in-q3',
      countryId: 'in',
      type: 'history_lesson',
      difficulty: 'hard',
      title: 'The Story of Diwali',
      points: 120,
      data: {
        type: 'history_lesson',
        story:
          'Diwali, meaning "row of lights," is a five-day festival celebrated by millions across India and the world. Its origins trace back thousands of years to ancient Hindu texts. The most popular legend tells of Lord Rama\'s return to the kingdom of Ayodhya after 14 years of exile and his victory over the demon king Ravana. The people of Ayodhya lit rows of clay oil lamps to guide Rama home and to celebrate the triumph of good over evil. Today, families clean and decorate their homes, wear new clothes, exchange gifts, prepare festive sweets, and light countless diyas. Diwali reminds us that even in the darkest times, light and goodness will always prevail.',
        question:
          'According to the most popular legend, why did the people of Ayodhya light oil lamps during the first Diwali?',
        choices: [
          'To scare away evil spirits from the village',
          'To welcome Lord Rama home after his exile and victory',
          'To celebrate the start of a new harvest season',
          'To honor the sun god during the winter solstice',
        ],
        correctIndex: 1,
        funFact:
          'During Diwali, it is estimated that over 1 billion clay oil lamps (diyas) are lit across India. Satellite images from space can actually capture the increased lights over the Indian subcontinent during the festival!',
      },
    },
  ],
};

export const SOUTH_ASIA_COUNTRIES: Country[] = [india];
