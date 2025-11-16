

import React from 'react';
import { User } from '../types';

interface AvatarProps {
  user: User;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, className = 'w-9 h-9' }) => {
    if (user.avatarUrl && (user.avatarUrl.startsWith('http') || user.avatarUrl.startsWith('data:'))) {
        return (
            <img
                src={user.avatarUrl}
                alt={user.name}
                className={`${className} rounded-full object-cover`}
            />
        );
    }
    
    // Simple color hashing for variety
    const colors = [
        'bg-red-200 text-red-800', 
        'bg-green-200 text-green-800', 
        'bg-blue-200 text-blue-800', 
        'bg-purple-200 text-purple-800', 
        'bg-yellow-200 text-yellow-800',
        'bg-pink-200 text-pink-800',
        'bg-indigo-200 text-indigo-800',
    ];
    const colorIndex = (user.name.charCodeAt(0) + (user.name.length || 0)) % colors.length;

    return (
        <div className={`${className} ${colors[colorIndex]} rounded-full flex items-center justify-center font-bold text-sm uppercase`}>
            {user.name.charAt(0)}
        </div>
    );
};

export default Avatar;