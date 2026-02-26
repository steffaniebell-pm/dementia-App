import React from 'react';
import { Text, TextProps } from 'react-native';

type Props = TextProps & {
  children: React.ReactNode;
};

export const AccessibilityText = ({ children, style, ...rest }: Props) => {
  return (
    <Text allowFontScaling maxFontSizeMultiplier={1.6} style={style} {...rest}>
      {children}
    </Text>
  );
};