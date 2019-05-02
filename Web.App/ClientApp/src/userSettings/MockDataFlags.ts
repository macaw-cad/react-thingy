import { Environment } from './../Environment';

export type MockDataFlags = {
    [key: string]: boolean;
    starwarsPeople: boolean;
};

export const mockDataStorageKey = 'mockDataFlags';
export const mockDataEnvKey = 'REACT_APP_MOCK_DATA';

export function getMockDataAllFlags(): MockDataFlags {
    let mockFlags: MockDataFlags = {
        starwarsPeople: false
    };

    // Always overwrite when .env value is present
    const mockDataEnvValue = getMockDataEnvValue();
    if (mockDataEnvValue) {
        Object.keys(mockFlags).forEach(key => {
            mockFlags[key] = mockDataEnvValue;
        });
    }

    return mockFlags;
}

function getFlags<T>(key: string): null | T {
    let mockDataFlags = !Environment.isServer ? sessionStorage.getItem(key) : null;

    if (getMockDataEnvValue() === true || getMockDataEnvValue() === false) {
        mockDataFlags = JSON.stringify(getMockDataAllFlags());
    }
    
    if (!mockDataFlags) {
        return null;
    }

    try {
        return JSON.parse(mockDataFlags) as T;
    } catch {
        return null;
    }
}

export function getMockDataEnvValue(): boolean | undefined {
    const value = process.env[mockDataEnvKey];

    if (!value) {
        return undefined;
    }
    
    try {
        return JSON.parse(value);
    } catch (e) {
        throw new Error('Mock data env value is not valid JSON. Should be either true or false');
    }
}

export function getMockDataFlags(): null | MockDataFlags {
    return getFlags<MockDataFlags>(mockDataStorageKey);
}