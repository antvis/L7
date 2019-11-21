import React from 'react';
export interface NotificationProps {
    index?: number;
    type: string;
    title: string;
    date: string;
    link: string;
}
declare const Notification: React.FC<NotificationProps>;
export default Notification;
