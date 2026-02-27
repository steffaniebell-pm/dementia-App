import React from 'react';
import { View } from 'react-native';
import { AccessibilityText } from '../common/AccessibilityText';

type Props = {
  label: string;
  value: string;
};

export const SnapshotRow = ({ label, value }: Props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#B8CEDB',
      }}
    >
      <AccessibilityText style={{ fontSize: 16, color: '#4D217A' }}>{label}</AccessibilityText>
      <AccessibilityText style={{ fontSize: 16, fontWeight: '600' }}>{value}</AccessibilityText>
    </View>
  );
};