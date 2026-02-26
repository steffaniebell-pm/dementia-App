import React from 'react';
import { View, ViewProps } from 'react-native';

export const Card = ({ style, ...rest }: ViewProps) => {
  return (
    <View
      style={[
        {
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#E5E7EB',
        },
        style,
      ]}
      {...rest}
    />
  );
};