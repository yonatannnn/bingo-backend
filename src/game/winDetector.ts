import { ICard } from '../models/Card.model';

export interface MarkedCard {
  card: ICard;
  markedNumbers: number[];
}

/**
 * Check if a card has a winning pattern
 * Winning patterns:
 * - One Line: Horizontal, vertical, or diagonal
 * - Four Corners: B-1, B-5, O-1, O-5
 */
export function checkWin(card: MarkedCard): {
  hasWon: boolean;
  pattern?: 'line' | 'corners';
  lineType?: 'horizontal' | 'vertical' | 'diagonal';
  lineIndex?: number;
} {
  const { card: cardData, markedNumbers } = card;
  const { B, I, N, G, O } = cardData.numbers;

  // Check Four Corners
  const corners = [B[0], B[4], O[0], O[4]];
  const allCornersMarked = corners.every((num) => markedNumbers.includes(num));
  if (allCornersMarked) {
    return { hasWon: true, pattern: 'corners' };
  }

  // Check Horizontal Lines
  for (let i = 0; i < 5; i++) {
    const line = [B[i], I[i], N[i], G[i], O[i]];
    if (line.every((num) => markedNumbers.includes(num))) {
      return {
        hasWon: true,
        pattern: 'line',
        lineType: 'horizontal',
        lineIndex: i,
      };
    }
  }

  // Check Vertical Lines
  const columns = [B, I, N, G, O];
  for (let i = 0; i < 5; i++) {
    const column = columns[i];
    if (column.every((num) => markedNumbers.includes(num))) {
      return {
        hasWon: true,
        pattern: 'line',
        lineType: 'vertical',
        lineIndex: i,
      };
    }
  }

  // Check Diagonals
  // Top-left to bottom-right
  const diagonal1 = [B[0], I[1], N[2], G[3], O[4]];
  if (diagonal1.every((num) => markedNumbers.includes(num))) {
    return {
      hasWon: true,
      pattern: 'line',
      lineType: 'diagonal',
      lineIndex: 0,
    };
  }

  // Top-right to bottom-left
  const diagonal2 = [B[4], I[3], N[2], G[1], O[0]];
  if (diagonal2.every((num) => markedNumbers.includes(num))) {
    return {
      hasWon: true,
      pattern: 'line',
      lineType: 'diagonal',
      lineIndex: 1,
    };
  }

  return { hasWon: false };
}

/**
 * Get the column letter for a number (B, I, N, G, or O)
 */
export function getColumnForNumber(num: number): 'B' | 'I' | 'N' | 'G' | 'O' {
  if (num >= 1 && num <= 15) return 'B';
  if (num >= 16 && num <= 30) return 'I';
  if (num >= 31 && num <= 45) return 'N';
  if (num >= 46 && num <= 60) return 'G';
  if (num >= 61 && num <= 75) return 'O';
  throw new Error(`Invalid number: ${num}`);
}

