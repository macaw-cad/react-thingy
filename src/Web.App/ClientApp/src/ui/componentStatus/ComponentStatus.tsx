import React from 'react';
import { Loader } from '../loader/Loader';
import { Error, ErrorProps } from '../error/Error';

type ComponentStatusProps = {
    loading?: boolean[];
    data?: any[];
};

type ComponentStatusAllProps = ComponentStatusProps & ErrorProps;

export const ComponentStatus: React.FC<ComponentStatusAllProps> = (props) => {
    const { loading, data, message } = props;

    const isLoading = () => {
        if (!loading) {
            return false;
        }

        return loading.indexOf(true) > -1;
    };

    const hasError = () => {
        if (!data) {
            return false;
        }

        return !isLoading() && data.indexOf(null) > -1;
    };

    return (
        <>
            {hasError() &&
                <Error message={message} />
            }

            {isLoading() &&
                <Loader active={true} />
            }
        </>
    );
};