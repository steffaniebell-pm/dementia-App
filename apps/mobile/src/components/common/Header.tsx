import React from 'react';
import { View } from 'react-native';
import { AccessibilityText } from './AccessibilityText';
import { BrandMark } from './BrandMark';

type Props = {
  title: string;
  subtitle?: string;
  showBrand?: boolean;
  brandVariant?: 'medical' | 'heart' | 'spark';
};

export const Header = ({ title, subtitle, showBrand = false, brandVariant = 'medical' }: Props) => {
  return (
    <View style={{ marginBottom: 18 }}>
      {showBrand ? (
        <View style={{ marginBottom: 10 }}>
          <BrandMark compact variant={brandVariant} />
        </View>
      ) : null}
      <AccessibilityText style={{ fontSize: 28, fontWeight: '700', color: '#111827' }}>{title}</AccessibilityText>
      {subtitle ? (
        <AccessibilityText style={{ fontSize: 15, color: '#4B5563', marginTop: 6, lineHeight: 21 }}>
          {subtitle}
        </AccessibilityText>
      ) : null}
    </View>
  );
};