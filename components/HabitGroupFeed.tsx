import React, { useState, useRef } from 'react';
import { HabitGroup, Post, User } from '../types';
import Avatar from './Avatar';
import Icon from './Icon';
import HabitGroupPost from './HabitGroupPost';

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
        <div className="bg-white dark:bg-slate-900 p-3 border-t border-slate-200 dark:border-slate-800">
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
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-400 dark:text-slate-200 dark:placeholder:text-slate-400"
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                    />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-500 dark:text-slate-400 hover:text-brand-teal-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <Icon name="gallery" className="w-6 h-6" />
                    </button>
                    <button type="submit" className="p-2 text-brand-teal-500 hover:bg-brand-teal-50 dark:hover:bg-brand-teal-900/50 rounded-full transition-colors">
                        <Icon name="send" className="w-6 h-6" />
                    </button>
                </div>
            </form>
        </div>
    );
};

interface HabitGroupFeedProps {
    habitGroup: HabitGroup;
    posts: Post[];
    onAddPost: (habitGroupId: string, note: string, imageUrl?: string) => void;
    t: any;
    onViewUser: (user: User) => void;
    currentUser: User;
    onOpenManagementModal: (habitGroup: HabitGroup) => void;
    onPostInteraction: (postId: string, interactionType: 'support' | 'push') => void;
    onAddComment: (postId: string, commentText: string) => void;
}

export default function HabitGroupFeed({ habitGroup, posts, onAddPost, t, onViewUser, currentUser, onOpenManagementModal, onPostInteraction, onAddComment }: HabitGroupFeedProps) {
    const isCreator = currentUser.id === habitGroup.creator.id;
    const isMember = habitGroup.members.some(m => m.id === currentUser.id);
    const canSeeSettings = isCreator || isMember;

    return (
        <div className="h-full flex flex-col relative">
            <div className="flex-shrink-0 px-1 pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{habitGroup.name}</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">{habitGroup.description}</p>
                    </div>
                    {canSeeSettings && (
                        <button 
                            onClick={() => onOpenManagementModal(habitGroup)}
                            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition-colors"
                            aria-label={t.manageHabitGroup}
                        >
                            <Icon name="settings" className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pb-48 -mr-4 pr-4">
                {posts.map(post => (
                    <HabitGroupPost 
                        key={post.id} 
                        post={post} 
                        t={t} 
                        onViewUser={onViewUser} 
                        currentUser={currentUser}
                        onPostInteraction={onPostInteraction}
                        onAddComment={onAddComment}
                    />
                ))}
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 -mx-4 sm:-mx-6">
                <ShareProgressForm onAddPost={(note, imageUrl) => onAddPost(habitGroup.id, note, imageUrl)} t={t} currentUser={currentUser} />
            </div>
        </div>
    );
}