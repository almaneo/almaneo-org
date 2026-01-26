import type { Country } from '../types';

// ============ Thailand ============

const thailand: Country = {
  id: 'th',
  name: 'Thailand',
  localName: 'ประเทศไทย',
  flag: '🇹🇭',
  region: 'southeast_asia',
  greeting: 'Sawasdee krub/ka',
  culturalValue: 'Respect and Harmony',
  description:
    'Known as the Land of Smiles, Thailand blends deep Buddhist traditions with warm hospitality and reverence for elders and the monarchy.',
  quests: [
    // th-q1: cultural_scenario - Wai greeting to teacher
    {
      id: 'th-q1',
      countryId: 'th',
      type: 'cultural_scenario',
      difficulty: 'easy',
      title: 'The Respectful Wai',
      points: 50,
      data: {
        type: 'cultural_scenario',
        culturalValue: 'Respect for Elders and Teachers',
        situation:
          'You arrive at a school in Bangkok and meet your Thai teacher for the first time. She is much older than you and holds a respected position in the community. How do you greet her?',
        options: {
          left: {
            text: 'Perform a high Wai by pressing your palms together and raising your thumbs to the bridge of your nose while bowing slightly.',
            isKind: true,
          },
          right: {
            text: 'Wave casually and say "Hey, nice to meet you!" with a thumbs up.',
            isKind: false,
          },
        },
        explanation:
          'In Thai culture, the Wai is the traditional greeting performed by pressing the palms together in a prayer-like gesture. The height of the hands indicates the level of respect: for teachers and elders, the thumbs should reach the bridge of the nose. This shows deep respect (kreng jai) for their status and wisdom.',
      },
    },
    // th-q2: trivia_quiz - Thai culture
    {
      id: 'th-q2',
      countryId: 'th',
      type: 'trivia_quiz',
      difficulty: 'medium',
      title: 'Treasures of Thailand',
      points: 80,
      data: {
        type: 'trivia_quiz',
        question:
          'Wat Phra Kaew, located within the Grand Palace complex in Bangkok, houses one of the most sacred Buddhist artifacts in Thailand. What is this revered artifact?',
        choices: [
          'A golden reclining Buddha statue',
          'The Emerald Buddha, carved from a single block of jade',
          'An ancient Bodhi tree brought from India',
          'A crystal stupa containing a relic of the Buddha',
        ],
        correctIndex: 1,
        explanation:
          'The Emerald Buddha (Phra Kaew Morakot) is a figurine carved from a single block of green jade. Despite its name, it is not made of emerald. It is considered the palladium of the Thai Kingdom, and the King of Thailand changes its golden garments three times a year to correspond with the seasons. It is the most important and revered Buddhist image in Thailand.',
      },
    },
    // th-q3: cultural_practice - Wai greeting steps
    {
      id: 'th-q3',
      countryId: 'th',
      type: 'cultural_practice',
      difficulty: 'hard',
      title: 'Mastering the Wai',
      points: 120,
      data: {
        type: 'cultural_practice',
        instruction:
          'The Wai is the cornerstone of Thai etiquette. The gesture varies depending on who you are greeting. Practice the proper Wai for different social contexts by following each step carefully.',
        steps: [
          'Place your palms together with fingers extended and pointing upward, keeping your elbows close to your body.',
          'For greeting a peer or friend, raise your hands so your fingertips are at chin level and bow your head slightly.',
          'For greeting an elder or teacher, raise your hands higher so your thumbs touch the bridge of your nose, and bow more deeply.',
          'For greeting a monk or showing reverence at a temple, raise your hands so your thumbs touch between your eyebrows, and bow your head toward your fingertips.',
          'Hold each position for a moment to show sincerity. Remember: the higher the hands and the deeper the bow, the greater the respect shown.',
        ],
        tapsRequired: 15,
        completionMessage:
          'Wonderful! You have learned the art of the Wai. In Thailand, this graceful gesture is more than a greeting - it is a reflection of the value of "kreng jai" (consideration for others) that is central to Thai culture.',
      },
    },
  ],
};

// ============ Vietnam ============

