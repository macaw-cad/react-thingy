import React from 'react';

type LoaderProps = {
    active: boolean;
};

type LoaderAllProps = LoaderProps;

export const Loader: React.FC<LoaderAllProps> = (props) => {
    return props.active ? (
        <div className="a-loader">
            <h2>LOADING</h2>
            <div className="a-loader__spinner" />
        </div>
    ) : null;
};