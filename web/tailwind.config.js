/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // === COLORS ===
      colors: {
        // Brand colors
        'alman-blue': '#0052FF',
        'alman-orange': '#FF6B00',
        'humanity-white': '#F8F9FA',
        'alma-gray': '#212529',
        // Legacy aliases (for backward compatibility)
        'neos-blue': '#0052FF',
        'jeong-orange': '#FF6B00',
        'sapiens-gray': '#212529',

        // Cold spectrum (Technology/AI)
        cold: {
          navy: {
            900: '#0A0F1A',
            800: '#0f172a',
            700: '#1e293b',
            600: '#334155',
            500: '#475569',
          },
          blue: {
            600: '#0044CC',
            500: '#0052FF',
            400: '#3b82f6',
            300: '#60a5fa',
            200: '#93c5fd',
            100: '#dbeafe',
          },
          cyan: {
            500: '#06b6d4',
            400: '#22d3ee',
          },
        },

        // Warm spectrum (Human/Jeong)
        warm: {
          orange: {
            700: '#c2410c',
            600: '#ea580c',
            500: '#FF6B00',
            400: '#f97316',
            300: '#FB923C',
            200: '#fed7aa',
            100: '#fff7ed',
          },
          gold: {
            500: '#d4a574',
            400: '#e4b896',
            300: '#f5d5b8',
          },
          beige: {
            500: '#d4c4b0',
            400: '#e8ddd0',
            300: '#f5f0eb',
          },
        },

        // Semantic colors
        semantic: {
          success: '#4ade80',
          warning: '#facc15',
          error: '#f87171',
          info: '#60a5fa',
        },

        // Text colors
        text: {
          primary: '#e2e8f0',
          secondary: '#cbd5e1',
          muted: '#94a3b8',
          subtle: '#64748b',
        },
      },

      // === TYPOGRAPHY ===
      fontFamily: {
        'inter': ['Inter', 'Noto Sans KR', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'noto': ['Noto Sans KR', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'serif': ['Georgia', 'Cambria', 'serif'],
        // Legacy aliases (for backward compatibility)
        'montserrat': ['Inter', 'Noto Sans KR', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'pretendard': ['Noto Sans KR', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },

      // === SPACING ===
      spacing: {
        'section': '6rem',
        'section-sm': '4rem',
      },

      // === ANIMATIONS ===
      animation: {
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'glow-blue': 'glow-blue 2s ease-in-out infinite',
        'ripple': 'ripple 1s ease-out forwards',
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'dash': 'dash 3s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
        'slide-in-up': 'slide-in-up 0.3s ease-out forwards',
        'scale-in': 'scale-in 0.2s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },

      // === KEYFRAMES ===
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.15)' },
          '70%': { transform: 'scale(1)' },
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(255, 107, 0, 0.4), 0 0 40px rgba(255, 107, 0, 0.2)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(255, 107, 0, 0.6), 0 0 60px rgba(255, 107, 0, 0.3)',
          },
        },
        'glow-blue': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(0, 82, 255, 0.4), 0 0 40px rgba(0, 82, 255, 0.2)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(0, 82, 255, 0.6), 0 0 60px rgba(0, 82, 255, 0.3)',
          },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(3)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        dash: {
          '0%': { strokeDashoffset: '600' },
          '50%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '-600' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      // === BACKDROP BLUR ===
      backdropBlur: {
        xs: '2px',
      },

      // === TYPOGRAPHY (Prose) ===
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#e2e8f0',
            lineHeight: '1.75',

            // Headings
            h1: {
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '2.25rem',
              marginTop: '2rem',
              marginBottom: '1rem',
              lineHeight: '1.2',
            },
            h2: {
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '1.75rem',
              marginTop: '2.5rem',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottomWidth: '1px',
              borderBottomColor: '#334155',
            },
            h3: {
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '1.375rem',
              marginTop: '2rem',
              marginBottom: '0.75rem',
            },
            h4: {
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '1.125rem',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
            },

            // Paragraphs
            p: {
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
            },

            // Links
            a: {
              color: '#0052FF',
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: '#3b82f6',
                textDecoration: 'underline',
              },
            },

            // Strong
            strong: {
              color: '#ffffff',
              fontWeight: '600',
            },

            // Code inline
            code: {
              color: '#FF6B00',
              backgroundColor: '#1e293b',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              '&::before': { content: '""' },
              '&::after': { content: '""' },
            },

            // Code block
            pre: {
              backgroundColor: '#0f172a',
              borderWidth: '1px',
              borderColor: '#334155',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              overflow: 'auto',
              code: {
                backgroundColor: 'transparent',
                padding: '0',
                color: '#e2e8f0',
                fontSize: '0.875rem',
              },
            },

            // Blockquote
            blockquote: {
              borderLeftWidth: '4px',
              borderLeftColor: '#0052FF',
              paddingLeft: '1.5rem',
              fontStyle: 'italic',
              color: '#94a3b8',
              backgroundColor: '#0f172a',
              padding: '1rem 1.5rem',
              borderRadius: '0 0.5rem 0.5rem 0',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },

            // Lists
            ul: {
              listStyleType: 'none',
              paddingLeft: '0',
              'li': {
                position: 'relative',
                paddingLeft: '1.75rem',
                '&::before': {
                  content: '"▸"',
                  position: 'absolute',
                  left: '0',
                  color: '#0052FF',
                  fontWeight: 'bold',
                },
              },
            },
            ol: {
              paddingLeft: '1.25rem',
              'li': {
                paddingLeft: '0.5rem',
              },
              'li::marker': {
                color: '#0052FF',
                fontWeight: '600',
              },
            },
            li: {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            },

            // Horizontal rule
            hr: {
              borderColor: '#334155',
              marginTop: '2rem',
              marginBottom: '2rem',
            },

            // Tables
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
            },
            thead: {
              borderBottomWidth: '2px',
              borderBottomColor: '#334155',
            },
            'thead th': {
              color: '#ffffff',
              fontWeight: '600',
              backgroundColor: '#1e293b',
              padding: '0.75rem 1rem',
              textAlign: 'left',
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: '#1e293b',
            },
            'tbody tr:hover': {
              backgroundColor: '#0f172a',
            },
            'tbody td': {
              padding: '0.75rem 1rem',
              verticalAlign: 'top',
            },

            // Images
            img: {
              borderRadius: '0.75rem',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },

            // Figure
            figure: {
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            figcaption: {
              color: '#64748b',
              fontSize: '0.875rem',
              textAlign: 'center',
              marginTop: '0.75rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
