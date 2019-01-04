import * as React from 'react';
import { StyleSheet, css } from '../../Styles';
import { StyleDeclarationValue } from 'aphrodite';

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
        <svg viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
            <g id="Page-1" fill="none" fillRule="evenodd">
                <g id="Design-System---Icons" transform="translate(-194 -418)">
                    <g id="Icon-/-Close---25px-/-Black" transform="translate(193 417)">
                        <g id="Close">
                            <rect id="Rectangle-path" width="25" height="25" />
                            <path d="M23,23 L2,2" id="Shape" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M2,23 L23,2" id="Shape" stroke="currentColor" strokeWidth="1.5" />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
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