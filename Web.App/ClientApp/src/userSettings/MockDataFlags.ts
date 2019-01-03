import { Environment } from './../Environment';

export type MockDataFlags = {
    starwarsPeople: boolean;
};

export const mockDataStorageKey = 'mockDataFlags';

export function getMockDataAllFlags(): MockDataFlags {
    return {
        starwarsPeople: true
    };
}

function getFlags<T>(key: string): null | T {
    const mockDataFlags = !Environment.isServer ? sessionStorage.getItem(key) : null;
    
    if (!mockDataFlags) {
        return null;
    }

    try {
        return JSON.parse(mockDataFlags) as T;
    } catch {
        return null;
    }
}

export function getMockDataFlags(): null | MockDataFlags {
    return getFlags<MockDataFlags>(mockDataStorageKey);
}