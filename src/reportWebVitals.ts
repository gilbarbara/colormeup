/* eslint-disable no-console */
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

onCLS(console.log);
onFCP(console.log);
onINP(console.log);
onLCP(console.log);
onTTFB(console.log);

export default function reportWebVitals(fn: Console['log']) {
  onCLS(fn);
  onFCP(fn);
  onINP(fn);
  onLCP(fn);
  onTTFB(fn);
}
