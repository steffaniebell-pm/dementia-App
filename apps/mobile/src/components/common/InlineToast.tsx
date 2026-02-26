import React from 'react';
import { Card } from './Card';
import { AccessibilityText } from './AccessibilityText';

type Props = {
  message: string | null;
};

export const InlineToast = ({ message }: Props) => {
  if (!message) {
    return null;
  }

  return (
    <Card>
      <AccessibilityText>{message}</AccessibilityText>
    </Card>
  );
};