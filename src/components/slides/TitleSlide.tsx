import React from 'react';
import { Zap } from 'lucide-react';

interface TitleSlideProps {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    warning: string;
    success: string;
    danger: string;
    info: string;
    dark: string;
    light: string;
  };
}

const TitleSlide: React.FC<TitleSlideProps> = ({ colors }) => {
  return (
    <div className="h-full flex flex-col justify-center items-center text-center relative px-4 sm:px-6" style={{ backgroundColor: colors.primary }}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-700 opacity-90"></div>
      <div className="relative z-10 max-w-4xl">
        <div className="mb-4 sm:mb-6">
          <Zap className="w-12 h-12 sm:w-16 sm:h-16 text-white mx-auto mb-3 sm:mb-4" />
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">International Electrical Equipment Supply Chain Risk & Vendor Analysis</h1>
          <h2 className="text-xl sm:text-2xl lg:text-3xl text-blue-200 mb-2 sm:mb-3">BC Hydro</h2>
          <div className="w-20 sm:w-24 h-1 bg-white mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base lg:text-lg text-blue-100">Strategic Analysis Team | {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
    </div>
  );
};

export default TitleSlide; 