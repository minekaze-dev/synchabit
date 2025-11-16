

import React, { useState } from 'react';
import { Post } from '../types';
import { ENCOURAGEMENT_TEMPLATES, CURRENT_USER } from '../constants';
import Avatar from './Avatar';

interface FeedItemProps {
  post: Post;
  onSupport: (postId: string) => void;
  t: any;
}

function timeSince(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
}

const FeedItem: React.FC<FeedItemProps> = ({ post, onSupport, t }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const isCurrentUser = post.user.id === CURRENT_USER.id;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() === '') return;
    console.log(`New comment on post ${post.id}: ${commentText}`);
    setCommentText('');
  };
    
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <div className="flex items-start gap-4">
        <Avatar user={post.user} className="w-11 h-11" />
        <div className="w-full">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-slate-900">{post.user.name}</p>
              <p className="text-xs text-slate-500">{timeSince(post.timestamp)}</p>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-slate-800 whitespace-pre-wrap">{post.note}</p>
          </div>

          {post.imageUrl && (
            <img src={post.imageUrl} alt="Progress snapshot" className="mt-3 rounded-lg w-full object-cover max-h-80" />
          )}

          {isCurrentUser && post.streak > 0 && (
             <div className="mt-4">
                <span className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {post.streak}-{t.dayStreak}
                </span>
             </div>
          )}

          <div className="mt-4 flex items-center gap-6 text-slate-500">
            <button onClick={() => onSupport(post.id)} className="flex items-center gap-1.5 hover:text-brand-teal-600 transition-colors group">
              <span>🙌</span>
              <span className="text-sm font-semibold">{post.supports} {t.cheersLabel}</span>
            </button>
            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 hover:text-brand-blue-500 transition-colors">
              <span>💬</span>
              <span className="text-sm font-semibold">{post.comments.length} {post.comments.length === 1 ? t.comment : t.comments}</span>
            </button>
          </div>
          
          {showComments && (
            <div className="mt-4 space-y-3 pt-3 border-t border-slate-100">
              {post.comments.map((comment, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <Avatar user={comment.user} className="w-7 h-7" />
                  <div className="bg-slate-100 px-3 py-2 rounded-lg">
                    <span className="font-semibold text-slate-800">{comment.user.name}</span>
                    <p className="text-slate-600">{comment.text}</p>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <div className="flex flex-wrap gap-2 mb-2">
                    {ENCOURAGEMENT_TEMPLATES.map(template => (
                        <button key={template} onClick={() => setCommentText(template)} className="text-xs bg-brand-teal-100 text-brand-teal-800 px-2 py-1 rounded-full hover:bg-brand-teal-200">
                           ✨ {template}
                        </button>
                    ))}
                </div>
                <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
                  <Avatar user={CURRENT_USER} className="w-7 h-7" />
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={t.writeAnEncouragement}
                    className="w-full bg-slate-100 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
                  />
                  <button type="submit" className="text-brand-blue-600 hover:text-brand-blue-800">
                      <span className="text-2xl">➡️</span>
                  </button>
                </form>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedItem;