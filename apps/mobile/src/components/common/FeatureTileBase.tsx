import React from 'react';
import { Pressable, View } from 'react-native';
import { AccessibilityText } from './AccessibilityText';

type Props = {
  label: string;
  icon: string;
  onPress: () => void;
};

export const FeatureTileBase = ({ label, icon, onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{
        width: '48%',
        backgroundColor: '#B8CEDB',
        borderWidth: 1,
        borderColor: '#B8CEDB',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 14,
        alignItems: 'center',
        marginBottom: 12,
      }}
    >
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 12,
          backgroundColor: '#B8CEDB',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AccessibilityText style={{ fontSize: 22 }}>{icon}</AccessibilityText>
      </View>
      <AccessibilityText style={{ marginTop: 12, fontSize: 18, fontWeight: '600', color: '#4D217A' }}>
        {label}
      </AccessibilityText>
    </Pressable>
  );
};
