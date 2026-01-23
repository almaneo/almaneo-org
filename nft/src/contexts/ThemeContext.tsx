import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import type { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

// AlmaNEO Color Palette - "Cold Code, Warm Soul"
// Cold (기술/AI): Blue tones
// Warm (인간/정): Orange/Gold tones
const lightColors = {
  primary: {
    main: '#0052FF',      // AlmaNEO Blue
    light: '#3377FF',     // Light Blue
    dark: '#0041CC',      // Dark Blue
  },
  secondary: {
    main: '#FF6B00',      // Jeong Orange
    light: '#FF8533',     // Light Orange
    dark: '#CC5500',      // Dark Orange
  },
  accent: {
    main: '#06b6d4',      // Cyan
    light: '#22d3ee',     // Light Cyan
    dark: '#0891b2',      // Dark Cyan
  },
};

const darkColors = {
  primary: {
    main: '#0052FF',      // AlmaNEO Blue
    light: '#3377FF',     // Light Blue
    dark: '#0041CC',      // Dark Blue
  },
  secondary: {
    main: '#FF6B00',      // Jeong Orange
    light: '#FF8533',     // Light Orange
    dark: '#CC5500',      // Dark Orange
  },
  accent: {
    main: '#06b6d4',      // Cyan
    light: '#22d3ee',     // Light Cyan
    dark: '#0891b2',      // Dark Cyan
  },
};

const getDesignTokens = (mode: PaletteMode) => {
  const colors = mode === 'light' ? lightColors : darkColors;

  return {
    palette: {
      mode,
      primary: colors.primary,
      secondary: colors.secondary,
      ...(mode === 'light'
        ? {
          background: {
            default: '#f8fafc',
            paper: '#FFFFFF',
          },
          text: {
            primary: '#0f172a',
            secondary: '#475569',
          },
          success: { main: '#4ade80' },
          error: { main: '#f87171' },
          warning: { main: '#facc15' },
          info: { main: '#60a5fa' },
        }
        : {
          background: {
            default: '#0A0F1A',     // Deep Navy (Alma)
            paper: '#111827',       // Slate 900
          },
          text: {
            primary: '#e2e8f0',     // Slate 200
            secondary: '#94a3b8',   // Slate 400
          },
          success: { main: '#4ade80' },
          error: { main: '#f87171' },
          warning: { main: '#facc15' },
          info: { main: '#60a5fa' },
          divider: 'rgba(255, 255, 255, 0.1)',
        }),
    },
    typography: {
      fontFamily: '"Pretendard", "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h1: {
        fontSize: '3.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
        fontFamily: '"Montserrat", sans-serif',
      },
      h2: {
        fontSize: '2.5rem',
        fontWeight: 600,
        lineHeight: 1.3,
        fontFamily: '"Montserrat", sans-serif',
      },
      h3: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.4,
        fontFamily: '"Montserrat", sans-serif',
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      button: {
        textTransform: 'none' as const,
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    spacing: 8,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none' as const,
            fontWeight: 600,
            borderRadius: 12,
            padding: '10px 24px',
            fontSize: '1rem',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: mode === 'light'
                ? '0 4px 12px rgba(0, 82, 255, 0.3)'
                : '0 4px 16px rgba(0, 82, 255, 0.4)',
            },
          },
          containedSecondary: {
            background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(255, 107, 0, 0.4)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: mode === 'light'
            ? {
              borderRadius: 16,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }
            : {
              borderRadius: 16,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: mode === 'light'
            ? {
              backgroundColor: '#FFFFFF',
              color: '#0f172a',
            }
            : {
              backgroundImage: 'none',
              backgroundColor: 'rgba(10, 15, 26, 0.95)',
              backdropFilter: 'blur(12px)',
              color: '#e2e8f0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            paddingLeft: 16,
            paddingRight: 16,
          },
        },
      },
    },
  };
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('almaneo-nft-theme');
    return (savedMode as PaletteMode) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('almaneo-nft-theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
