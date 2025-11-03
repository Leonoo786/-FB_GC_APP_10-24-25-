import { useMemo } from 'react';
import { isEqual } from 'firebase/firestore';

export function useMemoFirebase<T>(value: T | null): T | null {
  return useMemo(() => value, [JSON.stringify(value, (key, val) => {
    if (val && typeof val === 'object' && val.hasOwnProperty('_query')) {
      return val._query;
    }
    return val;
  })]);
}
