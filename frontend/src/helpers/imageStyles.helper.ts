import type { CSSObject } from '@mui/material/styles';

interface CoverImageStyleParams {
  zoom: number;
  offsetX: number;
  offsetY: number;
  imageAspectRatio: number | null;
  containerAspectRatio: number | null;
  transitionDuration?: string;
}

/**
 * Calculates styles for an image that covers its container while supporting
 * zoom and pan functionality. Used by calendar day, grid items, and image editor.
 */
export const getCoverImageStyles = ({
  zoom,
  offsetX,
  offsetY,
  imageAspectRatio,
  containerAspectRatio,
  transitionDuration = '0.1s',
}: CoverImageStyleParams): CSSObject => {
  // Default to standard cover behavior if aspect ratios not yet known
  if (!imageAspectRatio || !containerAspectRatio) {
    return {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: `transform ${transitionDuration} ease-out`,
    };
  }

  // Calculate dimensions to cover the container (like object-fit: cover)
  // If image is wider than container (relative to height), fit to height
  // If image is taller than container (relative to width), fit to width
  const fitToHeight = imageAspectRatio > containerAspectRatio;

  // Base size that covers the container
  const baseWidth = fitToHeight ? `${(imageAspectRatio / containerAspectRatio) * 100}%` : '100%';
  const baseHeight = fitToHeight ? '100%' : `${(containerAspectRatio / imageAspectRatio) * 100}%`;

  return {
    position: 'absolute',
    width: baseWidth,
    height: baseHeight,
    left: '50%',
    top: '50%',
    transform: `translate(calc(-50% + ${offsetX}%), calc(-50% + ${offsetY}%)) scale(${zoom})`,
    transformOrigin: 'center',
    transition: `transform ${transitionDuration} ease-out`,
  };
};
