import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { later, LaterPromise } from './later';
import { Environment } from '../Environment';

type LaterTextProps = {
    message: string;
};

export const LaterText: React.FC<LaterTextProps> = (props) => {
    const [text, setText] = useState(props.message);
    let laterContext: MutableRefObject<LaterPromise | undefined> = useRef(undefined);

    const setLaterText = () => {
        laterContext.current = later(1000, () => {
            setText('This is the later text after 1 second');
            laterContext.current = undefined;
        });
    };

    const clearLaterText = () => {
        if (laterContext.current) {
            laterContext.current.cancel();
        }
    };

    if (Environment.isServer) {
        setLaterText();
    }

    useEffect(() => {
        setLaterText();

        return function cleanup() {
           clearLaterText();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            LaterText: {text}
        </div>
    );
};
