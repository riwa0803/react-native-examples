import * as React from 'react';
import {ScrollView, View} from 'react-native';
import useNotifyClientContext from '@/hooks/useNotifyClientContext';
import NotificationItemWithSubscription from './NotificationItemWithSubscription';
import {NotifyClientTypes} from '@walletconnect/notify-client';
import {InitializeNotifyClientButton} from './InitializeNotifyClientButton';

interface NotifyNotification {
  title: string;
  sentAt: number;
  body: string;
  id: string;
  url: string | null;
  type: string;
  subscription: NotifyClientTypes.NotifySubscription;
}

export default function NotificationsScreen() {
  const {subscriptions, notifications} = useNotifyClientContext();

  let allNotifications: NotifyNotification[] = [];
  Object.keys(notifications).forEach(key => {
    let notifsWithSubs = notifications[key].map((notif: NotifyNotification) => {
      return {
        ...notif,
        subscription: subscriptions.find(sub => sub.topic === key),
      };
    });
    allNotifications = allNotifications.concat(notifsWithSubs);
  });
  const sortedByDate = allNotifications?.sort(
    (a: NotifyNotification, b: NotifyNotification) => b.sentAt - a.sentAt,
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 16,
        gap: 16,
        backgroundColor: 'white',
      }}>
      <InitializeNotifyClientButton />
      {sortedByDate.map(item => (
        <NotificationItemWithSubscription
          key={item.id}
          title={item.title}
          description={item.body}
          url={item.url}
          subscription={item.subscription}
          onPress={() => {}}
          sentAt={item.sentAt}
        />
      ))}
    </ScrollView>
  );
}
