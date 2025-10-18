
'use client';

import { useState, useEffect } from 'react';

function getValue<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') {
        return defaultValue;
    }
    const storedValue = window.localStorage.getItem(key);
    try {
        return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
        console.error(`Error parsing localStorage key “${key}”:`, error);
        return defaultValue;
    }
}

export function useLocalStorage<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState(() => getValue(key, defaultValue));

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}
