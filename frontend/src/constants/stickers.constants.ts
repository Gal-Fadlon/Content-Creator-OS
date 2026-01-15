/**
 * Sticker-related constants
 * Available stickers and their configurations
 */

import {
  Flower2,
  Star,
  Heart,
  Sun,
  Cloud,
  Moon,
  Coffee,
  Leaf,
  Music,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface StickerDefinition {
  id: string;
  icon: LucideIcon;
  color: string;
  label: string;
}

/**
 * Available stickers in the sticker bank
 */
export const AVAILABLE_STICKERS: StickerDefinition[] = [
  { id: 'flower', icon: Flower2, color: 'text-royal-blue', label: 'פרח' },
  { id: 'star', icon: Star, color: 'text-sand', label: 'כוכב' },
  { id: 'heart', icon: Heart, color: 'text-burgundy', label: 'לב' },
  { id: 'sun', icon: Sun, color: 'text-sand', label: 'שמש' },
  { id: 'cloud', icon: Cloud, color: 'text-muted-foreground', label: 'ענן' },
  { id: 'moon', icon: Moon, color: 'text-royal-blue', label: 'ירח' },
  { id: 'coffee', icon: Coffee, color: 'text-earth', label: 'קפה' },
  { id: 'leaf', icon: Leaf, color: 'text-status-published', label: 'עלה' },
  { id: 'music', icon: Music, color: 'text-royal-blue', label: 'מוזיקה' },
  { id: 'sparkle', icon: Sparkles, color: 'text-sand', label: 'נצנוץ' },
] as const;

/**
 * Map of icon IDs to their components (for rendering saved stickers)
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  flower: Flower2,
  star: Star,
  heart: Heart,
  sun: Sun,
  cloud: Cloud,
  moon: Moon,
  coffee: Coffee,
  leaf: Leaf,
  music: Music,
  sparkle: Sparkles,
};

