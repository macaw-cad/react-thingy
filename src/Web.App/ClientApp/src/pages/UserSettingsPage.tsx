import React, { useState, useEffect } from 'react';
import map from 'lodash/map';
import { Header } from '../sample/Header';
import { Footer } from '../sample/Footer';
import { getMockDataAllFlags, mockDataStorageKey, getMockDataFlags, mockDataEnvKey } from '../userSettings/MockDataFlags';

export const UserSettingsPage = () => {
    const [mockDataFlags, setMockDataFlags] = useState(getMockDataAllFlags());

    const hasMockEnvValue = () => {
        return !!process.env[mockDataEnvKey];
    };

    const allMockDataFlagsChecked = () => {
        const allMockFlagsValues: boolean[] = map(mockDataFlags);

        return allMockFlagsValues.indexOf(false) === -1;
    };

    const toggleMockDataFlag = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        const key = target.id;

        setMockDataFlags({ ...mockDataFlags, [key]: !mockDataFlags[key] });
    };

    const toggleAllMockDataFlags = () => {
        let toggledMockDataFlags = JSON.parse(JSON.stringify(mockDataFlags));

        Object.keys(toggledMockDataFlags).forEach((key: string) => {
            toggledMockDataFlags[key] = !allMockDataFlagsChecked();
        });

        setMockDataFlags({ ...toggledMockDataFlags });
    };

    const saveStateToStorage = () => {
        sessionStorage.setItem(mockDataStorageKey, JSON.stringify(mockDataFlags));
    };

    useEffect(() => {
        const storedMockDataFlags = getMockDataFlags();

        if (storedMockDataFlags) {
            setMockDataFlags(storedMockDataFlags);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        saveStateToStorage();
    }, [mockDataFlags]); // eslint-disable-line react-hooks/exhaustive-deps

    const inactiveStyle = { opacity: .7, pointerEvents: 'none', userSelect: 'none' } as React.CSSProperties;
    return (
        <>
            <Header />
            <div>
                <strong>Mock overwrite from .env file</strong> ({mockDataEnvKey})<br />
                {process.env[mockDataEnvKey] || 'undefined'}
                <br /><br /><br />

                {hasMockEnvValue()
                    &&
                    <>
                        {`Mock settings not changable because the mock data .env variable is set. This overrules all settings. In order to work with mock settings below, remove ${mockDataEnvKey} from the .env file or remove its value.`}
                        <br /><br />
                    </>
                }

                <div style={hasMockEnvValue() ? inactiveStyle : {}}>
                    <strong>Mock settings:</strong>
                    <ul>
                        <li>
                            <label htmlFor="selectAll">
                                <input type="checkbox" id="selectAll" checked={allMockDataFlagsChecked()} onChange={toggleAllMockDataFlags} />
                                (Un)select all
                                    </label>
                        </li>
                        {Object.keys(getMockDataAllFlags()).map((mockFlag, index) => {
                            return (
                                <li key={index}>
                                    <label htmlFor={mockFlag}>
                                        <input type="checkbox" name="mockflags" id={mockFlag} checked={mockDataFlags[mockFlag]} onChange={toggleMockDataFlag} />
                                        {mockFlag}
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
            <Footer />
        </>
    );
};