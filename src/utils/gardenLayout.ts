import { Dimensions } from 'react-native';
import { CONFIG } from '../constants/config';

const { width: screenWidth } = Dimensions.get('window');

export function assignGardenPosition(seedIndex: number): { x: number; y: number } {
  const columns = CONFIG.garden.columns;
  const cellWidth = (screenWidth - 32) / columns;
  const cellHeight = CONFIG.garden.cellHeight;
  const col = seedIndex % columns;
  const row = Math.floor(seedIndex / columns);
  const jitterX = (Math.random() * 16) - 8;
  const jitterY = (Math.random() * 10) - 5;
  return {
    x: col * cellWidth + cellWidth / 2 + jitterX,
    y: row * cellHeight + cellHeight / 2 + jitterY,
  };
}
