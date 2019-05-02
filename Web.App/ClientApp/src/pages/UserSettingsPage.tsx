import * as React from 'react';
import map from 'lodash/map';
import Header from '../sample/Header';
import Footer from '../sample/Footer';
import { getMockDataAllFlags, MockDataFlags, mockDataStorageKey, getMockDataFlags, mockDataEnvKey } from '../userSettings/MockDataFlags';

type UserSettingsPageState = {
    mockDataFlags: MockDataFlags;
};

class UserSettingsPage extends React.Component<{}, UserSettingsPageState> {
    public state: UserSettingsPageState = {
        mockDataFlags: getMockDataAllFlags()
    };

    public componentDidMount(): void {
        const mockDataFlags = getMockDataFlags();

        if (mockDataFlags) {
            this.setState({
                mockDataFlags: mockDataFlags
            });
        }
    }

    public render(): JSX.Element {
        const { mockDataFlags } = this.state;
        const inactiveStyle = { opacity: .7, pointerEvents: 'none', userSelect: 'none' } as React.CSSProperties;

        return (
            <>
                <Header />
                    <div>
                        <strong>Mock overwrite from .env file</strong> ({mockDataEnvKey})<br />
                        {process.env[mockDataEnvKey] || 'undefined'}
                        <br /><br /><br />

                        {this.hasMockEnvValue
                            && 
                            <>
                                {`Mock settings not changable because the mock data .env variable is set. This overrules all settings. In order to work with mock settings below, remove ${mockDataEnvKey} from the .env file or remove its value.`}
                                <br /><br />
                            </>
                        }

                        <div style={this.hasMockEnvValue ? inactiveStyle : {}}>
                            <strong>Mock settings:</strong>
                            <ul>
                                <li>
                                    <label htmlFor="selectAll">
                                        <input type="checkbox" id="selectAll" checked={this.allMockDataFlagsChecked} onChange={this.toggleAllMockDataFlags} />
                                        (Un)select all
                                    </label>
                                </li>
                                {Object.keys(getMockDataAllFlags()).map((mockFlag, index) => {
                                    return (
                                        <li key={index}>
                                            <label htmlFor={mockFlag}>
                                                <input type="checkbox" name="mockflags" id={mockFlag} checked={mockDataFlags[mockFlag]} onChange={this.toggleMockDataFlag} />
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
    }

    private get hasMockEnvValue(): boolean {
        return !!process.env[mockDataEnvKey];
    }
    
    private toggleMockDataFlag = (event: React.SyntheticEvent<HTMLInputElement>): void => {
        const target = event.target as HTMLInputElement;
        const key = target.id;

        this.setState(
            {
                mockDataFlags: { ...this.state.mockDataFlags, [key]: !this.state.mockDataFlags[key] }
            },
            this.saveStateToStorage
        );
    }

    private toggleAllMockDataFlags = (): void => {
        let toggledMockDataFlags = JSON.parse(JSON.stringify(this.state.mockDataFlags));

        Object.keys(toggledMockDataFlags).forEach((key: string) => {
            toggledMockDataFlags[key] = !this.allMockDataFlagsChecked;
        });

        this.setState(
            {
                mockDataFlags: { ...toggledMockDataFlags }
            },
            this.saveStateToStorage
        );
    }

    private get allMockDataFlagsChecked(): boolean {
        const allMockFlagsValues: boolean[] = map(this.state.mockDataFlags);

        return allMockFlagsValues.indexOf(false) === -1;
    }

    private saveStateToStorage(): void {
        sessionStorage.setItem(mockDataStorageKey, JSON.stringify(this.state.mockDataFlags));
    }
}

export default UserSettingsPage;