import Card from '../models/Card.model';

/**
 * Generates a unique bingo card with numbers in the correct ranges
 * B: 1-15, I: 16-30, N: 31-45, G: 46-60, O: 61-75
 */
export function generateCardNumbers(): {
  B: number[];
  I: number[];
  N: number[];
  G: number[];
  O: number[];
} {
  const getRandomNumbers = (min: number, max: number, count: number): number[] => {
    const numbers: number[] = [];
    const available = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * available.length);
      numbers.push(available.splice(randomIndex, 1)[0]);
    }
    
    return numbers.sort((a, b) => a - b);
  };

  return {
    B: getRandomNumbers(1, 15, 5),
    I: getRandomNumbers(16, 30, 5),
    N: getRandomNumbers(31, 45, 5),
    G: getRandomNumbers(46, 60, 5),
    O: getRandomNumbers(61, 75, 5),
  };
}

/**
 * Initialize all 100 cards in the database
 */
export async function initializeCards(): Promise<void> {
  const Card = (await import('../models/Card.model')).default;
  const count = await Card.countDocuments();

  if (count >= 100) {
    return; // Cards already initialized
  }

  const cards = [];
  for (let i = 1; i <= 100; i++) {
    const numbers = generateCardNumbers();
    cards.push({
      cardId: i,
      numbers,
    });
  }

  await Card.insertMany(cards);
  console.log('✅ Initialized 100 bingo cards');
}

/**
 * Get card by ID
 */
export async function getCard(cardId: number) {
  const Card = (await import('../models/Card.model')).default;
  return await Card.findOne({ cardId });
}

/**
 * Get all cards
 */
export async function getAllCards() {
  const Card = (await import('../models/Card.model')).default;
  return await Card.find().sort({ cardId: 1 });
}

