/**
 * Americas Countries - USA, Canada, Brazil, Mexico
 * Cultural quests celebrating Small Talk, Politeness, Abraco, and Familia
 */

import type { Country } from '../types';

// ============ USA ============

const usa: Country = {
  id: 'us',
  name: 'USA',
  localName: 'United States',
  flag: '\u{1F1FA}\u{1F1F8}',
  region: 'americas',
  greeting: 'Hey there!',
  culturalValue: 'Small Talk (Friendliness)',
  description:
    'A melting pot of cultures where a friendly smile can brighten anyone\'s day.',
  quests: [
    {
      id: 'us-q1',
      countryId: 'us',
      type: 'cultural_scenario',
      difficulty: 'easy',
      title: 'The Power of Small Talk',
      points: 50,
      data: {
        type: 'cultural_scenario',
        culturalValue: 'Small Talk (Friendliness)',
        situation:
          'You step into an elevator and make eye contact with a stranger. There is a brief moment of silence. In many American settings, a bit of casual friendliness can go a long way toward making everyday interactions warmer.',
        options: {
          left: {
            text: 'Look down at the floor awkwardly and pretend to check your phone until the doors open.',
            isKind: false,
          },
          right: {
            text: 'Smile and say "Hi, how\'s your day going?" to break the silence with a little warmth.',
            isKind: true,
          },
        },
        explanation:
          'In American culture, casual friendliness and small talk are deeply valued as a way to acknowledge others and create a sense of community, even among strangers. A simple "How\'s your day?" in an elevator, grocery store, or coffee shop is not considered intrusive — it is a genuine expression of openness. This culture of approachable warmth helps people feel seen and welcome, no matter where they come from.',
      },
    },
    {
      id: 'us-q2',
      countryId: 'us',
      type: 'trivia_quiz',
      difficulty: 'medium',
      title: 'American Culture Quiz',
      points: 80,
      data: {
        type: 'trivia_quiz',
        question:
          'Tipping is a significant part of American dining culture. What is the standard tip percentage for good service at a sit-down restaurant in the United States?',
        choices: [
          '5-10%',
          '15-20%',
          '25-30%',
          'Tipping is not customary in the US',
        ],
        correctIndex: 1,
        explanation:
          'In the United States, tipping 15-20% of the pre-tax bill is the standard for sit-down restaurant service. This practice exists because servers often earn a lower base wage and rely on tips as a major part of their income. Tipping culture extends to bartenders, hairdressers, taxi drivers, and hotel staff. While the system is debated, leaving a generous tip is widely seen as a way to show appreciation and kindness for someone\'s hard work.',
      },
    },
    {
      id: 'us-q3',
      countryId: 'us',
      type: 'history_lesson',
      difficulty: 'hard',
      title: 'Thanksgiving and the Spirit of Gratitude',
      points: 120,
      data: {
        type: 'history_lesson',
        story:
          'Thanksgiving is one of the most cherished holidays in the United States, celebrated on the fourth Thursday of November. Its origins trace back to 1621, when the Pilgrims — English settlers who arrived on the Mayflower — held a harvest feast at Plymouth, Massachusetts.\n\nAfter a devastating first winter in which nearly half the colonists perished, the Wampanoag people, led by Massasoit, taught the settlers essential survival skills: how to cultivate corn, catch fish, and tap maple trees. When autumn brought a bountiful harvest, Governor William Bradford organized a three-day feast to give thanks, inviting the Wampanoag allies who had been so vital to their survival.\n\nToday, Thanksgiving is a time for families to gather around a table laden with turkey, stuffing, cranberry sauce, and pumpkin pie. But beyond the food, the holiday represents a tradition of pausing to express gratitude — for the people in our lives, for community, and for the kindness of those who help us through difficult times.',
        question:
          'Which indigenous people helped the Pilgrims survive and were invited to the first Thanksgiving feast?',
        choices: [
          'The Cherokee',
          'The Wampanoag',
          'The Navajo',
          'The Sioux',
        ],
        correctIndex: 1,
        funFact:
          'Every Thanksgiving, the President of the United States "pardons" a turkey in a lighthearted ceremony at the White House, sparing it from becoming dinner. The pardoned turkey is sent to live out its days on a farm. Also, Americans consume roughly 46 million turkeys on Thanksgiving Day alone! The tradition of expressing what you are thankful for before the meal is a beloved part of the holiday that reminds everyone to appreciate the kindness and love in their lives.',
      },
    },
  ],
};

// ============ CANADA ============

