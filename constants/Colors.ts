/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#000';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    borderColor: '#fff',
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    borderColor: '#000'
  },

    general: {
    error: '#fb4444',
    missingMediaBackground: '#1c1c1c',
    unreadNotif: '#292929ff',
    readNotif: '#1c1c1c',
    semiVisibleText: '#292929ff',
    schoolChip: '#fbbf24',
    levelChip: '#fb2448ff',
    postSelectBackground: '#fbbf24',
    projectSelectBackground: '#0c8de2ff',
  },


};
