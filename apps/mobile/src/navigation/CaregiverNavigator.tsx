import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../screens/caregiver/DashboardScreen';
import { ManageMedsScreen } from '../screens/caregiver/ManageMedsScreen';
import { ManageCalendarScreen } from '../screens/caregiver/ManageCalendarScreen';
import { ReportsScreen } from '../screens/caregiver/ReportsScreen';
import { EmergencyInfoScreen } from '../screens/caregiver/EmergencyInfoScreen';
import { PairingScreen } from '../screens/caregiver/PairingScreen';
import { SettingsScreen } from '../screens/caregiver/SettingsScreen';

export type CaregiverStackParamList = {
  Dashboard: undefined;
  ManageMeds: undefined;
  ManageCalendar: undefined;
  Reports: undefined;
  EmergencyInfo: undefined;
  Pairing: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<CaregiverStackParamList>();

export const CaregiverNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="ManageMeds" component={ManageMedsScreen} options={{ title: 'Manage Meds' }} />
      <Stack.Screen name="ManageCalendar" component={ManageCalendarScreen} options={{ title: 'Calendar' }} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="EmergencyInfo" component={EmergencyInfoScreen} options={{ title: 'Emergency Info' }} />
      <Stack.Screen name="Pairing" component={PairingScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};