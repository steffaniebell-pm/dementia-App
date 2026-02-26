import React from 'react';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';
import { RoleProvider } from './providers/RoleProvider';
import { DbProvider } from './providers/DbProvider';
import { RootNavigator } from '../navigation/RootNavigator';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RoleProvider>
          <DbProvider>
            <RootNavigator />
          </DbProvider>
        </RoleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;