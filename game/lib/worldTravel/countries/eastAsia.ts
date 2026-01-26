/**
 * East Asia Countries - Korea, Japan, China
 * Cultural quests celebrating the values of Jeong, Omotenashi, and Guanxi
 */

import type { Country } from '../types';

// ============ KOREA ============

const korea: Country = {
  id: 'kr',
  name: 'South Korea',
  localName: '대한민국',
  flag: '🇰🇷',
  region: 'east_asia',
  greeting: '안녕하세요 (Annyeonghaseyo)',
  culturalValue: 'Jeong (情) - Deep emotional bonds between people',
  description:
    'A vibrant nation where ancient traditions meet cutting-edge technology. Korea is known for Jeong — a unique cultural concept of warmth, affection, and deep human connection that binds communities together.',
  quests: [
    {
      id: 'kr-q1',
      countryId: 'kr',
      type: 'cultural_scenario',
      difficulty: 'easy',
      title: 'The Spirit of Jeong',
      points: 50,
      data: {
        type: 'cultural_scenario',
        culturalValue: 'Jeong (情)',
        situation:
          'You are walking up a steep hill in Seoul when you notice an elderly grandmother struggling to carry heavy grocery bags. She hasn\'t asked for help, but she is clearly having a hard time. In Korean culture, "Jeong" means showing care for others even without being asked.',
        options: {
          left: {
            text: 'Approach her warmly, bow slightly, and offer to carry her bags to her destination. Walk with her and chat along the way.',
            isKind: true,
          },
          right: {
            text: 'Walk past quickly. She seems like she can manage, and you don\'t want to embarrass her by implying she is weak.',
            isKind: false,
          },
        },
        explanation:
          'In Korean culture, Jeong (情) is about showing genuine care and warmth to others — especially elders. Helping an elderly person without being asked is a beautiful expression of Jeong. Koreans believe that these small acts of kindness create deep, lasting bonds between people, even strangers.',
      },
    },
    {
      id: 'kr-q2',
      countryId: 'kr',
      type: 'trivia_quiz',
      difficulty: 'medium',
      title: 'Korean Culture Quiz',
      points: 80,
      data: {
        type: 'trivia_quiz',
        question:
          'Kimchi is one of the most iconic Korean foods. What is the traditional communal event called where families and neighbors gather together to make large batches of kimchi for the winter season?',
        choices: [
          'Kimjang (김장)',
          'Seollal (설날)',
          'Chuseok (추석)',
          'Hansik (한식)',
        ],
        correctIndex: 0,
        explanation:
          'Kimjang (김장) is the centuries-old Korean tradition of communal kimchi making, typically held in late autumn. Entire families and neighborhoods come together to prepare large quantities of kimchi for the winter. In 2013, UNESCO recognized Kimjang as an Intangible Cultural Heritage of Humanity, honoring it as a symbol of Korean community spirit and sharing.',
      },
    },
    {
      id: 'kr-q3',
      countryId: 'kr',
      type: 'cultural_practice',
      difficulty: 'easy',
      title: 'The Korean Bow',
      points: 50,
      data: {
        type: 'cultural_practice',
        instruction:
          'In Korea, bowing is the most common way to greet someone, show respect, or say thank you. The depth of the bow conveys different levels of respect. Let\'s practice the Korean bow!',
        steps: [
          'Stand straight with your feet together and arms at your sides.',
          'Place your hands together in front of your waist (men) or clasp them gently in front (women).',
          'Bend at the waist to about 30 degrees for a standard polite greeting.',
          'Hold the bow for a brief moment to show sincerity.',
          'Rise back up smoothly and make eye contact with a warm smile.',
          'Say "안녕하세요" (Annyeonghaseyo) — the standard Korean greeting!',
        ],
        tapsRequired: 6,
        completionMessage:
          'Wonderful! You have mastered the Korean bow. In Korea, a sincere bow can express more than words — it shows humility, respect, and the Jeong spirit of valuing human connection. Koreans bow when meeting, thanking, apologizing, and even when saying goodbye.',
      },
    },
  ],
};

// ============ JAPAN ============

