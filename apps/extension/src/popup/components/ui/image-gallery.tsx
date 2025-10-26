/**
 * Image Gallery Component
 * Displays product images in a responsive grid
 */

import { Card, CardBody } from '@heroui/react';

interface ImageGalleryProps {
  images: string[];
  maxDisplay?: number;
}

export function ImageGallery({ images, maxDisplay = 12 }: ImageGalleryProps) {
  const displayImages = images.slice(0, maxDisplay);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-center">
        <div className="text-default-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-2 opacity-50"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p className="text-xs">No images found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {displayImages.map((url, index) => (
        <Card
          key={index}
          as="a"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          isPressable
          isHoverable
          className="aspect-square"
        >
          <CardBody className="p-0 overflow-hidden">
            <img
              src={url}
              alt={`Product image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </CardBody>
        </Card>
      ))}
      {images.length > maxDisplay && (
        <Card className="aspect-square">
          <CardBody className="flex items-center justify-center bg-content2">
            <span className="text-[10px] font-medium text-default-500">
              +{images.length - maxDisplay}
            </span>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
