// Temporary debug file - create this as src/debug.tsx to see available components
import * as RelumeUI from '@relume_io/relume-ui';

console.log('Available Relume components:', Object.keys(RelumeUI));

// You can also try these common component names:
// Header, HeaderOne, Hero, Layout1, etc.

export default function Debug() {
  return <div>Check console for available components</div>;
}