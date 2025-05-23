import React from 'react';

interface AboutSectionProps {
  title: string;
  content: string;
  imagePosition: 'left' | 'right';
  imageSrc?: string;
}

export const AboutSection = ({ title, content, imagePosition, imageSrc }: AboutSectionProps) => {
  const contentSection = (
    <div className="md:w-1/2 px-6">
      <h2 className="text-2xl text-secondary/90 italic mb-4">{title}</h2>
      <p className="text-secondary/90 text-lg leading-relaxed">{content}</p>
    </div>
  );

  const imageSection = (
    <div className="md:w-1/2">
      {imageSrc ? (
        <div className="h-64 overflow-hidden rounded-lg">
          <img 
            src={imageSrc} 
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="h-64 bg-mystical-200/10 rounded-lg flex items-center justify-center">
          <span className="text-secondary/50">Image Placeholder</span>
        </div>
      )}
    </div>
  );

  return (
    <div className={`flex flex-col md:flex-row ${imagePosition === 'right' ? '' : 'md:flex-row-reverse'} items-center gap-8 mb-16`}>
      {contentSection}
      {imageSection}
    </div>
  );
};