const japan: Country = {
  id: 'jp',
  name: 'Japan',
  localName: '日本',
  flag: '🇯🇵',
  region: 'east_asia',
  greeting: 'こんにちは (Konnichiwa)',
  culturalValue: 'Omotenashi (おもてなし) - Wholehearted hospitality',
  description:
    'An island nation where ancient wisdom and modern innovation coexist in harmony. Japan is celebrated for Omotenashi — the art of wholehearted hospitality, anticipating the needs of others before they even speak.',
  quests: [
    {
      id: 'jp-q1',
      countryId: 'jp',
      type: 'cultural_scenario',
      difficulty: 'medium',
      title: 'The Art of Omotenashi',
      points: 80,
      data: {
        type: 'cultural_scenario',
        culturalValue: 'Omotenashi (おもてなし)',
        situation:
          'You are at a business meeting in Tokyo. Your Japanese colleague, Mr. Tanaka, presents his business card (meishi) to you with both hands, bowing slightly. The card is facing you so you can read it. How do you receive it?',
        options: {
          left: {
            text: 'Receive the card with both hands, bow slightly, read it carefully, and comment on something respectful like his title. Place it gently on the table in front of you during the meeting.',
            isKind: true,
          },
          right: {
            text: 'Take the card with one hand, glance at it, and slip it into your back pocket so you don\'t lose it. Then get straight to business.',
            isKind: false,
          },
        },
        explanation:
          'In Japan, a business card (meishi) is considered an extension of the person\'s identity. Receiving it with both hands, reading it attentively, and placing it respectfully on the table shows Omotenashi — honoring the other person through careful attention to detail. Putting it in your pocket, especially a back pocket, is considered very disrespectful.',
      },
    },
    {
      id: 'jp-q2',
      countryId: 'jp',
      type: 'trivia_quiz',
      difficulty: 'medium',
      title: 'Japanese Culture Quiz',
      points: 80,
      data: {
        type: 'trivia_quiz',
        question:
          'In Japan, there is a beautiful cultural concept called "Wabi-Sabi" (侘寂). What does it represent?',
        choices: [
          'The pursuit of absolute perfection in all things',
          'Finding beauty in imperfection and the transient nature of life',
          'A traditional Japanese martial arts philosophy',
          'The art of arranging flowers in perfect symmetry',
        ],
        correctIndex: 1,
        explanation:
          'Wabi-Sabi (侘寂) is a profound Japanese aesthetic philosophy that finds beauty in imperfection, impermanence, and incompleteness. Rooted in Zen Buddhism, it teaches us to appreciate the natural cycle of growth and decay. A cracked ceramic bowl repaired with gold (Kintsugi) perfectly embodies this concept — the "flaws" become the most beautiful part of the object.',
      },
    },
    {
      id: 'jp-q3',
      countryId: 'jp',
      type: 'history_lesson',
      difficulty: 'hard',
      title: 'The Way of Tea',
      points: 120,
      data: {
        type: 'history_lesson',
        story:
          'The Japanese tea ceremony, known as "Chadō" or "Sadō" (茶道, "The Way of Tea"), is far more than simply making and drinking tea. Developed over centuries and deeply influenced by Zen Buddhism, it was elevated into an art form by the legendary tea master Sen no Rikyū in the 16th century.\n\nRikyū established four fundamental principles: Wa (harmony), Kei (respect), Sei (purity), and Jaku (tranquility). Every movement in the ceremony — from the way the host folds the cloth to how the guest rotates the tea bowl — is performed with mindfulness and intention.\n\nThe tea room itself is designed to embody equality: the entrance (nijiriguchi) is intentionally small, requiring even the most powerful samurai to bow and remove their swords before entering. Inside, all participants are equal.',
        question:
          'According to Sen no Rikyū, why was the entrance to the tea room made intentionally small?',
        choices: [
          'To keep the room warm during winter ceremonies',
          'To prevent enemies from attacking during the ceremony',
          'To require all guests to humble themselves and enter as equals',
          'Because building materials were expensive in that era',
        ],
        correctIndex: 2,
        funFact:
          'Sen no Rikyū once said, "Though many people drink tea, if you do not know the Way of Tea, tea will drink you." His philosophy of "Ichigo Ichie" (一期一会) — "one time, one meeting" — teaches that every encounter is unique and should be treasured, because it can never be replicated. This mindset of cherishing each moment remains a cornerstone of Japanese culture today.',
      },
    },
    {
      id: 'jp-q4',
      countryId: 'jp',
      type: 'cultural_practice',
      difficulty: 'easy',
      title: 'Shoes Off, Please!',
      points: 50,
      data: {
        type: 'cultural_practice',
        instruction:
          'In Japan, removing your shoes before entering a home, temple, or traditional inn (ryokan) is one of the most important customs. It represents leaving the outside world behind and showing respect for the clean, sacred interior space. Let\'s learn the proper way!',
        steps: [
          'Step up to the "genkan" (entryway) — the area between outside and inside.',
          'Face forward and step out of your shoes onto the raised floor.',
          'Turn around and kneel down to neatly arrange your shoes facing the door.',
          'Put on the indoor slippers provided by your host.',
          'If you visit the bathroom, swap to the special bathroom slippers at the door!',
          'When leaving, step down to the genkan and put your outdoor shoes back on.',
        ],
        tapsRequired: 6,
        completionMessage:
          'Well done! You have learned proper Japanese shoe etiquette. This custom reflects the Japanese value of cleanliness (清潔, seiketsu) and respect for shared spaces. Fun fact: there are often separate slippers for the bathroom, and accidentally wearing toilet slippers into the living room is a classic and embarrassing mistake even some Japanese people make!',
      },
    },
  ],
};

