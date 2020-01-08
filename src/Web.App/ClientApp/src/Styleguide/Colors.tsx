import React from 'react';
import { colors } from '../assets/css/style';

type ColorList = {
    key: string;
    color: string;
}[];

export const Colors = () => {
    const colorList: ColorList = [];

    // Got this from https://stackoverflow.com/a/15690816/1223588
    const iterate = (obj: any, stack: string): ColorList => {
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (typeof obj[property] === 'object') {
                    console.log(stack, property);
                    iterate(obj[property], (stack ? (stack + '.') : '') + property);
                } else {
                    const stackName = stack + '.' + property;
                    colorList.push({
                        key: stackName,
                        color: obj[property]
                    });
                }
            }
        }

        return colorList;
    };

    const mappedColors = iterate(colors, '');
    return (
        <table className="table color-table">
            <tbody>
                <tr>
                    <th>Token</th>
                    <th>Value</th>
                    <th>Example</th>
                </tr>
                {mappedColors.map((color, index) => {
                    return (
                        <tr key={index}>
                            <td><code>{color.key}</code></td>
                            <td><code>{color.color}</code></td>
                            <td>
                                <span className="color" style={{
                                    backgroundColor: color.color
                                }} />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};