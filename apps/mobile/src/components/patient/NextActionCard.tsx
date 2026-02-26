import React from 'react';
import { Card } from '../common/Card';
import { AccessibilityText } from '../common/AccessibilityText';
import { LargeButton } from '../common/LargeButton';

type Props = {
  title: string;
  dueText: string;
  ctaLabel: string;
  onPress: () => void;
};

export const NextActionCard = ({ title, dueText, ctaLabel, onPress }: Props) => {
  return (
    <Card>
      <AccessibilityText style={{ fontSize: 14, color: '#6B7280' }}>Next Action</AccessibilityText>
      <AccessibilityText style={{ fontSize: 24, fontWeight: '700', marginTop: 4 }}>{title}</AccessibilityText>
      <AccessibilityText style={{ fontSize: 16, color: '#374151', marginTop: 4 }}>{dueText}</AccessibilityText>
      <LargeButton label={ctaLabel} onPress={onPress} style={{ marginTop: 12, marginBottom: 0 }} />
    </Card>
  );
};