const canada: Country = {
  id: 'ca',
  name: 'Canada',
  localName: 'Canada',
  flag: '\u{1F1E8}\u{1F1E6}',
  region: 'americas',
  greeting: 'Hello, eh!',
  culturalValue: 'Politeness & Inclusivity',
  description:
    'Known worldwide for kindness, multiculturalism, and saying sorry — even when it\'s not their fault.',
  quests: [
    {
      id: 'ca-q1',
      countryId: 'ca',
      type: 'cultural_scenario',
      difficulty: 'easy',
      title: 'The Famous Canadian Sorry',
      points: 50,
      data: {
        type: 'cultural_scenario',
        culturalValue: 'Politeness & Apology',
        situation:
          'You are walking down a busy sidewalk in Toronto when someone accidentally bumps into you, nearly knocking the coffee out of your hand. It was clearly their fault, but in Canada, politeness runs so deep that the response might surprise you.',
        options: {
          left: {
            text: 'Immediately say "Oh, sorry!" with a warm smile, even though it was not your fault at all. Check if the other person is okay.',
            isKind: true,
          },
          right: {
            text: 'Glare at them and mutter under your breath about people not watching where they are going.',
            isKind: false,
          },
        },
        explanation:
          'The famous Canadian "sorry" is more than just an apology — it is a deeply ingrained cultural reflex that reflects empathy, consideration, and a desire to maintain social harmony. Canadians are so well-known for apologizing that the province of Ontario actually passed the "Apology Act" in 2009, which states that saying sorry cannot be used as an admission of legal fault. This culture of reflexive politeness creates a society where people prioritize each other\'s comfort and feelings.',
      },
    },
    {
      id: 'ca-q2',
      countryId: 'ca',
      type: 'trivia_quiz',
      difficulty: 'medium',
      title: 'Canadian Culture Quiz',
      points: 80,
      data: {
        type: 'trivia_quiz',
        question:
          'Canada produces roughly 70% of the world\'s supply of a beloved sweet product. Which product is it?',
        choices: [
          'Honey',
          'Chocolate',
          'Maple syrup',
          'Cane sugar',
        ],
        correctIndex: 2,
        explanation:
          'Canada, particularly the province of Quebec, produces approximately 70% of the world\'s maple syrup. The annual maple harvest, known as "sugaring off," is a cherished tradition where families visit sugar shacks (cabanes a sucre) to enjoy fresh syrup poured over snow (tire sur la neige). Hockey, poutine (fries with cheese curds and gravy), and a deep commitment to multiculturalism are also iconic parts of Canadian identity. Canada was the first country to adopt multiculturalism as an official policy in 1971.',
      },
    },
    {
      id: 'ca-q3',
      countryId: 'ca',
      type: 'cultural_practice',
      difficulty: 'medium',
      title: 'Indigenous Land Acknowledgment',
      points: 80,
      data: {
        type: 'cultural_practice',
        instruction:
          'In Canada, it is a meaningful and increasingly common practice to begin public events, meetings, and ceremonies with an Indigenous land acknowledgment. This practice honors the First Nations, Inuit, and Metis peoples who have cared for these lands since time immemorial. Let\'s learn how to offer a respectful land acknowledgment.',
        steps: [
          'Research the specific Indigenous territory where you are located. Websites like native-land.ca can help you identify the traditional lands.',
          'Learn the correct names and pronunciations of the Indigenous nations associated with that territory.',
          'Begin with: "We acknowledge that we are gathered on the traditional territory of [Nation name]."',
          'Express gratitude: "We are grateful for the opportunity to live, work, and learn on these lands."',
          'Recognize ongoing stewardship: "We honor the enduring presence of Indigenous peoples and their continued care of these lands and waters."',
          'Commit to action: Reflect on what reconciliation means to you and how you can support Indigenous communities through learning and allyship.',
        ],
        tapsRequired: 6,
        completionMessage:
          'Wonderful! You have learned how to offer a respectful Indigenous land acknowledgment. In Canada, this practice is a small but powerful act of reconciliation — recognizing the history, rights, and ongoing contributions of Indigenous peoples. It is embraced at schools, universities, government events, and workplaces across the country as a step toward healing and building genuine respect between all communities.',
      },
    },
  ],
};

// ============ BRAZIL ============

