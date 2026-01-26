import type { Country } from '../types';

// ============ France ============

const france: Country = {
  id: 'fr',
  name: 'France',
  localName: 'France',
  flag: '\u{1F1EB}\u{1F1F7}',
  region: 'europe',
  greeting: 'Bonjour',
  culturalValue: 'Politesse (Politeness)',
  description: 'The land of art, cuisine, and refined social etiquette.',
  quests: [
    {
      id: 'fr-q1',
      countryId: 'fr',
      type: 'cultural_scenario',
      difficulty: 'easy',
      title: 'Bonjour at the Bakery',
      points: 50,
      data: {
        type: 'cultural_scenario',
        culturalValue: 'Politesse (Politeness)',
        situation:
          'You enter a small bakery in a Parisian neighborhood. The shopkeeper is arranging fresh croissants behind the counter.',
        options: {
          left: {
            text: 'Walk straight in and start browsing the items without saying a word.',
            isKind: false,
          },
          right: {
            text: 'Greet the shopkeeper with a warm "Bonjour" before looking at the pastries.',
            isKind: true,
          },
        },
        explanation:
          'In France, saying "Bonjour" when entering any shop is not just polite — it is essential. Skipping the greeting is considered very rude. The French view this simple word as a sign of respect and acknowledgment of the other person. Always greet first, then proceed with your business.',
      },
    },
    {
      id: 'fr-q2',
      countryId: 'fr',
      type: 'trivia_quiz',
      difficulty: 'medium',
      title: 'French Culture Quiz',
      points: 80,
      data: {
        type: 'trivia_quiz',
        question:
          'France is famous for its baguettes, the Eiffel Tower, and hundreds of cheese varieties. How many different types of cheese does France traditionally produce?',
        choices: [
          'Around 100',
          'Around 400',
          'Around 50',
          'Around 1,000',
        ],
        correctIndex: 1,
        explanation:
          'France is renowned for producing around 400 distinct types of cheese, a fact famously referenced by Charles de Gaulle who asked, "How can you govern a country which has 246 varieties of cheese?" The actual number has grown even larger over the centuries. French cheese culture is deeply tied to regional identity, with each area boasting its own specialty.',
      },
    },
    {
      id: 'fr-q3',
      countryId: 'fr',
      type: 'history_lesson',
      difficulty: 'hard',
      title: 'The French Revolution',
      points: 120,
      data: {
        type: 'history_lesson',
        story:
          'In 1789, France underwent one of the most transformative revolutions in world history. Fueled by widespread inequality, crushing taxes on the poor, and the extravagant lifestyle of the monarchy, the people of France rose up to demand change. The revolution dismantled the centuries-old feudal system and established the principles of modern democracy. Its rallying cry became one of the most famous mottos in history.',
        question:
          'What is the famous motto of the French Revolution that remains the national motto of France to this day?',
        choices: [
          'Unité, Force, Progrès',
          'Liberté, Égalité, Fraternité',
          'Honneur, Patrie, Valeur',
          'Justice, Paix, Travail',
        ],
        correctIndex: 1,
        funFact:
          '"Liberté, Égalité, Fraternité" (Liberty, Equality, Fraternity) was first proposed during the Revolution in 1789 and was officially adopted as the national motto in 1848. Today, you can find it inscribed on public buildings, coins, and stamps throughout France. It represents the universal ideals of freedom, equal rights, and brotherhood that the revolution sought to establish.',
      },
    },
  ],
};

// ============ United Kingdom ============

const uk: Country = {
  id: 'gb',
  name: 'United Kingdom',
  localName: 'United Kingdom',
  flag: '\u{1F1EC}\u{1F1E7}',
  region: 'europe',
  greeting: 'Hello',
  culturalValue: 'Fair Play',
  description: 'A nation of tradition, politeness, and the art of queuing.',
  quests: [
    {
      id: 'gb-q1',
      countryId: 'gb',
      type: 'cultural_scenario',
      difficulty: 'easy',
      title: 'The British Queue',
      points: 50,
      data: {
        type: 'cultural_scenario',
        culturalValue: 'Fair Play',
        situation:
          'You arrive at a busy bus stop in London. There is a long line of people waiting patiently for the next bus.',
        options: {
          left: {
            text: 'Push your way to the front of the line so you can board first.',
            isKind: false,
          },
          right: {
            text: 'Join the end of the queue and wait patiently for your turn.',
            isKind: true,
          },
        },
        explanation:
          'Queuing is considered sacred in British culture. It reflects the core value of fair play — the belief that everyone deserves equal treatment and should wait their turn. Cutting in line is one of the quickest ways to draw disapproval in the UK. The British take great pride in their orderly queues, and respecting the queue is a sign of good manners and social awareness.',
      },
    },
    {
      id: 'gb-q2',
      countryId: 'gb',
      type: 'trivia_quiz',
      difficulty: 'medium',
      title: 'British Culture Quiz',
      points: 80,
      data: {
        type: 'trivia_quiz',
        question:
          'The British are famous for afternoon tea, Big Ben, football, and the Royal Family. What time is traditionally associated with British afternoon tea?',
        choices: [
          '2:00 PM',
          '4:00 PM',
          '5:00 PM',
          '3:00 PM',
        ],
        correctIndex: 1,
        explanation:
          'Traditional British afternoon tea is served around 4:00 PM. It was popularized in the 1840s by Anna, the Duchess of Bedford, who felt hungry between lunch and the late dinner typical of the era. She began requesting a tray of tea, bread, butter, and cake in her private quarters. The custom soon spread among the upper classes and eventually became a beloved British tradition enjoyed by people of all backgrounds.',
      },
    },
    {
      id: 'gb-q3',
      countryId: 'gb',
      type: 'cultural_practice',
      difficulty: 'hard',
      title: 'Proper Afternoon Tea Etiquette',
      points: 120,
      data: {
        type: 'cultural_practice',
        instruction:
          'Learn the proper steps for enjoying a traditional British afternoon tea. Follow each step carefully to master this cherished custom.',
        steps: [
          'Place the napkin on your lap before anything is served.',
          'Pour the tea into the cup first, then add milk if desired — never the other way around (according to tradition).',
          'Stir the tea gently back and forth — never in circles — and place the spoon on the saucer, not in the cup.',
          'Hold the teacup by the handle with your thumb and index finger. Do not extend your pinky.',
          'Eat the scone by breaking it with your hands (not cutting with a knife), then add clotted cream and jam to each piece.',
          'Follow the traditional order: sandwiches first, then scones, then pastries and cakes.',
        ],
        tapsRequired: 6,
        completionMessage:
          'Splendid! You have mastered the art of British afternoon tea. Remember, afternoon tea is not just about the food — it is about taking a moment to slow down, enjoy good company, and appreciate the finer things in life. Cheers!',
      },
    },
  ],
};

