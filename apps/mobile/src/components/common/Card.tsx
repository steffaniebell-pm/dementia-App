import React from 'react';
import { View, ViewProps } from 'react-native';

export const Card = ({ style, ...rest }: ViewProps) => {
  return (
    <View
      style={[
        {
          backgroundColor: '#B8CEDB',
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#B8CEDB',
        },
        style,
      ]}
      {...rest}
    />
  );
};