import * as React from 'react';

export class Error500 extends React.Component<any> {
    public render(): React.ReactNode {
        return (
            <div id="page-error">
                500 Error
            </div>
        );
    }
}