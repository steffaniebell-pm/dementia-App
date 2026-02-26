import { Alert } from 'react-native';

type ConfirmDestructiveActionParams = {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
};

export const confirmDestructiveAction = ({
  title,
  message,
  confirmLabel,
  onConfirm,
}: ConfirmDestructiveActionParams): void => {
  Alert.alert(title, message, [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    {
      text: confirmLabel,
      style: 'destructive',
      onPress: onConfirm,
    },
  ]);
};