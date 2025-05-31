import React from 'react';
import { Shield, TrendingUp, Users } from 'lucide-react';
import { Colors } from './types';

interface ChallengesSlideProps {
  colors: Colors;
}

const ChallengesSlide: React.FC<ChallengesSlideProps> = ({ colors }) => {
  return (
    <div className="h-full p-12" style={{ backgroundColor: colors.navy }}>
      <h1 className="text-5xl font-bold mb-8 text-white">Supply Chain Vulnerabilities</h1>
      <div className="grid grid-cols-3 gap-8 h-3/4">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <Shield className="w-12 h-12 mb-4" style={{ color: colors.darkGreen }} />
          <h3 className="text-2xl font-semibold mb-4" style={{ color: colors.navy }}>Geopolitical Risks</h3>
          <ul className="text-lg space-y-2">
            <li>• Trade war tensions</li>
            <li>• Tariff uncertainties</li>
            <li>• Supply route disruptions</li>
          </ul>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <TrendingUp className="w-12 h-12 mb-4" style={{ color: colors.teal }} />
          <h3 className="text-2xl font-semibold mb-4" style={{ color: colors.navy }}>Economic Factors</h3>
          <ul className="text-lg space-y-2">
            <li>• Currency fluctuations</li>
            <li>• Inflation pressures</li>
            <li>• Rising transportation costs</li>
          </ul>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <Users className="w-12 h-12 mb-4" style={{ color: colors.lightGreen }} />
          <h3 className="text-2xl font-semibold mb-4" style={{ color: colors.navy }}>Operational Risks</h3>
          <ul className="text-lg space-y-2">
            <li>• Single-source dependencies</li>
            <li>• Extended lead times</li>
            <li>• Quality assurance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChallengesSlide; 