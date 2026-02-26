import React from 'react';
import { View } from 'react-native';
import { AccessibilityText } from './AccessibilityText';

type Props = {
  name?: string;
  compact?: boolean;
  variant?: 'medical' | 'heart' | 'spark';
};

const iconByVariant: Record<NonNullable<Props['variant']>, string> = {
  medical: '♡+',
  heart: '❤',
  spark: '✦',
};

export const BrandMark = ({ name = 'CareCompanion', compact = false, variant = 'medical' }: Props) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          width: compact ? 30 : 34,
          height: compact ? 30 : 34,
          borderRadius: compact ? 10 : 12,
          backgroundColor: '#EEF2FF',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10,
        }}
      >
        <AccessibilityText style={{ color: '#4F46E5', fontSize: compact ? 13 : 15, fontWeight: '700' }}>{iconByVariant[variant]}</AccessibilityText>
      </View>
      <AccessibilityText style={{ color: '#312E81', fontSize: compact ? 15 : 17, fontWeight: '700' }}>
        {name}
      </AccessibilityText>
    </View>
  );
};
