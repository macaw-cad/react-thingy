import * as React from 'react';

export const Sheep = ({name = 'Serge'}) => {
    let text = '- and my name is ' + name;
    return (
    <div>
        <p>beep beep I'm a sheep <a onClick={() => alert('Im clicked')}>{text}</a></p>
    </div>
    );
};