// ============ Germany ============

const germany: Country = {
  id: 'de',
  name: 'Germany',
  localName: 'Deutschland',
  flag: '\u{1F1E9}\u{1F1EA}',
  region: 'europe',
  greeting: 'Hallo',
  culturalValue: 'P\u00FCnktlichkeit (Punctuality)',
  description:
    'Known for precision, efficiency, and a deep respect for order and community.',
  quests: [
    {
      id: 'de-q1',
      countryId: 'de',
      type: 'cultural_scenario',
      difficulty: 'easy',
      title: 'Dinner at Seven',
      points: 50,
      data: {
        type: 'cultural_scenario',
        culturalValue: 'P\u00FCnktlichkeit (Punctuality)',
        situation:
          'You have been invited to a dinner at a German friend\'s home. The invitation says 7:00 PM.',
        options: {
          left: {
            text: 'Arrive at 7:15 PM, thinking a few minutes late is no big deal.',
            isKind: false,
          },
          right: {
            text: 'Arrive at 6:55 PM, so you are ready right at 7:00 PM.',
            isKind: true,
          },
        },
        explanation:
          'In Germany, punctuality (P\u00FCnktlichkeit) is a deeply held value and a sign of respect. Arriving late — even by just a few minutes — is considered rude, as it implies you do not value the other person\'s time. Germans often plan their schedules with precision, and being on time (or a few minutes early) shows reliability and consideration. The saying "F\u00FCnf Minuten vor der Zeit ist des Deutschen P\u00FCnktlichkeit" (Five minutes before the time is German punctuality) captures this perfectly.',
      },
    },
    {
      id: 'de-q2',
      countryId: 'de',
      type: 'trivia_quiz',
      difficulty: 'medium',
      title: 'German Culture Quiz',
      points: 80,
      data: {
        type: 'trivia_quiz',
        question:
          'Germany is famous for Oktoberfest, the autobahn, an incredible variety of bread, and its commitment to recycling. Approximately how many types of bread are baked in Germany?',
        choices: [
          'Around 100',
          'Around 300',
          'Around 1,000',
          'Over 3,000',
        ],
        correctIndex: 3,
        explanation:
          'Germany has over 3,000 officially registered types of bread, making it the country with the greatest bread diversity in the world. German bread culture is so significant that it was added to the UNESCO Intangible Cultural Heritage list. From dark rye Pumpernickel to crusty Brötchen, bread is a central part of German daily life, with many families enjoying "Abendbrot" (evening bread) as their dinner.',
      },
    },
    {
      id: 'de-q3',
      countryId: 'de',
      type: 'history_lesson',
      difficulty: 'hard',
      title: 'The Fall of the Berlin Wall',
      points: 120,
      data: {
        type: 'history_lesson',
        story:
          'For 28 years, the Berlin Wall divided not just a city, but families, friends, and an entire nation. Built in 1961 by the East German government to prevent citizens from fleeing to the West, the Wall became the most powerful symbol of the Cold War. On the evening of November 9, 1989, after weeks of growing protests and political upheaval, an East German spokesperson mistakenly announced that the border was open "immediately, without delay." Thousands of jubilant Berliners flooded the checkpoints, and people from both sides began tearing down the Wall with hammers and picks. Strangers embraced, families were reunited, and the world watched in awe.',
        question:
          'In what year did East and West Germany officially reunify as one nation following the fall of the Berlin Wall?',
        choices: [
          '1989',
          '1990',
          '1991',
          '1992',
        ],
        correctIndex: 1,
        funFact:
          'Although the Berlin Wall fell on November 9, 1989, German reunification did not become official until October 3, 1990 — now celebrated annually as "Tag der Deutschen Einheit" (German Unity Day). On that day, East Germany formally joined the Federal Republic of Germany. Today, small sections of the Wall remain as memorials, including the famous East Side Gallery — a 1.3 km stretch covered in murals by artists from around the world, symbolizing hope and freedom.',
      },
    },
  ],
};

// ============ Export ============

export const EUROPE_COUNTRIES: Country[] = [france, uk, germany];
