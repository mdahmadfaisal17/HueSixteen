const extendedConfig = {
  boxShadow: {
    'header_shadow': '0px 1px 3px 0px rgba(0, 0, 0, 0.1)'
  },
  colors: {
    dark_black: "#0C0B10",
    purple_blue: "#4E29FF",
    purple: "#F0EDFF",
    blue: "#D3D546",
    orange: "#FC7035",
    green: "#6DA951",
    pink: "#FCEE28",
    blue_gradient: "#F0EDFF",
    yellow_gradient: "#FCEE28",
    paleYellow: "#FCEE28",
    dark_yellow_gradient: "#6DA951",
    dark_blue_gradient: "#0C0B10"
  },
  screens: {
    "Xsm": "425px",
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1024px",
    "2xl": "1440px"
  },
  spacing: {
    25: '25rem',
    3.75: '3.75rem',
    6.5: '6.5rem',
    18.75: '18.75rem',
    31.25: '31.25rem',
    48: '48rem',
    50: '50rem',
    38: '38rem',
    32: '32rem',
  },
  keyframes: {
    'accordion-down': {
      from: {
        height: '0'
      },
      to: {
        height: 'var(--radix-accordion-content-height)'
      }
    },
    'accordion-up': {
      from: {
        height: 'var(--radix-accordion-content-height)'
      },
      to: {
        height: '0'
      }
    }
  },
  animation: {
    'accordion-down': 'accordion-down 0.2s ease-out',
    'accordion-up': 'accordion-up 0.2s ease-out'
  }
}

export { extendedConfig }