const brazil: Country = {
  id: 'br',
  name: 'Brazil',
  localName: 'Brasil',
  flag: '\u{1F1E7}\u{1F1F7}',
  region: 'americas',
  greeting: 'Oi!',
  culturalValue: 'Abra\u00e7o (Warm Embrace)',
  description:
    'The land of samba, Carnival, and embracing life — and each other — with open arms.',
  quests: [
    {
      id: 'br-q1',
      countryId: 'br',
      type: 'cultural_scenario',
      difficulty: 'easy',
      title: 'The Warmth of the Abra\u00e7o',
      points: 50,
      data: {
        type: 'cultural_scenario',
        culturalValue: 'Abra\u00e7o (Warm Embrace)',
        situation:
          'You are at a lively house party in Rio de Janeiro, and your friend introduces you to someone you have never met before. In Brazil, first meetings are often much warmer and more physical than in many other cultures. Your new acquaintance opens their arms and leans in with a big smile.',
        options: {
          left: {
            text: 'Extend your hand for a formal handshake and keep a polite distance, saying "Nice to meet you" stiffly.',
            isKind: false,
          },
          right: {
            text: 'Greet them with a warm hug and a cheek kiss (or two!), smiling and saying "Prazer em te conhecer!" (Nice to meet you!)',
            isKind: true,
          },
        },
        explanation:
          'In Brazil, physical warmth is a cornerstone of social interaction. The "abra\u00e7o" (hug) and "beijo" (cheek kiss) are standard greetings, even when meeting someone for the first time through mutual friends. This openness reflects the Brazilian belief that human connection should be immediate, genuine, and joyful. Keeping a formal distance can feel cold or standoffish. Brazilians believe that a warm embrace breaks down barriers and instantly makes a stranger feel like a friend.',
      },
    },
    {
      id: 'br-q2',
      countryId: 'br',
      type: 'trivia_quiz',
      difficulty: 'medium',
      title: 'Brazilian Culture Quiz',
      points: 80,
      data: {
        type: 'trivia_quiz',
        question:
          'Carnival is the most famous festival in Brazil, drawing millions of participants and spectators every year. In which city is the world\'s largest and most iconic Carnival celebration held?',
        choices: [
          'S\u00e3o Paulo',
          'Salvador',
          'Rio de Janeiro',
          'Bras\u00edlia',
        ],
        correctIndex: 2,
        explanation:
          'Rio de Janeiro hosts the world\'s most famous Carnival celebration, featuring the spectacular Sambadrome parade where samba schools compete with dazzling floats and costumes. However, Salvador da Bahia actually holds the record for the largest street Carnival party! Brazilian Carnival is a vibrant fusion of African, Indigenous, and Portuguese cultures. Samba music and dance are at its heart, and the festival represents the Brazilian spirit of joy, community, and embracing life to the fullest. The Amazon rainforest, football (soccer), and the love of gathering with friends also define Brazilian culture.',
      },
    },
    {
      id: 'br-q3',
      countryId: 'br',
      type: 'history_lesson',
      difficulty: 'hard',
      title: 'The Story of Carnival',
      points: 120,
      data: {
        type: 'history_lesson',
        story:
          'Brazilian Carnival is far more than a party — it is a profound cultural tapestry woven from centuries of history, struggle, and celebration.\n\nThe festival\'s roots trace back to the Portuguese "Entrudo," a pre-Lenten celebration brought to Brazil by colonizers in the 17th century, where people playfully threw water and flour at each other in the streets. But Carnival\'s soul was transformed by the African diaspora.\n\nMillions of enslaved Africans brought their rich musical traditions, rhythms, and dances to Brazil. After abolition in 1888, Afro-Brazilian communities in Rio\'s hillside neighborhoods (morros) began organizing themselves into "escolas de samba" (samba schools) — community organizations that became the heart of Carnival. These samba schools were not just about music; they were a source of pride, identity, and resistance for communities that had been marginalized.\n\nToday, each samba school spends an entire year preparing an elaborate theme, original samba song, and spectacular costumes for the annual parade. The Sambadrome, designed by the legendary architect Oscar Niemeyer, hosts the competition that draws hundreds of millions of viewers worldwide.',
        question:
          'What cultural influence was most transformative in shaping the samba music and dance at the heart of Brazilian Carnival?',
        choices: [
          'French classical music traditions',
          'Spanish flamenco dance',
          'African musical traditions brought by the diaspora',
          'Italian opera and theater',
        ],
        correctIndex: 2,
        funFact:
          'The samba schools of Rio are deeply community-driven organizations, often based in lower-income neighborhoods. They function as social clubs, providing music education, dance training, and a sense of belonging for thousands of community members year-round. The largest samba school parades feature up to 4,000 performers each! Carnival also has a beautiful tradition of "blocos" — informal street parties where anyone can join, dance, and celebrate together, regardless of social class or background. It is the ultimate expression of the Brazilian spirit: everyone is welcome.',
      },
    },
  ],
};

// ============ MEXICO ============

