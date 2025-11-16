import React from 'react';
import { Notification, User } from '../types';
import Avatar from './Avatar';

interface NotificationDropdownProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onClose: () => void;
  onAcceptRequest: (notification: Notification) => void;
  onDeclineRequest: (notification: Notification) => void;
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

const getNotificationText = (notification: Notification): React.ReactNode => {
    const actorName = <span className="font-bold">{notification.actor.name}</span>;
    switch (notification.type) {
        case 'comment':
            return <>{actorName} commented on your post.</>;
        case 'cheer':
            return <>{actorName} gave you a cheer!</>;
        case 'push':
            return <>{actorName} sent you a push.</>;
        case 'message':
            return <>{actorName} sent you a message.</>;
        case 'join_request':
            return <>{actorName} wants to join a habit group.</>
        default:
            return 'New notification';
    }
}

const NotificationItem: React.FC<{
    notification: Notification;
    onNotificationClick: (notification: Notification) => void;
    onAcceptRequest: (notification: Notification) => void;
    onDeclineRequest: (notification: Notification) => void;
    t: any;
}> = ({ notification, onNotificationClick, onAcceptRequest, onDeclineRequest, t }) => {
    
    const handleActionClick = (e: React.MouseEvent, action: 'accept' | 'decline') => {
        e.stopPropagation();
        if (action === 'accept') {
            onAcceptRequest(notification);
        } else {
            onDeclineRequest(notification);
        }
    };
    
    return (
        <div className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <button onClick={() => onNotificationClick(notification)} className="flex items-start gap-3 w-full">
                <div className="flex-shrink-0">
                    <Avatar user={notification.actor} className="w-10 h-10" />
                </div>
                <div className="flex-grow">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{getNotificationText(notification)}</p>
                    <p className="text-xs text-brand-teal-600 dark:text-brand-teal-400 font-semibold mt-0.5">{timeSince(notification.timestamp)}</p>
                </div>
                {!notification.isRead && (
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                )}
            </button>
            {notification.type === 'join_request' && (
                <div className="mt-3 flex justify-end gap-2">
                    <button onClick={(e) => handleActionClick(e, 'decline')} className="px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">
                        {t.decline}
                    </button>
                    <button onClick={(e) => handleActionClick(e, 'accept')} className="px-3 py-1 text-xs font-bold text-white bg-brand-teal-500 rounded-md hover:bg-brand-teal-600">
                        {t.accept}
                    </button>
                </div>
            )}
        </div>
    )
}

export default function NotificationDropdown({ notifications, onNotificationClick, onClose, onAcceptRequest, onDeclineRequest, t }: NotificationDropdownProps) {
    return (
        <div 
            className="absolute top-16 right-6 w-80 max-w-sm bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50"
        >
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">{t.notifications}</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400 text-sm text-center p-6">{t.noNotifications}</p>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {notifications.map(notification => (
                            <NotificationItem
                                key={notification.id} 
                                notification={notification}
                                onNotificationClick={onNotificationClick}
                                onAcceptRequest={onAcceptRequest}
                                onDeclineRequest={onDeclineRequest}
                                t={t}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}