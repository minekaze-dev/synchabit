
import React from 'react';
import { Challenge } from '../types';

interface ChallengesProps {
  challenges: Challenge[];
}

export default function Challenges({ challenges }: ChallengesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Community Challenges</h2>
        <p className="text-slate-500 mt-1">Join others to build habits together. Consistency is rewarded!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map(challenge => (
          <div key={challenge.id} className="bg-white rounded-lg shadow-sm border border-slate-100 p-6 flex flex-col">
            <div className="flex-grow">
              <div className="flex items-start gap-4">
                <span className="text-4xl">{challenge.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{challenge.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{challenge.description}</p>
                </div>
              </div>
            
              <div className="mt-4 flex justify-between text-sm text-slate-600">
                <div className="font-semibold">
                  <span className="text-brand-blue-600">{challenge.duration}</span> days
                </div>
                <div className="font-semibold">
                  <span className="text-brand-teal-600">{challenge.reward}</span> points
                </div>
                <div className="font-semibold">
                  <span className="text-slate-800">{challenge.participants}</span> members
                </div>
              </div>
            </div>
            <div className="mt-6">
                <button className="w-full bg-brand-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-blue-600 transition-colors">
                Join Challenge
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}