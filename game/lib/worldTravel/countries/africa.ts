import type { Country } from '../types';

const southAfrica: Country = {
  id: 'za',
  name: 'South Africa',
  localName: 'South Africa',
  flag: '\u{1F1FF}\u{1F1E6}',
  region: 'africa',
  greeting: 'Sawubona',
  culturalValue: 'Ubuntu (Community Spirit)',
  description:
    'The Rainbow Nation, united by Ubuntu \u2014 the belief that we are all connected.',
  quests: [
    {
      id: 'za-q1',
      countryId: 'za',
      type: 'cultural_scenario',
      difficulty: 'easy',
      title: 'The Spirit of Ubuntu',
      points: 50,
      data: {
        type: 'cultural_scenario',
        culturalValue: 'Ubuntu (I am because we are)',
        situation:
          'Your colleague forgot their lunch at the office. They look hungry and the nearest shop is far away.',
        options: {
          left: {
            text: 'Share your food with them and eat together',
            isKind: true,
          },
          right: {
            text: 'Eat your own lunch alone at your desk',
            isKind: false,
          },
        },
        explanation:
          'Ubuntu is a Nguni Bantu philosophy meaning "I am because we are." It emphasizes that our humanity is tied to how we treat others. Sharing a meal embodies this belief \u2014 your well-being is connected to the well-being of those around you.',
      },
    },
    {
      id: 'za-q2',
      countryId: 'za',
      type: 'trivia_quiz',
      difficulty: 'medium',
      title: 'Rainbow Nation Trivia',
      points: 80,
      data: {
        type: 'trivia_quiz',
        question:
          'South Africa is known for its rich cultural diversity. Which of the following is TRUE about the country?',
        choices: [
          'South Africa has 11 official languages',
          'Table Mountain is located in Johannesburg',
          'A braai is a traditional South African dance',
          'Nelson Mandela was the last president of South Africa',
        ],
        correctIndex: 0,
        explanation:
          'South Africa recognizes 11 official languages, reflecting its incredible diversity. Table Mountain is actually in Cape Town, a braai is a beloved barbecue tradition (not a dance), and Nelson Mandela was the first democratically elected president, not the last.',
      },
    },
    {
      id: 'za-q3',
      countryId: 'za',
      type: 'history_lesson',
      difficulty: 'hard',
      title: 'Madiba and the Rainbow Nation',
      points: 120,
      data: {
        type: 'history_lesson',
        story:
          'Nelson Mandela, affectionately known as Madiba, spent 27 years in prison for fighting against apartheid \u2014 a system of racial segregation in South Africa. After his release in 1990, instead of seeking revenge, he chose reconciliation. In 1994, he became South Africa\'s first Black president and worked to unite a deeply divided nation. His message was simple: forgiveness and Ubuntu can heal even the deepest wounds.',
        question:
          'After being released from 27 years in prison, what approach did Nelson Mandela choose?',
        choices: [
          'He left South Africa to live abroad',
          'He chose reconciliation and forgiveness over revenge',
          'He retired from public life immediately',
          'He focused only on economic reform',
        ],
        correctIndex: 1,
        funFact:
          'During the 1995 Rugby World Cup, Mandela wore the Springbok jersey \u2014 a symbol previously associated with apartheid \u2014 to support the national team. This powerful gesture helped unite Black and white South Africans through sport.',
      },
    },
  ],
};

const kenya: Country = {
  id: 'ke',
  name: 'Kenya',
  localName: 'Kenya',
  flag: '\u{1F1F0}\u{1F1EA}',
  region: 'africa',
  greeting: 'Habari',
  culturalValue: 'Harambee (Pulling Together)',
  description:
    'A land of breathtaking wildlife, resilient people, and the spirit of Harambee.',
  quests: [
    {
      id: 'ke-q1',
      countryId: 'ke',
      type: 'cultural_scenario',
      difficulty: 'easy',
      title: 'Kenyan Hospitality',
      points: 50,
      data: {
        type: 'cultural_scenario',
        culturalValue: 'Harambee (Pulling Together)',
        situation:
          'A weary traveler arrives at your village looking thirsty and tired after a long journey. They ask if there is somewhere nearby they can get water.',
        options: {
          left: {
            text: 'Invite them in, offer water and food, and let them rest',
            isKind: true,
          },
          right: {
            text: 'Tell them to find a shop in the next town',
            isKind: false,
          },
        },
        explanation:
          'In Kenyan culture, hospitality to travelers is a deeply held value. The concept of Harambee \u2014 meaning "pulling together" \u2014 reflects the communal spirit where people support one another, especially strangers in need. Offering food and water to a traveler is considered a natural act of kindness.',
      },
    },
    {
      id: 'ke-q2',
      countryId: 'ke',
      type: 'trivia_quiz',
      difficulty: 'medium',
      title: 'Heart of East Africa',
      points: 80,
      data: {
        type: 'trivia_quiz',
        question:
          'Kenya is famous worldwide for many things. Which of the following is TRUE about Kenya?',
        choices: [
          'The Maasai are a nomadic people known for their warrior traditions',
          'Mount Kenya is the tallest mountain in Africa',
          'Safari is a Japanese word meaning "journey"',
          'Kenya has never produced any Olympic champions',
        ],
        correctIndex: 0,
        explanation:
          'The Maasai are indeed a semi-nomadic people renowned for their distinctive customs and warrior culture. Mount Kenya is the second tallest in Africa (after Kilimanjaro). "Safari" is actually a Swahili word meaning "journey." Kenya is legendary for its marathon runners and has won numerous Olympic medals.',
      },
    },
    {
      id: 'ke-q3',
      countryId: 'ke',
      type: 'cultural_practice',
      difficulty: 'hard',
      title: 'Kenyan Greeting Customs',
      points: 120,
      data: {
        type: 'cultural_practice',
        instruction:
          'In Kenya, greeting elders is an important sign of respect. Learn the traditional Kenyan handshake and greeting etiquette by following these steps.',
        steps: [
          'Approach the elder and make eye contact with a warm smile',
          'Say "Shikamoo" (a respectful Swahili greeting for elders)',
          'Extend your right hand for a handshake while placing your left hand on your right forearm as a sign of respect',
          'Wait for the elder to initiate or release the handshake \u2014 never rush',
          'Listen attentively as they respond with "Marahaba" (the elder\'s reply)',
        ],
        tapsRequired: 5,
        completionMessage:
          'Wonderful! You have learned the respectful Kenyan greeting. In Kenyan culture, greeting elders properly shows that you honor their wisdom and place in the community. This simple act strengthens the bonds of Harambee.',
      },
    },
  ],
};

export const AFRICA_COUNTRIES: Country[] = [southAfrica, kenya];
