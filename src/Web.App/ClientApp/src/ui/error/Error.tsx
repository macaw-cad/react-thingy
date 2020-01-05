import * as React from 'react'; 
import { FormattedMessage } from 'react-intl';

export type ErrorProps = {
    message?: string;
};

type ErrorAllProps = ErrorProps;

export class Error extends React.Component<ErrorAllProps> {
    public render(): JSX.Element {
        return (
            <div className="a-error">
                {this.getErrorMessage()}
            </div>
        );
    }

    private getErrorMessage(): JSX.Element {
        return <FormattedMessage id={this.props.message || 'Component.error'} defaultMessage="Error receiving the data" />;
    }
}