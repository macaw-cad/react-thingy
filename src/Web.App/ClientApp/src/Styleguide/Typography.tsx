import React, { useEffect } from 'react';

export const Typography = () => {
    useEffect(() => {
        var rows = document.querySelectorAll('.table tr');
        for (var i = 0; i < rows.length; i++) {
            var fontElem = rows[i].querySelector('[data-font]');
            var fontTarget = rows[i].querySelector('[data-font-size]');

            if (fontElem && fontTarget) {
                var fontSize = window.getComputedStyle(fontElem).fontSize;

                if (fontSize) {
                    fontTarget.innerHTML = fontSize;
                }
            }
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <table className="table">
            <tbody>
                <tr>
                    <th>Heading</th>
                    <th>Font size</th>
                    <th>Example</th>
                </tr>
                {[1, 2, 3, 4, 5, 6].map((size, index) => {
                    const Heading: React.FunctionComponent = () => <>{`h${size}`}</>;
                    return (
                        <tr key={index}>
                            <td><code>&lt;h{size}&gt;&lt;/h{size}&gt;</code></td>
                            <td><code data-font-size={true} /></td>
                            <td><Heading data-font={true}>Heading size: H{size}</Heading></td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};