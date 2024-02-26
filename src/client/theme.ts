import { extendTheme } from '@mui/joy/styles';

export default extendTheme({
  "colorSchemes": {
    "light": {
      "palette": {
        // "primary": {
        //   "plainColor": "var(--joy-palette-primary-500)"
        // },
        // "danger": {
        //   "softBg": "var(--joy-palette-danger-200)",
        //   "softHoverBg": "var(--joy-palette-danger-300)",
        //   "softActiveBg": "var(--joy-palette-danger-300)"
        // }
      }
    },
    "dark": {
      "palette": {}
    }
  },
  fontFamily: {
    display: "'Inter', var(--joy-fontFamily-fallback)",
    body: "'Inter', var(--joy-fontFamily-fallback)",
  },
});
