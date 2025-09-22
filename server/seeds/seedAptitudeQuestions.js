const AptitudeQuestion = require('../models/AptitudeQuestion');

const sampleQuestions = [
  // Quantitative Aptitude Questions
  {
    topic: 'quant',
    question: 'If 20% of a number is 50, what is 30% of the same number?',
    type: 'mcq',
    options: ['60', '75', '80', '90'],
    correctAnswer: '75',
    explanation: 'If 20% of x = 50, then x = 250. So 30% of 250 = 75.',
    difficulty: 'easy'
  },
  {
    topic: 'quant',
    question: 'A train travels 120 km in 2 hours. What is its speed in km/h?',
    type: 'text',
    options: [],
    correctAnswer: '60',
    explanation: 'Speed = Distance/Time = 120/2 = 60 km/h',
    difficulty: 'easy'
  },
  {
    topic: 'quant',
    question: 'The compound interest on Rs. 1000 for 2 years at 10% per annum is:',
    type: 'mcq',
    options: ['Rs. 200', 'Rs. 210', 'Rs. 220', 'Rs. 230'],
    correctAnswer: 'Rs. 210',
    explanation: 'CI = P(1+R/100)^T - P = 1000(1.1)^2 - 1000 = 1210 - 1000 = Rs. 210',
    difficulty: 'medium'
  },
  {
    topic: 'quant',
    question: 'If the ratio of ages of A and B is 3:4 and sum of their ages is 35, what is A\'s age?',
    type: 'text',
    options: [],
    correctAnswer: '15',
    explanation: 'Let ages be 3x and 4x. Then 3x + 4x = 35, so 7x = 35, x = 5. A\'s age = 3x = 15.',
    difficulty: 'medium'
  },

  // Logical Reasoning Questions
  {
    topic: 'logical-reasoning',
    question: 'In a certain code, COMPUTER is written as RFUVQNPC. How is MEDICINE written?',
    type: 'text',
    options: [],
    correctAnswer: 'BTSXRXCT',
    explanation: 'Each letter is shifted by +15 positions in the alphabet.',
    difficulty: 'hard'
  },
  {
    topic: 'logical-reasoning',
    question: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
    type: 'mcq',
    options: ['40', '42', '44', '46'],
    correctAnswer: '42',
    explanation: 'Differences are 4, 6, 8, 10, so next difference is 12. 30 + 12 = 42.',
    difficulty: 'medium'
  },
  {
    topic: 'logical-reasoning',
    question: 'If A is the brother of B, B is the sister of C, and C is the father of D, what is A to D?',
    type: 'mcq',
    options: ['Uncle', 'Father', 'Grandfather', 'Brother'],
    correctAnswer: 'Uncle',
    explanation: 'A is brother of B, B is sister of C (so A is brother of C), C is father of D, so A is uncle of D.',
    difficulty: 'easy'
  },

  // Verbal Ability Questions
  {
    topic: 'verbal',
    question: 'Choose the word most similar in meaning to METICULOUS:',
    type: 'mcq',
    options: ['Careless', 'Careful', 'Hasty', 'Rough'],
    correctAnswer: 'Careful',
    explanation: 'Meticulous means showing great attention to detail; very careful and precise.',
    difficulty: 'easy'
  },
  {
    topic: 'verbal',
    question: 'Choose the correct sentence:',
    type: 'mcq',
    options: [
      'Neither of the boys were present',
      'Neither of the boys was present',
      'Neither of the boy were present',
      'Neither of the boy was present'
    ],
    correctAnswer: 'Neither of the boys was present',
    explanation: 'Neither takes singular verb, and "boys" is correct plural form.',
    difficulty: 'medium'
  },
  {
    topic: 'verbal',
    question: 'What is the antonym of ABUNDANT?',
    type: 'text',
    options: [],
    correctAnswer: 'scarce',
    explanation: 'Abundant means existing in large quantities; scarce means insufficient.',
    difficulty: 'easy'
  },

  // Puzzles Questions
  {
    topic: 'puzzles',
    question: 'A man lives on the 20th floor. He takes elevator down but only to 10th floor when coming up, except on rainy days when he goes to 20th. Why?',
    type: 'mcq',
    options: [
      'He likes walking',
      'Elevator is broken above 10th floor',
      'He is too short to reach 20th button',
      'He exercises by walking'
    ],
    correctAnswer: 'He is too short to reach 20th button',
    explanation: 'On rainy days, he has an umbrella to help reach the higher button.',
    difficulty: 'hard'
  },
  {
    topic: 'puzzles',
    question: 'What comes next in the pattern: O, T, T, F, F, S, S, ?',
    type: 'mcq',
    options: ['E', 'N', 'I', 'G'],
    correctAnswer: 'E',
    explanation: 'First letters of numbers: One, Two, Three, Four, Five, Six, Seven, Eight.',
    difficulty: 'medium'
  },
  {
    topic: 'puzzles',
    question: 'I am taken from a mine and shut in a wooden case. I am never released but used by almost everyone. What am I?',
    type: 'text',
    options: [],
    correctAnswer: 'pencil lead',
    explanation: 'Graphite is mined and put in wooden pencils, never released but used for writing.',
    difficulty: 'medium'
  }
];

async function seedAptitudeQuestions() {
  try {
    // Clear existing questions
    await AptitudeQuestion.deleteMany({});
    console.log('Cleared existing aptitude questions');

    // Insert sample questions
    await AptitudeQuestion.insertMany(sampleQuestions);
    console.log(`Inserted ${sampleQuestions.length} aptitude questions`);

    console.log('Aptitude questions seeded successfully!');
  } catch (error) {
    console.error('Error seeding aptitude questions:', error);
  }
}

module.exports = seedAptitudeQuestions;