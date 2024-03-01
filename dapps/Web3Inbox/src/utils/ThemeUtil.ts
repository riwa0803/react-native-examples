import {SpacingType, ThemeKeys} from './TypesUtil';

export const LightTheme: {[key in ThemeKeys]: string} = {
  'accent-100': '#089C96',
  'accent-010': '#E5F5F4',
  'accent-glass-090': 'rgba(8, 156, 150, 0.9)',
  'accent-glass-080': 'rgba(8, 156, 150, 0.8)',
  'accent-glass-050': 'rgba(8, 156, 150, 0.5)',
  'accent-glass-020': 'rgba(8, 156, 150, 0.2)',
  'accent-glass-015': 'rgba(8, 156, 150, 0.15)',
  'accent-glass-010': 'rgba(8, 156, 150, 0.1)',
  'accent-glass-005': 'rgba(8, 156, 150, 0.05)',
  'accent-glass-002': 'rgba(8, 156, 150, 0.02)',

  'fg-100': '#141414',
  'fg-125': '#2d3131',
  'fg-150': '#474D4D',
  'fg-175': '#636d6d',
  'fg-200': '#798686',
  'fg-225': '#828f8f',
  'fg-250': '#8b9797',
  'fg-275': '#95a0a0',
  'fg-300': '#9ea9a9',

  'bg-100': '#ffffff',
  'bg-125': '#ffffff',
  'bg-150': '#f3f8f8',
  'bg-175': '#eef4f4',
  'bg-200': '#eaf1f1',
  'bg-225': '#e5eded',
  'bg-250': '#e1e9e9',
  'bg-275': '#dce7e7',
  'bg-300': '#d8e3e3',

  'inverse-100': '#ffffff',
  'inverse-000': '#000000',

  'error-100': '#ED4747',

  'gray-glass-001': 'rgba(255, 255, 255, 0.01)',
  'gray-glass-002': 'rgba(0, 0, 0, 0.02)',
  'gray-glass-005': 'rgba(0, 0, 0, 0.05)',
  'gray-glass-010': 'rgba(0, 0, 0, 0.1)',
  'gray-glass-015': 'rgba(0, 0, 0, 0.15)',
  'gray-glass-020': 'rgba(0, 0, 0, 0.2)',
  'gray-glass-025': 'rgba(0, 0, 0, 0.25)',
  'gray-glass-030': 'rgba(0, 0, 0, 0.3)',
  'gray-glass-060': 'rgba(0, 0, 0, 0.6)',
  'gray-glass-080': 'rgba(0, 0, 0, 0.8)',
  'gray-glass-090': 'rgba(0, 0, 0, 0.9)',
};

// TODO: Add dark colors
export const DarkTheme: {[key in ThemeKeys]: string} = {
  'accent-100': '#089C96',
  'accent-010': '#E5F5F4',
  'accent-glass-090': 'rgba(8, 156, 150, 0.9)',
  'accent-glass-080': 'rgba(8, 156, 150, 0.8)',
  'accent-glass-050': 'rgba(8, 156, 150, 0.5)',
  'accent-glass-020': 'rgba(8, 156, 150, 0.2)',
  'accent-glass-015': 'rgba(8, 156, 150, 0.15)',
  'accent-glass-010': 'rgba(8, 156, 150, 0.1)',
  'accent-glass-005': 'rgba(8, 156, 150, 0.05)',
  'accent-glass-002': 'rgba(8, 156, 150, 0.02)',

  'fg-100': '#141414',
  'fg-125': '#2d3131',
  'fg-150': '#474D4D',
  'fg-175': '#636d6d',
  'fg-200': '#798686',
  'fg-225': '#828f8f',
  'fg-250': '#8b9797',
  'fg-275': '#95a0a0',
  'fg-300': '#9ea9a9',

  'bg-100': '#ffffff',
  'bg-125': '#ffffff',
  'bg-150': '#f3f8f8',
  'bg-175': '#eef4f4',
  'bg-200': '#eaf1f1',
  'bg-225': '#e5eded',
  'bg-250': '#e1e9e9',
  'bg-275': '#dce7e7',
  'bg-300': '#d8e3e3',

  'inverse-100': '#ffffff',
  'inverse-000': '#000000',

  'error-100': '#ED4747',

  'gray-glass-001': 'rgba(255, 255, 255, 0.01)',
  'gray-glass-002': 'rgba(0, 0, 0, 0.02)',
  'gray-glass-005': 'rgba(0, 0, 0, 0.05)',
  'gray-glass-010': 'rgba(0, 0, 0, 0.1)',
  'gray-glass-015': 'rgba(0, 0, 0, 0.15)',
  'gray-glass-020': 'rgba(0, 0, 0, 0.2)',
  'gray-glass-025': 'rgba(0, 0, 0, 0.25)',
  'gray-glass-030': 'rgba(0, 0, 0, 0.3)',
  'gray-glass-060': 'rgba(0, 0, 0, 0.6)',
  'gray-glass-080': 'rgba(0, 0, 0, 0.8)',
  'gray-glass-090': 'rgba(0, 0, 0, 0.9)',
};

export const BorderRadius = {
  '5xs': 4,
  '4xs': 6,
  '3xs': 8,
  xxs: 12,
  xs: 16,
  s: 20,
  m: 28,
  l: 36,
  '3xl': 80,
};

export const Spacing: {[K in SpacingType]: number} = {
  '0': 0,
  '4xs': 2,
  '3xs': 4,
  '2xs': 6,
  xs: 8,
  s: 12,
  m: 14,
  l: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
};
