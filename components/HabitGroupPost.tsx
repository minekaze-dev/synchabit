import React, { useState } from 'react';
import { Post, User, Comment } from '../types';
import Avatar from './Avatar';
import Icon from './Icon';

function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

const CommentSection: React.FC<{
    post: Post;
    t: any;
    currentUser: User;
    onAddComment: (postId: string, commentText: string) => void;
    onHide: () => void;
}> = ({ post, t, currentUser, onAddComment, onHide }) => {
    const [commentText, setCommentText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddComment(post.id, commentText);
        setCommentText('');
    };

    return (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            {post.comments.map((comment, index) => (
                <div key={index} className="flex items-start gap-3">
                    <Avatar user={comment.user} className="w-8 h-8 flex-shrink-0" />
                    <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{comment.user.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{comment.text}</p>
                    </div>
                </div>
            ))}
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <Avatar user={currentUser} className="w-8 h-8 flex-shrink-0" />
                <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={t.addAComment}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-400 dark:text-slate-200 dark:placeholder:text-slate-400"
                />
                <button type="submit" className="p-2 text-brand-teal-500 hover:bg-brand-teal-50 dark:hover:bg-brand-teal-900/50 rounded-full transition-colors disabled:opacity-50" disabled={!commentText.trim()}>
                    <Icon name="send" className="w-6 h-6" />
                </button>
            </form>
             <button onClick={onHide} className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                {t.hideComments}
            </button>
        </div>
    );
};


const HabitGroupPost: React.FC<{ 
    post: Post; 
    t: any; 
    onViewUser: (user: User) => void;
    currentUser: User;
    onPostInteraction: (postId: string, interactionType: 'support' | 'push') => void;
    onAddComment: (postId: string, commentText: string) => void;
}> = ({ post, t, onViewUser, currentUser, onPostInteraction, onAddComment }) => {
    const [showComments, setShowComments] = useState(false);
    const hasSupported = post.supportedBy?.includes(currentUser.id);
    const hasPushed = post.pushedBy?.includes(currentUser.id);

    return (
        <div className="bg-white dark:bg-slate-900/70 p-5 rounded-xl shadow-sm">
            <div className="flex items-start gap-4">
                <button onClick={() => onViewUser(post.user)}>
                    <Avatar user={post.user} className="w-11 h-11" />
                </button>
                <div className="w-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <button onClick={() => onViewUser(post.user)} className="font-semibold text-slate-900 dark:text-slate-100 text-left hover:underline">{post.user.name}</button>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{formatTime(post.timestamp)}</p>
                        </div>
                    </div>

                    <div className="mt-3">
                         <p className="text-slate-800 dark:text-slate-300 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: post.note.replace(/#(\w+)/g, '<span class="text-red-500 font-semibold">#$1</span>') }} />
                    </div>

                    {post.imageUrl && (
                        <img src={post.imageUrl} alt="Progress snapshot" className="mt-3 rounded-lg w-full object-cover max-h-80" />
                    )}
                    
                    <div className="mt-4 flex items-center justify-between text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={() => onPostInteraction(post.id, 'support')}
                                className={`flex items-center gap-1.5 transition-colors group ${hasSupported ? 'text-amber-600 font-bold' : 'hover:text-amber-600'}`}>
                                <span>🙌</span>
                                <span className="text-sm font-semibold">{post.supports} {t.cheers}</span>
                            </button>
                             <button 
                                onClick={() => onPostInteraction(post.id, 'push')}
                                className={`flex items-center gap-1.5 transition-colors group ${hasPushed ? 'text-red-600 font-bold' : 'hover:text-red-600'}`}>
                                <span>🔥</span>
                                <span className="text-sm font-semibold">{post.pushes} {t.pushes}</span>
                            </button>
                            <button onClick={() => setShowComments(prev => !prev)} className="flex items-center gap-1.5 hover:text-brand-blue-500 transition-colors">
                                <span>💬</span>
                                <span className="text-sm font-semibold">{post.comments.length} {post.comments.length === 1 ? t.comment : t.comments}</span>
                            </button>
                        </div>
                        {post.streak > 0 && (
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                {post.streak} {t.dayStreakBadge}
                            </div>
                        )}
                    </div>

                    {showComments && (
                        <CommentSection 
                            post={post}
                            t={t}
                            currentUser={currentUser}
                            onAddComment={onAddComment}
                            onHide={() => setShowComments(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default HabitGroupPost;
