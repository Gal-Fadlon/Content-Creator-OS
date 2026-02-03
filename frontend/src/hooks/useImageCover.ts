import { useState, useEffect, RefObject } from 'react';

interface UseImageCoverResult {
  imageAspectRatio: number | null;
  containerAspectRatio: number | null;
}

/**
 * Hook to calculate image and container aspect ratios for cover-style image display.
 * Used for panning images within a container while ensuring the image always covers.
 */
export const useImageCover = (
  imageUrl: string | undefined | null,
  containerRef: RefObject<HTMLElement>
): UseImageCoverResult => {
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [containerAspectRatio, setContainerAspectRatio] = useState<number | null>(null);

  // Load image aspect ratio
  useEffect(() => {
    if (!imageUrl) {
      setImageAspectRatio(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      setImageAspectRatio(img.naturalWidth / img.naturalHeight);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Track container aspect ratio
  useEffect(() => {
    if (!containerRef.current) return;
    const updateContainerAspectRatio = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setContainerAspectRatio(rect.width / rect.height);
        }
      }
    };
    updateContainerAspectRatio();
    const resizeObserver = new ResizeObserver(updateContainerAspectRatio);
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [containerRef]);

  return { imageAspectRatio, containerAspectRatio };
};
