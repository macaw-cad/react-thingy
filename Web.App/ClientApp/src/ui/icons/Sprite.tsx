import * as React from 'react';
import { Environment } from '../../Environment';
import { StyleSheet, css, StyleDeclarationValue } from 'aphrodite/no-important';

// Code to obtain original viewBox
// var clientrect = document.querySelector('svg path').getBBox();console.log(clientrect.x+' '+clientrect.y+' '+clientrect.width+' '+clientrect.height);

const styles = StyleSheet.create({
    icon: {
        display: 'block',
        userSelect: 'none'
    },
});

export const sprite = {
    check: (
        <svg viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
            <g id="Page-1" fill="none" fillRule="evenodd">
                <g id="Design-System---Icons">
                    <g id="Icon-/-Check---25px-/-Green">
                        <g id="Check">
                            <rect id="Rectangle-path" width="25" height="25" />
                            <polygon id="Shape" fill="#58BB81" fillRule="nonzero" points="23.76 5.61 22.7 4.54 8.91 18.34 2.3 11.72 1.24 12.78 8.91 20.45 8.91 20.45 8.91 20.45"
                            />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    ),
    close: (
        <svg />
    ),
    danger: <svg />
};

export type IconNames = keyof typeof sprite;

export interface IconSpriteProps {
    name: IconNames;
    className?: StyleDeclarationValue;
    onClick?: (event: React.SyntheticEvent<Element>) => void;
}

const Sprite = ({ name, className, onClick }: IconSpriteProps) => {
    return (sprite[name]) ?
        <span className={css(styles.icon, className)} onClick={onClick}>{sprite[name]}</span>
        : null;
};

export default Sprite;