const vietnam: Country = {
  id: 'vn',
  name: 'Vietnam',
  localName: 'Việt Nam',
  flag: '🇻🇳',
  region: 'southeast_asia',
  greeting: 'Xin chao',
  culturalValue: 'Filial Piety and Family',
  description:
    'A nation of rich history and resilient spirit, Vietnam cherishes family bonds, respect for elders, and a vibrant culinary heritage shaped by centuries of tradition.',
  quests: [
    // vn-q1: cultural_scenario - Respecting elders at meals
    {
      id: 'vn-q1',
      countryId: 'vn',
      type: 'cultural_scenario',
      difficulty: 'easy',
      title: 'The Family Meal',
      points: 50,
      data: {
        type: 'cultural_scenario',
        culturalValue: 'Respect for Elders at Mealtime',
        situation:
          'You are invited to a traditional Vietnamese family dinner. The table is set with steaming dishes of pho, spring rolls, and rice. The grandmother is seated at the head of the table and has not yet started eating. What do you do?',
        options: {
          left: {
            text: 'Wait patiently and invite the grandmother to eat first by saying "Moi ba an com" (Please eat, Grandmother), then wait for her to take the first bite before you begin.',
            isKind: true,
          },
          right: {
            text: 'Start eating right away because the food looks delicious and you are very hungry from the journey.',
            isKind: false,
          },
        },
        explanation:
          'In Vietnamese culture, meals are an important family ritual. It is customary to invite the eldest person at the table to eat first by saying "Moi" (a polite invitation). Starting to eat before elders is considered disrespectful. This tradition reflects "hieu" (filial piety), one of the most important values in Vietnamese society. Showing patience and deference to elders at the table is a sign of good upbringing.',
      },
    },
    // vn-q2: trivia_quiz - Vietnamese culture
    {
      id: 'vn-q2',
      countryId: 'vn',
      type: 'trivia_quiz',
      difficulty: 'medium',
      title: 'Discover Vietnam',
      points: 80,
      data: {
        type: 'trivia_quiz',
        question:
          'The "ao dai" is one of the most recognized symbols of Vietnamese culture. What is it?',
        choices: [
          'A traditional Vietnamese martial art practiced in temples',
          'A long, elegant tunic worn over loose-fitting trousers, often seen at celebrations and formal events',
          'A type of conical hat made from palm leaves used by farmers',
          'A ceremonial tea set used during the Vietnamese New Year',
        ],
        correctIndex: 1,
        explanation:
          'The ao dai (pronounced "ow zai" in the south or "ow yai" in the north) is a traditional Vietnamese garment consisting of a form-fitting, split-front tunic worn over wide-leg trousers. It is commonly worn by women at formal occasions, weddings, and national celebrations. The ao dai is a symbol of Vietnamese elegance and cultural identity, and has been refined over centuries to become the graceful garment seen today.',
      },
    },
    // vn-q3: history_lesson - Vietnamese Tet festival
    {
      id: 'vn-q3',
      countryId: 'vn',
      type: 'history_lesson',
      difficulty: 'hard',
      title: 'The Spirit of Tet',
      points: 120,
      data: {
        type: 'history_lesson',
        story:
          'Tet Nguyen Dan, commonly known as Tet, is the most important celebration in Vietnamese culture. Falling on the first day of the lunar calendar (usually late January or February), Tet marks the arrival of spring and is a time for family reunions, honoring ancestors, and welcoming new beginnings. Preparations begin weeks in advance: homes are cleaned from top to bottom to sweep away bad luck, kumquat trees and peach blossoms are displayed for prosperity and good fortune, and families prepare special foods like banh chung (square sticky rice cake) and mut (candied fruits). On the eve of Tet, families gather for a reunion dinner and visit temples at midnight. During the first three days, people visit relatives, exchange red envelopes called "li xi" containing lucky money, and avoid sweeping (which might sweep away good luck). The first visitor to a home on New Year\'s Day, called "xong dat," is believed to influence the family\'s fortune for the entire year.',
        question:
          'According to Tet tradition, what is the significance of "xong dat" - the first person to visit a home on New Year\'s Day?',
        choices: [
          'They must bring a gift of banh chung to ensure the family has enough food',
          'They are believed to influence the fortune of the household for the entire year',
          'They are required to perform a traditional dance at the doorstep',
          'They must be the youngest member of the extended family',
        ],
        correctIndex: 1,
        funFact:
          'Because xong dat is so important, many Vietnamese families carefully choose or even invite a specific person to be their first visitor - someone considered lucky, successful, and compatible with the family. Some people avoid visiting others on New Year\'s Day if they have had a bad year, so as not to bring misfortune!',
      },
    },
  ],
};

// ============ Indonesia ============

