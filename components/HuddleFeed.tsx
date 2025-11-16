import React, { useState, useRef } from 'react';
// FIX: The 'Huddle' type does not exist. It has been replaced with 'HabitGroup'.
import { HabitGroup, Post, User } from '../types';
import Avatar from './Avatar';
import Icon from './Icon';

function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

const HuddlePost: React.FC<{ post: Post; t: any; onViewUser: (user: User) => void; }> = ({ post, t, onViewUser }) => {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm">
            <div className="flex items-start gap-4">
                <button onClick={() => onViewUser(post.user)}>
                    <Avatar user={post.user} className="w-11 h-11" />
                </button>
                <div className="w-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <button onClick={() => onViewUser(post.user)} className="font-semibold text-slate-900 text-left hover:underline">{post.user.name}</button>
                            <p className="text-xs text-slate-500">{formatTime(post.timestamp)}</p>
                        </div>
                    </div>

                    <div className="mt-3">
                         <p className="text-slate-800 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: post.note.replace(/#(\w+)/g, '<span class="text-red-500 font-semibold">#$1</span>') }} />
                    </div>

                    {post.imageUrl && (
                        <img src={post.imageUrl} alt="Progress snapshot" className="mt-3 rounded-lg w-full object-cover max-h-80" />
                    )}
                    
                    <div className="mt-4 flex items-center justify-between text-slate-500">
                        <div className="flex items-center gap-6">
                            <button className="flex items-center gap-1.5 hover:text-amber-600 transition-colors group">
                                <span>🙌</span>
                                <span className="text-sm font-semibold">{post.supports} {t.cheers}</span>
                            </button>
                             <button className="flex items-center gap-1.5 hover:text-red-600 transition-colors group">
                                <span>🔥</span>
                                <span className="text-sm font-semibold">{post.pushes} {t.pushes}</span>
                            </button>
                            <button className="flex items-center gap-1.5 hover:text-brand-blue-500 transition-colors">
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
                </div>
            </div>
        </div>
    );
};

const ShareProgressForm: React.FC<{ onAddPost: (note: string, imageUrl?: string) => void; t: any, currentUser: User }> = ({ onAddPost, t, currentUser }) => {
    const [note, setNote] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (note.trim() || imagePreview) {
            onAddPost(note, imagePreview || undefined);
            setNote('');
            setImagePreview(null);
            if(fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className="bg-white p-3 border-t border-slate-200">
            <form onSubmit={handleSubmit}>
                {imagePreview && (
                    <div className="relative mb-2 w-24 ml-12">
                        <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />
                        <button
                            type="button"
                            onClick={() => {
                                setImagePreview(null);
                                if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 h-6 w-6 flex items-center justify-center text-sm"
                            aria-label="Remove image"
                        >
                            &times;
                        </button>
                    </div>
                )}
                <div className="flex items-center gap-3">
                    <Avatar user={currentUser} className="w-9 h-9" />
                    <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={t.shareYourProgress}
                        className="w-full bg-slate-100 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-400"
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                    />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-500 hover:text-brand-teal-500 hover:bg-slate-100 rounded-full transition-colors">
                        <Icon name="gallery" className="w-6 h-6" />
                    </button>
                    <button type="submit" className="p-2 text-brand-teal-500 hover:bg-brand-teal-50 rounded-full transition-colors">
                        <Icon name="send" className="w-6 h-6" />
                    </button>
                </div>
            </form>
        </div>
    );
};

interface HuddleFeedProps {
    // FIX: The 'Huddle' type does not exist. It has been replaced with 'HabitGroup'.
    huddle: HabitGroup;
    posts: Post[];
    onAddPost: (huddleId: string, note: string, imageUrl?: string) => void;
    t: any;
    onViewUser: (user: User) => void;
    currentUser: User;
    // FIX: The 'Huddle' type does not exist. It has been replaced with 'HabitGroup'.
    onOpenManagementModal: (huddle: HabitGroup) => void;
}

export default function HuddleFeed({ huddle, posts, onAddPost, t, onViewUser, currentUser, onOpenManagementModal }: HuddleFeedProps) {
    const isCreator = currentUser.id === huddle.creator.id;
    return (
        <div className="h-full flex flex-col relative">
            <div className="flex-shrink-0 px-1 pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{huddle.name}</h1>
                        <p className="text-slate-500 mt-1">{huddle.description}</p>
                    </div>
                    {isCreator && (
                        <button 
                            onClick={() => onOpenManagementModal(huddle)}
                            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                            aria-label={t.manageHabit}
                        >
                            <Icon name="settings" className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pb-48 -mr-4 pr-4">
                {posts.map(post => (
                    <HuddlePost key={post.id} post={post} t={t} onViewUser={onViewUser} />
                ))}
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 -mx-4 sm:-mx-6">
                <ShareProgressForm onAddPost={(note, imageUrl) => onAddPost(huddle.id, note, imageUrl)} t={t} currentUser={currentUser} />
            </div>
        </div>
    );
}