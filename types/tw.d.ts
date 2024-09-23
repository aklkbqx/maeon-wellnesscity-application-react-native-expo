import 'tailwindcss-types/dist/tailwind-rn';
import { TwStyle } from 'twrnc';

declare module 'twrnc' {
  export interface tw {
    style: (...args: (TwStyle | false | null | undefined)[]) => TwStyle;
  }
}