const indonesia: Country = {
  id: 'id',
  name: 'Indonesia',
  localName: 'Indonesia',
  flag: '🇮🇩',
  region: 'southeast_asia',
  greeting: 'Selamat pagi',
  culturalValue: 'Gotong Royong (Mutual Cooperation)',
  description:
    'The world\'s largest archipelago nation, Indonesia is a tapestry of over 17,000 islands, hundreds of ethnic groups, and a deep-rooted spirit of communal harmony known as Gotong Royong.',
  quests: [
    // id-q1: cultural_scenario - Gotong Royong (community help)
    {
      id: 'id-q1',
      countryId: 'id',
      type: 'cultural_scenario',
      difficulty: 'easy',
      title: 'The Spirit of Gotong Royong',
      points: 50,
      data: {
        type: 'cultural_scenario',
        culturalValue: 'Gotong Royong - Community Mutual Assistance',
        situation:
          'You are living in a small village in Java. A neighbor\'s house was damaged by heavy rain last night, and the village leader has called for everyone to help with repairs this morning. However, you had plans to visit a nearby market for some personal shopping. What do you do?',
        options: {
          left: {
            text: 'Join the community effort to help repair your neighbor\'s house. Your shopping can wait - this is what Gotong Royong is all about.',
            isKind: true,
          },
          right: {
            text: 'Head to the market as planned. Someone else will probably help, and you have important things to buy.',
            isKind: false,
          },
        },
        explanation:
          'Gotong Royong is one of Indonesia\'s most cherished cultural values, enshrined in the national philosophy of Pancasila. It means "mutual cooperation" or "working together" and reflects the belief that community welfare comes before individual desires. In Indonesian villages, people regularly come together to build houses, prepare for celebrations, and help neighbors in need. Participating in Gotong Royong strengthens social bonds and upholds the communal harmony that is central to Indonesian identity.',
      },
    },
    // id-q2: trivia_quiz - Indonesian culture
    {
      id: 'id-q2',
      countryId: 'id',
      type: 'trivia_quiz',
      difficulty: 'medium',
      title: 'Wonders of the Archipelago',
      points: 80,
      data: {
        type: 'trivia_quiz',
        question:
          'Indonesia\'s national motto is "Bhinneka Tunggal Ika." What does this phrase mean, and what language does it come from?',
        choices: [
          '"Strength in Numbers" - from Bahasa Indonesia',
          '"Unity in Diversity" - from Old Javanese (Kawi)',
          '"One Nation, One Language" - from Malay',
          '"Harmony Above All" - from Sanskrit',
        ],
        correctIndex: 1,
        explanation:
          '"Bhinneka Tunggal Ika" means "Unity in Diversity" and comes from Old Javanese (Kawi language). It is taken from the 14th-century poem "Kakawin Sutasoma" written by Mpu Tantular during the Majapahit Empire. The motto reflects Indonesia\'s extraordinary diversity - with over 300 ethnic groups, 700+ languages, and six officially recognized religions all coexisting within one nation. It is inscribed on the national emblem, the Garuda Pancasila.',
      },
    },
    // id-q3: cultural_practice - Indonesian greeting
    {
      id: 'id-q3',
      countryId: 'id',
      type: 'cultural_practice',
      difficulty: 'hard',
      title: 'The Indonesian Salam',
      points: 120,
      data: {
        type: 'cultural_practice',
        instruction:
          'Indonesia is home to many greeting customs that vary by region and religion. The most common formal greeting is the "Salam," which combines a handshake with a heartfelt gesture. Learn how to greet people respectfully in Indonesian culture.',
        steps: [
          'Approach the person with a warm smile and say "Assalamualaikum" (for Muslim greeting) or "Selamat pagi/siang/sore" (Good morning/afternoon/evening) for a general greeting.',
          'Extend both hands to gently clasp the other person\'s hand. The handshake should be soft and light, not firm - a gentle touch conveys warmth and humility.',
          'After the handshake, bring your right hand back to touch your chest (over your heart). This gesture means "I greet you from my heart" and shows sincerity.',
          'When greeting an elder or someone of higher status, bow your head slightly during the handshake and you may gently touch their hand to your forehead as a sign of deep respect (called "salim").',
          'Always use your right hand for greetings and when giving or receiving items. The left hand is considered impolite in Indonesian culture.',
        ],
        tapsRequired: 15,
        completionMessage:
          'Excellent! You have learned the Indonesian Salam. This greeting beautifully embodies the values of "sopan santun" (politeness and courtesy) that Indonesians hold dear. By touching your heart after a handshake, you are telling the other person that your greeting comes from a place of genuine warmth and respect.',
      },
    },
  ],
};

// ============ Export ============

export const SOUTHEAST_ASIA_COUNTRIES: Country[] = [thailand, vietnam, indonesia];
