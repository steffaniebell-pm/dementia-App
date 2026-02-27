import React from 'react';
import { Card } from '../common/Card';
import { AccessibilityText } from '../common/AccessibilityText';

type Props = {
  icon: string;
  location: string;
  temperature: string;
  condition: string;
};

export const WeatherInfoCard = ({ icon, location, temperature, condition }: Props) => {
  return (
    <Card style={{ paddingVertical: 10 }}>
      <AccessibilityText numberOfLines={1} style={{ fontSize: 14, color: '#4D217A' }}>
        {`${icon} ${location} • ${temperature} • ${condition}`}
      </AccessibilityText>
    </Card>
  );
};
