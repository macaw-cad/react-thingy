import * as React from 'react';

export class Error500 extends React.Component<any> {
    public render(): JSX.Element {
        return (
            <div id="page-error">
                500 Error
            </div>
        );
    }
}