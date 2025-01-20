import React from 'react';

interface AboutSectionProps {
  title: string;
  content: string;
  imagePosition: 'left' | 'right';
}

export const AboutSection = ({ title, content, imagePosition }: AboutSectionProps) => {
  const contentSection = (
    <div className="md:w-1/2">
      <h2 className="text-2xl text-secondary/90 italic mb-4">{title}</h2>
      <p className="text-secondary/90 text-lg leading-relaxed">{content}</p>
    </div>
  );

  const imageSection = (
    <div className="md:w-1/2 h-64 bg-mystical-200/10 rounded-lg flex items-center justify-center">
      <span className="text-secondary/50">Image Placeholder</span>
    </div>
  );

  return (
    <div className={`flex flex-col ${imagePosition === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 mb-16`}>
      {imagePosition === 'left' ? (
        <>
          {imageSection}
          {contentSection}
        </>
      ) : (
        <>
          {contentSection}
          {imageSection}
        </>
      )}
    </div>
  );
};