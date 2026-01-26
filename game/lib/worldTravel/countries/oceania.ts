import type { Country } from '../types';

const australia: Country = {
  id: 'au',
  name: 'Australia',
  localName: 'Australia',
  flag: '\u{1F1E6}\u{1F1FA}',
  region: 'oceania',
  greeting: "G'day",
  culturalValue: 'Mateship',
  description:
    'The land down under, where mateship and a fair go define the national spirit.',
  quests: [
    {
      id: 'au-q1',
      countryId: 'au',
      type: 'cultural_scenario',
      difficulty: 'easy',
      title: 'Australian Mateship',
      points: 50,
      data: {
        type: 'cultural_scenario',
        culturalValue: 'Mateship',
        situation:
          'Your neighbor is struggling to move heavy furniture into their new house all by themselves. It is a hot afternoon and they look exhausted.',
        options: {
          left: {
            text: "Walk over and offer to help them carry the furniture",
            isKind: true,
          },
          right: {
            text: 'Close your curtains and go back to watching TV',
            isKind: false,
          },
        },
        explanation:
          'Mateship is a core Australian value that goes beyond friendship \u2014 it means looking out for one another, especially in tough times. From the early days of settlers and soldiers relying on each other in harsh conditions, Australians have embraced the idea that you always lend a hand to those in need.',
      },
    },
    {
      id: 'au-q2',
      countryId: 'au',
      type: 'trivia_quiz',
      difficulty: 'medium',
      title: 'Land Down Under Trivia',
      points: 80,
      data: {
        type: 'trivia_quiz',
        question:
          'Australia is a continent of unique wonders. Which of the following is TRUE about Australia?',
        choices: [
          'Vegemite is a popular Australian chocolate spread',
          'The Great Barrier Reef is the largest living structure on Earth',
          'Kangaroos are native to both Australia and New Zealand',
          'Aboriginal Dreamtime stories are only about 200 years old',
        ],
        correctIndex: 1,
        explanation:
          'The Great Barrier Reef, stretching over 2,300 km off the coast of Queensland, is indeed the largest living structure on Earth and is visible from space. Vegemite is a savory yeast extract (not chocolate!), kangaroos are native only to Australia, and Aboriginal Dreamtime stories are among the oldest continuous cultural traditions on Earth \u2014 dating back over 65,000 years.',
      },
    },
    {
      id: 'au-q3',
      countryId: 'au',
      type: 'history_lesson',
      difficulty: 'hard',
      title: 'Dreamtime \u2014 The Oldest Stories on Earth',
      points: 120,
      data: {
        type: 'history_lesson',
        story:
          'Aboriginal Australians are the custodians of the world\'s oldest continuous culture, spanning over 65,000 years. At the heart of their heritage are the Dreamtime stories \u2014 sacred narratives that explain how ancestral spirits created the land, animals, and laws that govern life. The Dreamtime is not simply the past; it is an ever-present reality that connects people to country, community, and spirit. Respecting indigenous culture means understanding that the land holds deep spiritual significance and that these stories carry knowledge passed down through countless generations.',
        question:
          'What is the significance of Dreamtime in Aboriginal Australian culture?',
        choices: [
          'It is a recent artistic movement from the 1900s',
          'It describes sacred creation stories that connect people to land and spirit',
          'It is the name of a famous Australian national holiday',
          'It refers to the period when Europeans first arrived in Australia',
        ],
        correctIndex: 1,
        funFact:
          'Aboriginal Australian culture is the oldest continuous culture on Earth. Some Dreamtime stories accurately describe events from over 10,000 years ago, such as rising sea levels at the end of the last Ice Age \u2014 making them among the oldest oral records of real geological events in human history.',
      },
    },
  ],
};

export const OCEANIA_COUNTRIES: Country[] = [australia];
