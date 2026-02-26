import React, { createContext, useContext, useMemo } from 'react';
import { tokens } from '../../theme/tokens';

type ThemeContextValue = {
  tokens: typeof tokens;
};

const ThemeContext = createContext<ThemeContextValue>({ tokens });

export const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  const value = useMemo(() => ({ tokens }), []);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);