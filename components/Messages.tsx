

import React, { useState, useEffect } from 'react';
import { Conversation, User, ChatMessage } from '../types';
import Avatar from './Avatar';

const ConversationListItem: React.FC<{ conversation: Conversation; isActive: boolean; onSelect: () => void; currentUser: User; }> = ({ conversation, isActive, onSelect, currentUser }) => {
    const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
    if (!otherParticipant) return null;

    const lastMessage = conversation.messages[conversation.messages.length - 1];

    return (
        <button onClick={onSelect} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${isActive ? 'bg-brand-teal-100 dark:bg-brand-teal-950' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <Avatar user={otherParticipant} className="w-12 h-12 flex-shrink-0" />
            <div className="flex-grow overflow-hidden">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 truncate">{otherParticipant.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{lastMessage?.text}</p>
            </div>
        </button>
    );
};

const ChatBubble: React.FC<{ message: ChatMessage; isOwnMessage: boolean; sender: User; }> = ({ message, isOwnMessage, sender }) => (
    <div className={`flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        {!isOwnMessage && <Avatar user={sender} className="w-8 h-8" />}
        <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${isOwnMessage ? 'bg-brand-teal-500 text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
            <p>{message.text}</p>
        </div>
    </div>
);

interface MessagesProps {
  conversations: Conversation[];
  currentUser: User;
  t: any;
  onViewUser: (user: User) => void;
  initialSelectedConversationId?: string | null;
}

export default function Messages({ conversations, currentUser, t, onViewUser, initialSelectedConversationId }: MessagesProps) {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialSelectedConversationId || (conversations.length > 0 ? conversations[0].id : null));

    useEffect(() => {
        if (initialSelectedConversationId) {
            setSelectedConversationId(initialSelectedConversationId);
        }
    }, [initialSelectedConversationId]);

    const selectedConversation = conversations.find(c => c.id === selectedConversationId);
    const usersById = conversations.flatMap(c => c.participants).reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {} as Record<string, User>);

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex-shrink-0">{t.messages}</h1>
            <div className="flex-1 flex border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <aside className="w-1/3 border-r border-slate-200 dark:border-slate-800 p-3 flex flex-col">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 px-2 pb-2">{t.allChats}</h2>
                    <div className="overflow-y-auto space-y-1">
                        {conversations.map(conv => (
                            <ConversationListItem 
                                key={conv.id}
                                conversation={conv}
                                isActive={conv.id === selectedConversationId}
                                onSelect={() => setSelectedConversationId(conv.id)}
                                currentUser={currentUser}
                            />
                        ))}
                    </div>
                </aside>
                <main className="w-2/3 flex flex-col bg-white dark:bg-slate-900">
                    {selectedConversation ? (
                        <>
                            <header className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                                <Avatar user={selectedConversation.participants.find(p => p.id !== currentUser.id)!} className="w-10 h-10" />
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200">{selectedConversation.participants.find(p => p.id !== currentUser.id)!.name}</h3>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">{t.online}</span>
                                </div>
                            </header>
                            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                                {selectedConversation.messages.map(msg => (
                                    <ChatBubble 
                                        key={msg.id}
                                        message={msg}
                                        isOwnMessage={msg.senderId === currentUser.id}
                                        sender={usersById[msg.senderId]}
                                    />
                                ))}
                            </div>
                            <footer className="p-4 border-t border-slate-200 dark:border-slate-800">
                                <input 
                                    type="text"
                                    placeholder={t.typeAMessage}
                                    className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-400 dark:text-slate-200"
                                />
                            </footer>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">{t.selectConversation}</div>
                    )}
                </main>
            </div>
        </div>
    );
}