const mexico: Country = {
  id: 'mx',
  name: 'Mexico',
  localName: 'M\u00e9xico',
  flag: '\u{1F1F2}\u{1F1FD}',
  region: 'americas',
  greeting: '\u00a1Hola!',
  culturalValue: 'Familia (Family)',
  description:
    'A vibrant culture where family is everything and every meal is a celebration.',
  quests: [
    {
      id: 'mx-q1',
      countryId: 'mx',
      type: 'cultural_scenario',
      difficulty: 'easy',
      title: 'The Heart of Familia',
      points: 50,
      data: {
        type: 'cultural_scenario',
        culturalValue: 'Familia (Family)',
        situation:
          'It is Sunday afternoon, and your elderly grandmother — your "abuelita" — is in the kitchen preparing a big meal for the whole family. She asks if you can come help her chop vegetables and set the table. You are comfortable on the couch scrolling through your phone.',
        options: {
          left: {
            text: 'Tell her "I\'m busy right now, Abuelita" and keep scrolling through your phone.',
            isKind: false,
          },
          right: {
            text: 'Jump up happily, join her in the kitchen, and listen to her stories while you help prepare the meal together.',
            isKind: true,
          },
        },
        explanation:
          'In Mexican culture, family — especially respect for elders — is the absolute center of life. The kitchen is often the heart of the home, and cooking together is an act of love and bonding. Time spent with your abuelita is not just helping with chores; it is an opportunity to receive her wisdom, hear family stories passed down through generations, and strengthen the bonds that hold the family together. Choosing your phone over family time would be seen as deeply disrespectful in Mexican culture, where "la familia" always comes first.',
      },
    },
    {
      id: 'mx-q2',
      countryId: 'mx',
      type: 'trivia_quiz',
      difficulty: 'medium',
      title: 'Mexican Culture Quiz',
      points: 80,
      data: {
        type: 'trivia_quiz',
        question:
          'D\u00eda de los Muertos (Day of the Dead) is one of Mexico\'s most iconic traditions. When is it primarily celebrated?',
        choices: [
          'October 31 (Halloween)',
          'November 1-2',
          'December 25 (Christmas)',
          'September 16 (Independence Day)',
        ],
        correctIndex: 1,
        explanation:
          'D\u00eda de los Muertos is celebrated on November 1st (for deceased children, "D\u00eda de los Inocentes") and November 2nd (for deceased adults). Far from being morbid, it is a joyful celebration of life and love for those who have passed. Families build colorful altars called "ofrendas," decorated with marigolds (cempas\u00fachil), candles, photos, and the favorite foods of their departed loved ones. The tradition blends indigenous Aztec beliefs with Catholic influences and was recognized by UNESCO as an Intangible Cultural Heritage in 2008. And by the way — tacos are authentically Mexican, while the large flour burrito is actually more of an American invention!',
      },
    },
    {
      id: 'mx-q3',
      countryId: 'mx',
      type: 'cultural_practice',
      difficulty: 'hard',
      title: 'Building an Ofrenda',
      points: 120,
      data: {
        type: 'cultural_practice',
        instruction:
          'An "ofrenda" is a beautiful altar built during D\u00eda de los Muertos (Day of the Dead) to honor and welcome back the spirits of deceased loved ones. Each element has deep symbolic meaning, connecting the living and the dead through love and memory. Let\'s learn how to build a traditional ofrenda step by step.',
        steps: [
          'Set up a table or platform with two or three tiers. The levels represent the earth, the spiritual realm, and the heavens — the journey between the world of the living and the dead.',
          'Place a framed photo (or photos) of your departed loved one at the top tier. This is the heart of the ofrenda — their presence watching over the family.',
          'Lay out bright orange marigold flowers (cempas\u00fachil) to create a path. Their vivid color and strong scent are believed to guide the spirits back to the world of the living.',
          'Add candles to light the way for the spirits. Traditionally, one candle is placed for each departed soul being honored.',
          'Set out their favorite foods and drinks: perhaps mole, pan de muerto (bread of the dead), sugar skulls (calaveras), fruit, and a glass of water for the long journey back.',
          'Include personal items that the departed loved: a favorite book, a musical instrument, a beloved hat, or anything that represents who they were in life.',
          'Add papel picado (colorful perforated paper banners) to represent the wind and the fragile nature of life. Copal incense purifies the space and welcomes the spirits.',
          'Gather the family around the ofrenda to share stories, laugh, cry, and celebrate the lives of those you love. This is what D\u00eda de los Muertos is truly about — love that transcends death.',
        ],
        tapsRequired: 8,
        completionMessage:
          'Beautiful! You have learned how to build a traditional Mexican ofrenda. D\u00eda de los Muertos teaches us that death is not an ending but a continuation of the bond between loved ones. By building an ofrenda, families declare that their love is stronger than death itself. The joy, music, food, and flowers transform grief into a celebration of the lives that shaped us. It is one of humanity\'s most beautiful traditions of remembrance and connection.',
      },
    },
  ],
};

// ============ EXPORT ============

export const AMERICAS_COUNTRIES: Country[] = [usa, canada, brazil, mexico];