// ============ CHINA ============

const china: Country = {
  id: 'cn',
  name: 'China',
  localName: '中国',
  flag: '🇨🇳',
  region: 'east_asia',
  greeting: '你好 (Nǐ hǎo)',
  culturalValue: 'Guanxi (关系) - Meaningful relationships and mutual trust',
  description:
    'One of the world\'s oldest civilizations, China is a land of incredible diversity and rich cultural heritage. The concept of Guanxi — building deep, trust-based relationships — lies at the heart of Chinese social and business life.',
  quests: [
    {
      id: 'cn-q1',
      countryId: 'cn',
      type: 'cultural_scenario',
      difficulty: 'medium',
      title: 'The Bond of Guanxi',
      points: 80,
      data: {
        type: 'cultural_scenario',
        culturalValue: 'Guanxi (关系)',
        situation:
          'You are having dinner with a Chinese business partner, Mr. Chen, at a restaurant in Shanghai. The meal was wonderful, and the check arrives. Mr. Chen immediately reaches for the bill and insists on paying. You know that in Chinese culture, offering to pay the bill is a way to show generosity and build "Guanxi" (relationships). What do you do?',
        options: {
          left: {
            text: 'Politely insist on paying or splitting the bill at least two or three times. If Mr. Chen still insists, graciously accept and express your gratitude, promising to host the next dinner.',
            isKind: true,
          },
          right: {
            text: 'Immediately accept his offer without any resistance. After all, he offered first, and it would be awkward to argue about money.',
            isKind: false,
          },
        },
        explanation:
          'In Chinese culture, the "bill dance" is actually an important social ritual! The polite back-and-forth of insisting to pay shows respect, humility, and genuine care for the relationship. Simply accepting without any gesture of offering to pay can seem rude or suggest that you take the relationship for granted. The key is sincerity — your effort to reciprocate builds stronger Guanxi.',
      },
    },
    {
      id: 'cn-q2',
      countryId: 'cn',
      type: 'trivia_quiz',
      difficulty: 'easy',
      title: 'Chinese Culture Quiz',
      points: 50,
      data: {
        type: 'trivia_quiz',
        question:
          'The Chinese dragon (龙, lóng) is one of the most iconic symbols in Chinese culture. Unlike Western dragons, what does the Chinese dragon primarily symbolize?',
        choices: [
          'Destruction and fear',
          'Power, luck, and prosperity',
          'War and conquest',
          'Isolation and mystery',
        ],
        correctIndex: 1,
        explanation:
          'The Chinese dragon is a symbol of power, strength, good luck, and prosperity. Unlike the fearsome fire-breathing dragons of Western mythology, the Chinese dragon is a benevolent creature associated with rain, rivers, and agriculture. Historically, the dragon was the symbol of the Emperor, representing supreme authority and divine power. Today, dragon dances during festivals celebrate good fortune and community joy.',
      },
    },
    {
      id: 'cn-q3',
      countryId: 'cn',
      type: 'history_lesson',
      difficulty: 'hard',
      title: 'The Story of Chinese New Year',
      points: 120,
      data: {
        type: 'history_lesson',
        story:
          'Chinese New Year (春节, Chūn Jié), also known as the Spring Festival, is the most important holiday in Chinese culture. Its origins trace back thousands of years to a legendary tale.\n\nAccording to ancient legend, a fearsome beast called "Nian" (年) would emerge at the end of each year to devour livestock, crops, and even villagers. The people lived in terror until an old wise man discovered that Nian was afraid of three things: the color red, loud noises, and bright fire.\n\nFrom that day forward, on the last night of the year, people would hang red decorations on their doors, set off firecrackers, and light lanterns to scare Nian away. When they survived the night, they would congratulate each other the next morning — this greeting became "过年好" (Guò nián hǎo), literally "Survived Nian well!"\n\nToday, Chinese New Year is a time for family reunions, giving red envelopes (红包, hóngbāo) filled with money for good luck, enjoying a grand feast, and watching spectacular fireworks — all traditions rooted in that ancient story.',
        question:
          'According to the legend, what was the beast "Nian" afraid of?',
        choices: [
          'Water, darkness, and silence',
          'The color red, loud noises, and bright fire',
          'Swords, shields, and armor',
          'Music, dance, and singing',
        ],
        correctIndex: 1,
        funFact:
          'During Chinese New Year, it is a tradition to thoroughly clean the entire house before the holiday — sweeping away bad luck to make room for good fortune. However, you should NOT sweep on New Year\'s Day itself, because that might sweep away the new year\'s good luck! Also, the Chinese zodiac cycle repeats every 12 years, each represented by an animal. Which animal year were you born in?',
      },
    },
  ],
};

// ============ EXPORT ============

export const EAST_ASIA_COUNTRIES: Country[] = [korea, japan, china];
