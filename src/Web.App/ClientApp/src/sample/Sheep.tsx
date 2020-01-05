import * as React from 'react';

type SheepProps = {
    name: string;
};

export const Sheep: React.FunctionComponent<SheepProps> = ({ name = 'Serge' }) => {
    let text = '- and my name is ' + name;
    return (
        <div>
            <p>beep beep I'm a sheep <span onClick={() => alert('Im clicked')}>{text}</span></p>
        </div>
    );
};