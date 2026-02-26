import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import { AccessibilityText } from './AccessibilityText';

type Props = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
};

export const LargeButton = ({ label, onPress, style, disabled = false }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          backgroundColor: disabled ? '#93C5FD' : '#2563EB',
          borderRadius: 12,
          paddingVertical: 16,
          paddingHorizontal: 18,
          alignItems: 'center',
          marginBottom: 10,
          opacity: disabled ? 0.8 : 1,
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <AccessibilityText style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600' }}>
        {label}
      </AccessibilityText>
    </Pressable>
  );
};