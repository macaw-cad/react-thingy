import React from 'react';
import { FormattedMessage } from 'react-intl';

export type ErrorProps = {
    message?: string;
};

type ErrorAllProps = ErrorProps;

export const Error: React.FC<ErrorAllProps> = (props) => {
    const getErrorMessage = () => {
        return <FormattedMessage id={props.message || 'Component.error'} defaultMessage="Error receiving the data" />;
    };

    return (
        <div className="a-error">
            {getErrorMessage()}
        </div>
    );
};