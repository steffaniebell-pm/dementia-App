import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import { AccessibilityText } from './AccessibilityText';

type Props = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
};

export const LargeButton = ({ label, onPress, style }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          backgroundColor: '#2563EB',
          borderRadius: 12,
          paddingVertical: 16,
          paddingHorizontal: 18,
          alignItems: 'center',
          marginBottom: 10,
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <AccessibilityText style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600' }}>
        {label}
      </AccessibilityText>
    </Pressable>
  );
};