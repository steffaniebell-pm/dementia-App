import React from 'react';
import { FeatureTileBase } from '../common/FeatureTileBase';

type Props = {
  label: string;
  icon: string;
  onPress: () => void;
};

export const CaregiverActionTile = ({ label, icon, onPress }: Props) => {
  return <FeatureTileBase label={label} icon={icon} onPress={onPress} />;
};
