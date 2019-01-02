import * as React from 'react';
// import { StyleSheet, css, StyleDeclarationValue } from 'aphrodite';

// Code to obtain original viewBox
// var clientrect = document.querySelector('svg path').getBBox();console.log(clientrect.x+' '+clientrect.y+' '+clientrect.width+' '+clientrect.height);

// const styles = StyleSheet.create({
//     icon: {
//         display: 'block',
//         userSelect: 'none'
//     },
//     svg: {
//         display: 'block'
//     }
// });

export const sprite: any = {
    hamburger: (
        <svg version="1.1" viewBox="0 0 26 26" className={'' /* css(styles.svg) */}>
            <g id="Service-Request---Form" fill="none" stroke="none" strokeWidth="1" >
                <g id="Mobile---Service-Request-Form" transform="translate(-2, 0)">
                    <g id="Icon-/-Hamburger---25px-/-White">
                        <rect height="25" id="Rectangle-path" width="30" x="0" y="0" />
                        <rect height="1.5" id="Rectangle-path" width="26" fill="currentColor" x="2" y="5.25" />
                        <rect height="1.5" id="Rectangle-path" width="26" fill="currentColor" x="2" y="18.25" />
                        <rect height="1.5" id="Rectangle-path" width="26" fill="currentColor" x="2" y="11.75" />
                    </g>
                </g>
            </g>
        </svg >
    ),
    close: (
        <svg viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg" className={'' /* css(styles.svg) */}>
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
    enlarge: (
        <svg viewBox="0 0 11 11" xmlns="http://www.w3.org/2000/svg" className={'' /* css(styles.svg) */}>
            <g id="Tablet" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Tablet---Portfolio" transform="translate(-957.000000, -291.000000)">
                    <g id="Molecule-/-Rolodex-Header-/-Default" transform="translate(353.000000, 278.000000)">
                        <g id="Icon-/-Expand---25px-/-Black" transform="translate(604.000000, 13.000000)">
                            <g id="Expand">
                                <rect id="Rectangle-path" x="0" y="0" width="11" height="11" />
                                <polygon id="Shape" fill="currentColor" fillRule="nonzero" points="1.06920001 10.3311998 1.08240001 10.3487998 1.09560001 10.3311998 1.32880001 10.3311998 4.6288001 10.3311998 4.6288001 9.67119978 1.75560002 9.67119978 4.6288001 6.8023998 4.21080009 6.3887998 1.32880001 9.27079979 1.32880001 6.3711998 0.664399996 6.3711998 0.664399996 9.67119978 0.664399996 10.3311998" />
                                <polygon id="Shape" fill="currentColor" fillRule="nonzero" points="9.9352 0.664400004 9.922 0.655600004 9.9088 0.664400004 9.68 0.664400004 6.38 0.664400004 6.38 1.32879998 9.2488 1.32879998 6.38 4.1975999 6.798 4.61119989 9.68 1.72919997 9.68 4.62879989 10.34 4.62879989 10.34 1.32879998 10.34 0.664400004" />
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    ),
    shrink: (
        <svg viewBox="0 0 11 11" version="1.1" xmlns="http://www.w3.org/2000/svg" className={'' /* css(styles.svg) */}>
            <g id="Tablet" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Tablet---Portfolio-(expanded)" transform="translate(-957.000000, -156.000000)">
                    <g id="Molecule-/-Rolodex-Header-/-Default" transform="translate(353.000000, 143.000000)">
                        <g id="Icon-/-Expand---25px-/-Black" transform="translate(604.000000, 13.000000)">
                            <g id="Minimize">
                                <rect id="Rectangle-path" x="0" y="0" width="11" height="11" />
                                <polygon id="Shape" fill="currentColor" fillRule="nonzero" points="4.22400009 6.3887998 4.21080009 6.3711998 4.19760009 6.3887998 3.96880008 6.3887998 0.664399996 6.3887998 0.664399996 7.0487998 3.53760007 7.0487998 0.664399996 9.91759978 1.08240001 10.3311998 3.96880008 7.44919979 3.96880008 10.3487998 4.6288001 10.3487998 4.6288001 7.0487998 4.6288001 6.3887998" />
                                <polygon id="Shape" fill="currentColor" fillRule="nonzero" points="6.7848 4.61119989 6.798 4.62879989 6.8112 4.61119989 7.04 4.61119989 10.34 4.61119989 10.34 3.95119991 7.4712 3.95119991 10.34 1.08239999 9.922 0.664400004 7.04 3.55079992 7.04 0.655600004 6.38 0.655600004 6.38 3.95119991 6.38 4.61119989" />
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    ),
    user: (
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className={'' /* css(styles.svg) */}>
            <g id="Rolodex---Secondary-Navigation" fill="none" fillRule="evenodd">
                <g id="Mobile---Secondary-Menu" fill="currentColor">
                    <g id="Artboard-1-copy-7" transform="translate(0, 1)">
                        <path d="M7.5,7.66304348 C5.42893219,7.66304348 3.75,5.98411129 3.75,3.91304348 C3.75,1.84197567 5.42893219,0.163043478 7.5,0.163043478 C9.57106781,0.163043478 11.25,1.84197567 11.25,3.91304348 C11.2464101,5.98262248 9.569579,7.65945357 7.5,7.66304348 Z M7.5,1.14130435 C5.96921075,1.14130435 4.72826087,2.38225423 4.72826087,3.91304348 C4.72826087,5.44383273 5.96921075,6.68478261 7.5,6.68478261 C9.03078925,6.68478261 10.2717391,5.44383273 10.2717391,3.91304348 C10.2681534,2.38374194 9.02930154,1.14489006 7.5,1.14130435 Z"
                            id="Shape" fillRule="nonzero" />
                        <path d="M1.17391304,14.673913 C1.50392337,11.4278686 4.2372234,8.9583614 7.5,8.9583614 C10.7627766,8.9583614 13.4960766,11.4278686 13.826087,14.673913 L14.8043478,14.673913 C14.4832912,10.8785073 11.3089608,7.96135927 7.5,7.96135927 C3.6910392,7.96135927 0.516708783,10.8785073 0.195652174,14.673913 L1.17391304,14.673913 Z"
                            id="Path" />
                    </g>
                </g>
            </g>
        </svg>
    ),
    chevron: (
        <svg version="1.1" viewBox="0 0 25 25" className={'' /* css(styles.svg) */}>
            <g id="Page-1" fill="none" stroke="none" strokeWidth="1">
                <g id="Design-System---Icons">
                    <g id="Icon-/-Chevron-Right---25px-/-White">
                        <g id="Chevron-Right">
                            <rect height="25" id="Rectangle-path" width="25" x="0" y="0" />
                            <polygon id="Shape" fill="currentColor" points="18.53 12.47 7.53 1.47 6.47 2.53 16.44 12.5 6.47 22.47 7.53 23.53 18.53 12.53 18.5 12.5" />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    ),
    search: (
        <svg viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg" className={'' /* css(styles.svg) */}>
            <g id="Page-1" fill="none" fillRule="evenodd">
                <g id="Design-System---Icons" transform="translate(-241 -777)">
                    <g id="Icon-/-Search-/-Gray-80%" transform="translate(240 776)">
                        <g id="Search">
                            <rect id="Rectangle-path" width="25" height="25" />
                            <path d="M23.53,22.47 L16.69,15.63 C19.7156879,12.0365239 19.3725451,6.6970882 15.9117721,3.52046928 C12.450999,0.343850372 7.10177278,0.45830112 3.78003695,3.78003695 C0.45830112,7.10177278 0.343850372,12.450999 3.52046928,15.9117721 C6.6970882,19.3725451 12.0365239,19.7156879 15.63,16.69 L22.47,23.53 L23.53,22.47 Z M2.75,10 C2.75,5.99593556 5.99593556,2.75 10,2.75 C14.0040644,2.75 17.25,5.99593556 17.25,10 C17.25,14.0040644 14.0040644,17.25 10,17.25 C5.9982194,17.2444917 2.75550831,14.0017806 2.75,10 Z"
                                id="Shape" fill="currentColor" fillRule="nonzero" />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    ),
    check: (
        <svg viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg" className={'' /* css(styles.svg) */}>
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
    officePhone: (
        <svg viewBox="0 0 13.800010681152344 13.800568580627441" version="1.1" xmlns="http://www.w3.org/2000/svg" className={'' /* css(styles.svg) */}>
            <g id="Tablet" stroke="none" strokeWidth="1" fill="currentColor" fillRule="evenodd">
                <path d="M-1.16550039e-16,3.42 C-0.00105196528,3.76121091 0.076989857,4.09802299 0.228,4.404 C1.20191567,6.38197867 2.49753884,8.18449666 4.062,9.738 C5.61665456,11.3011105 7.41893464,12.5965627 9.396,13.572 C10.2695175,13.9969183 11.3166477,13.8183754 12,13.128 L13.8,11.328 L10.104,7.65 L8.628,9.108 C7.8323994,8.64486074 7.10198543,8.07788193 6.456,7.422 C5.80950626,6.77517929 5.25255517,6.04468548 4.8,5.25 L6.258,3.75 L2.478,0 L0.678,1.8 C0.245881411,2.22856747 0.00195478082,2.81140101 -1.16550039e-16,3.42 Z M1.434,2.562 L2.478,1.524 L4.722,3.762 L3.48,5.04 L3.63,5.37 C4.15273881,6.41691299 4.85081851,7.36662607 5.694,8.178 C6.50746288,9.02459707 7.4590418,9.72661478 8.508,10.254 L8.844,10.404 L10.098,9.162 L12.276,11.322 L11.238,12.372 C10.8779274,12.7325281 10.3294332,12.8263495 9.87,12.606 C7.99397793,11.6896756 6.28118361,10.4714633 4.8,9 C3.3345782,7.52638091 2.11869207,5.82414033 1.2,3.96 C0.965044071,3.49279445 1.05970958,2.9272287 1.434,2.562 Z" id="Shape" fillRule="nonzero" />
            </g>
        </svg>
    ),
    mobilePhone: (
        <svg version="1.1" viewBox="0 0 23 23" className={'' /* css(styles.svg) */}>
            <g id="Page-1" fill="none" stroke="none" strokeWidth="1">
                <g id="Design-System---Icons" transform="translate(-196.000000, -912.000000)">
                    <g id="Icon-/-Smartphone---25px-/-Black" transform="translate(195.000000, 911.000000)">
                        <g id="Artboard-1-copy-4">
                            <rect height="25" id="Rectangle-path" width="25" x="0" y="0" />
                            <rect height="21" id="Rectangle" width="13.67" stroke="currentColor" strokeWidth="1.5" x="5.67" y="2" />
                            <path id="Path" d="M10.5,21 C10.5,19.8954305 11.3954305,19 12.5,19 L5.67,19 L5.67,23 L12.5,23 C11.3954305,23 10.5,22.1045695 10.5,21 Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
                            <path id="Path" d="M12.5,19 C13.6045695,19 14.5,19.8954305 14.5,21 C14.5,22.1045695 13.6045695,23 12.5,23 L19.33,23 L19.33,19 L12.5,19 Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    ),
    envelope: (
        <svg version="1.1" viewBox="0 0 23 23" className={'' /* css(styles.svg) */}>
            <g id="Page-1" fill="none" stroke="none" strokeWidth="1">
                <g id="Design-System---Icons" transform="translate(-196.000000, -1003.000000)">
                    <g id="Icon-/-Mail---25px-/-Black" transform="translate(195.000000, 1001.000000)">
                        <g id="Artboard-1-copy-2" transform="translate(1.000000, 5.000000)">
                            <rect height="14" id="Rectangle" width="21" x="1" y="1" />
                            <path id="Shape" d="M22.75,15.75 L0.25,15.75 L0.25,0.25 L22.75,0.25 L22.75,15.75 Z M1.75,14.25 L21.25,14.25 L21.25,1.75 L1.75,1.75 L1.75,14.25 Z" fill="currentColor" />
                            <polygon id="Path" fill="currentColor" points="11.72 10.42 20.42 4.62 19.58 3.38 11.5 8.77 3.42 3.38 2.58 4.62 11.28 10.42 11.5 10.57" />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    ),
    structureChart: (
        <svg viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg" className={'' /* css(styles.svg) */}>
            <g id="Entity-Structure-Home" fill="none" fillRule="evenodd">
                <g id="Mobile---Entity-Home-(selected)" transform="translate(-174 -343)"
                    fill="currentColor" fillRule="nonzero">
                    <g id="Group-3" transform="translate(40 230)">
                        <g id="Group" transform="translate(122 100)">
                            <g id="Artboard-1-copy-6" transform="translate(12 15)">
                                <path d="M25,9.94736842 L25,4.42105263 L17.9347826,4.42105263 L17.9347826,6.63157895 L15.2173913,6.63157895 L15.2173913,9.94736842 L14.5,9.94736842 C14.3026794,9.22861249 13.7503293,8.66695972 13.0434783,8.46631579 L13.0434783,5.52631579 L16.8478261,5.52631579 L16.8478261,0 L8.15217391,0 L8.15217391,5.52631579 L11.9565217,5.52631579 L11.9565217,8.46631579 C11.2496707,8.66695972 10.6973206,9.22861249 10.5,9.94736842 L7.06521739,9.94736842 L7.06521739,7.73684211 L0,7.73684211 L0,13.2631579 L7.06521739,13.2631579 L7.06521739,11.0526316 L10.5,11.0526316 C10.6973206,11.7713875 11.2496707,12.3330403 11.9565217,12.5336842 L11.9565217,15.4736842 L8.15217391,15.4736842 L8.15217391,21 L16.8478261,21 L16.8478261,15.4736842 L13.0434783,15.4736842 L13.0434783,12.5336842 C13.7503293,12.3330403 14.3026794,11.7713875 14.5,11.0526316 L15.2173913,11.0526316 L15.2173913,14.3684211 L17.9347826,14.3684211 L17.9347826,16.5789474 L25,16.5789474 L25,11.0526316 L17.9347826,11.0526316 L17.9347826,13.2631579 L16.3043478,13.2631579 L16.3043478,7.73684211 L17.9347826,7.73684211 L17.9347826,9.94736842 L25,9.94736842 Z M19.0217391,5.52631579 L23.9130435,5.52631579 L23.9130435,8.84210526 L19.0217391,8.84210526 L19.0217391,5.52631579 Z M9.23913043,1.10526316 L15.7608696,1.10526316 L15.7608696,4.42105263 L9.23913043,4.42105263 L9.23913043,1.10526316 Z M5.97826087,12.1578947 L1.08695652,12.1578947 L1.08695652,8.84210526 L5.97826087,8.84210526 L5.97826087,12.1578947 Z M15.7608696,19.8947368 L9.23913043,19.8947368 L9.23913043,16.5789474 L15.7608696,16.5789474 L15.7608696,19.8947368 Z M12.5,11.5168421 C11.9477153,11.5168421 11.5,11.0615864 11.5,10.5 C11.5,9.93841361 11.9477153,9.48315789 12.5,9.48315789 C13.0522847,9.48315789 13.5,9.93841361 13.5,10.5 C13.5,11.0615864 13.0522847,11.5168421 12.5,11.5168421 Z M19.0217391,12.1578947 L23.9130435,12.1578947 L23.9130435,15.4736842 L19.0217391,15.4736842 L19.0217391,12.1578947 Z"
                                    id="Shape" />
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    ),
    arrow: (
        <svg version="1.1" viewBox="0 0 25 25" className={'' /* css(styles.svg) */}>
            <g id="Page-1" fill="none" stroke="none" strokeLinecap="square" strokeWidth="1">
                <g id="Design-System---Icons" stroke="currentColor" strokeWidth="1.5" transform="translate(-242.000000, -732.000000)">
                    <g id="Icon-/-Arrow---Right-/-Gray-80%" transform="translate(241.000000, 732.000000)">
                        <path id="Line" d="M2,12 L22.5,12" />
                        <path id="Line" d="M12.5,1.5 L23.25,12" />
                        <path id="Line" d="M12.2386422,23.0113578 L23.25,12" />
                    </g>
                </g>
            </g>
        </svg>
    ),
    download: (
        <svg viewBox="-2 -2 25 25" xmlns="http://www.w3.org/2000/svg" className={'' /* css(styles.svg) */}>
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Design-System---Icons" transform="translate(-197.000000, -1093.000000)">
                    <g id="Icon-/-Download-/-Black" transform="translate(195.000000, 1091.000000)">
                        <g id="Download">
                            <g id="Arrow-Down">
                                <rect id="Rectangle-path" x="0" y="0" width="25" height="25" />
                                <polygon id="Arrow_Left" fill="currentColor" fillRule="nonzero" points="20.1831369 10.5628794 13.0779692 17.7597572 13.0779692 2 11.9220308 2 11.9220308 17.7597572 4.8168631 10.5628794 4 11.3902862 12.5 20 21 11.3902862" />
                            </g>
                            <rect id="Rectangle-path" fill="currentColor" fillRule="nonzero" x="2" y="21.5" width="21" height="1.5" />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    ),
    information: (
        <svg viewBox="0 0 16 16" className={'' /* css(styles.svg) */}>
            <title>{'67275EA9-F800-41FE-84C6-D03D210506F8'}</title>
            <g fill="none" fillRule="evenodd">
                <text
                    fill="currentColor"
                    fontSize={12.339}
                    fontWeight={400}
                >
                    <tspan x={6.314} y={11.71} style={{ fontFamily: 'Precious Sans Two', fontWeight: 600, fontSize: '11px' }}>
                        {'i'}
                    </tspan>
                </text>
                <circle
                    stroke="currentColor"
                    strokeWidth={0.986}
                    cx={7.556}
                    cy={7.556}
                    r={7.063}
                />
            </g>
        </svg>
    ),
    pencil: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={'' /* css(styles.svg) */}>
            <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            <path d="M0 0h24v24H0z" fill="none" />
        </svg>
    ),
    filter: (
        <svg version="1.1" viewBox="0 0 247.46 247.46" x="0px" y="0px" xmlSpace="preserve" className={'' /* css(styles.svg) */}>
            <path d="M246.744,13.984c-1.238-2.626-3.881-4.301-6.784-4.301H7.5c-2.903,0-5.545,1.675-6.784,4.301&#xA;&#x9;c-1.238,2.626-0.85,5.73,0.997,7.97l89.361,108.384v99.94c0,2.595,1.341,5.005,3.545,6.373c1.208,0.749,2.579,1.127,3.955,1.127&#xA;&#x9;c1.137,0,2.278-0.259,3.33-0.78l50.208-24.885c2.551-1.264,4.165-3.863,4.169-6.71l0.098-75.062l89.366-108.388&#xA;&#x9;C247.593,19.714,247.982,16.609,246.744,13.984z M143.097,122.873c-1.105,1.34-1.711,3.023-1.713,4.761l-0.096,73.103&#xA;&#x9;l-35.213,17.453v-90.546c0-1.741-0.605-3.428-1.713-4.771L23.404,24.682h200.651L143.097,122.873z" fill="currentColor" />
        </svg>
    ),
    filterFull: (
        <svg viewBox="0 0 21 21" className={'' /* css(styles.svg) */}>
            <g fill="currentColor" transform="translate(-538 -1100)">
                <g transform="translate(536 1098)">
                    <g transform="translate(1 2)">
                        <polygon points="22.976158 0.0363291139 0 0.0363291139 8.56003276 9.05193038 8.55941233 20.9841392 14.41679 17.9550886 14.4161696 9.05193038"/>
                    </g>
                </g>
            </g>
        </svg>
    ),
    calendar: (
        <svg version="1.1" viewBox="0 0 23 23" className={'' /* css(styles.svg) */}>
            <g fill="none" stroke="none" strokeWidth="1">
                <g fill="currentColor" transform="translate(-196.000000, -1047.000000)">
                    <g transform="translate(195.000000, 1046.000000)">
                        <path id="Shape" d="M20,4.5 L20,1 L16,1 L16,4.5 L9,4.5 L9,1 L5,1 L5,4.5 L1,4.5 L1,24 L24,24 L24,4.5 L20,4.5 Z M17,2 L19,2 L19,7 L17,7 L17,2 Z M6,2 L8,2 L8,7 L6,7 L6,2 Z M22.5,22.5 L2.5,22.5 L2.5,10.5 L22.5,10.5 L22.5,22.5 Z M2.5,9 L2.5,6 L5,6 L5,8 L9,8 L9,6 L16,6 L16,8 L20,8 L20,6 L22.5,6 L22.5,9 L2.5,9 Z" />
                    </g>
                </g>
            </g>
        </svg>
    ),
    list: (
        <svg version="1.1" viewBox="0 -2 21 21" className={'' /* css(styles.svg) */}>
            <g id="Page-1" fill="none" stroke="none" strokeWidth="1">
                <g id="Design-System---Icons" transform="translate(-577.000000, -866.000000)">
                    <g id="Icon-/-List---25px-/-Black" transform="translate(575.000000, 862.000000)">
                        <g id="List">
                            <rect height="25" id="Rectangle-path" width="25" x="0" y="0" />
                            <rect height="1.5" id="Rectangle-path" width="14" fill="currentColor" x="9" y="5.25" />
                            <circle id="Oval" cx="3.75" cy="6" fill="currentColor" r="1.75" />
                            <circle id="Oval" cx="3.75" cy="12.75" fill="currentColor" r="1.75" />
                            <circle id="Oval-Copy" cx="3.75" cy="19" fill="currentColor" r="1.75" />
                            <rect height="1.5" id="Rectangle-path" width="14" fill="currentColor" x="9" y="18.25" />
                            <rect height="1.5" id="Rectangle-path" width="14" fill="currentColor" x="9" y="12" />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    ),
    summary: (
        <svg version="1.1" viewBox="0 0 23 23" className={'' /* css(styles.svg) */}>
            <g id="Page-1" fill="none" stroke="none" strokeWidth="1">
                <g id="Design-System---Icons" transform="translate(-575.000000, -915.000000)">
                    <g id="Icon-/-Summary---25px-/-Black" transform="translate(574.000000, 914.000000)">
                        <g id="Artboard-1-copy-3" fill="currentColor" transform="translate(1.000000, 1.000000)">
                            <path id="Shape" d="M22.75,22.75 L0.25,22.75 L0.25,0.25 L22.75,0.25 L22.75,22.75 Z M1.75,21.25 L21.25,21.25 L21.25,1.75 L1.75,1.75 L1.75,21.25 Z" />
                        </g>
                        <g id="List" transform="translate(4.000000, 4.000000)">
                            <rect height="17" id="Rectangle-path" width="17" x="0" y="0" />
                            <rect height="1.02" id="Rectangle-path" width="9.52" fill="currentColor" x="6.12" y="3.57" />
                            <circle id="Oval" cx="2.55" cy="4.08" fill="currentColor" r="1.19" />
                            <circle id="Oval" cx="2.55" cy="8.67" fill="currentColor" r="1.19" />
                            <circle id="Oval-Copy" cx="2.55" cy="12.92" fill="currentColor" r="1.19" />
                            <rect height="1.02" id="Rectangle-path" width="9.52" fill="currentColor" x="6.12" y="12.41" />
                            <rect height="1.02" id="Rectangle-path" width="9.52" fill="currentColor" x="6.12" y="8.16" />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    ),
    plus: (
        <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" className={'' /* css(styles.svg) */}>
            <g id="Page-1" fill="none" fillRule="evenodd">
                <g id="Design-System---Icons" transform="translate(-197 -823)">
                    <g id="Icon-/-Plus---25px-/-Black" transform="translate(195 821)">
                        <g id="Add">
                            <rect id="Rectangle-path" width="25" height="25" />
                            <path d="M2,12.5 L23,12.5" id="Shape" stroke="currentColor" strokeWidth="1.5"
                            />
                            <path d="M12.5,2 L12.5,23" id="Shape" stroke="currentColor" strokeWidth="1.5"
                            />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    ),
    switch: (
        <svg viewBox="0 0 15 12" xmlns="http://www.w3.org/2000/svg" className={'' /* css(styles.svg) */}>
            <g id="Rolodex---Entity-Switcher" fill="none" fillRule="evenodd">
                <g id="Tablet---Entity-Switcher" transform="translate(-44 -652)" fillRule="nonzero">
                    <g id="Organism-/-Tablet-/-Sidebar-/-Default">
                        <g id="Group" transform="translate(44 650)">
                            <rect id="Rectangle" width="15" height="15" />
                            <g id="Group-3" transform="translate(1 3)" stroke="currentColor" strokeLinecap="square"
                            strokeWidth="1.5">
                                <g id="Icon-/-Arrow---Right---15px-/-White" transform="translate(7 4)">
                                    <path d="M0.5,3 L5.625,3" id="Line" />
                                    <path d="M3.125,0.375 L5.8125,3" id="Line" />
                                    <path d="M3.05966056,5.75283944 L5.8125,3" id="Line" />
                                </g>
                                <g id="Icon-/-Arrow---Right---15px-/-White" transform="matrix(-1 0 0 1 6 0)">
                                    <path d="M0.5,3 L5.625,3" id="Line" />
                                    <path d="M3.125,0.375 L5.8125,3" id="Line" />
                                    <path d="M3.05966056,5.75283944 L5.8125,3" id="Line" />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    ),
    danger: (
        <svg version="1.1" viewBox="0 0 24 24" className={'' /* css(styles.svg) */}>
            <g id="Rolodex---Notification" fill="none" stroke="none" strokeWidth="1">
                <g id="Tablet---Notification---Error" transform="translate(-715.000000, -652.000000)">
                    <g id="Molecule-/-Notification-/-Default-Copy" transform="translate(689.000000, 631.000000)">
                        <g id="Icon-/-Warning-Rounded---25px-/-Danger" transform="translate(25.000000, 20.000000)">
                            <g id="Warning-Rounded" transform="translate(2.000000, 1.000000)">
                                <text id="!" fill="currentColor" style={{ fontFamily: 'Precious Sans Two', fontWeight: 600, fontSize: '18px' }}>
                                    <tspan x="8" y="18">!</tspan>
                                </text>
                                <circle id="Oval" cx="10.75" cy="11.75" r="10.75" stroke="currentColor" strokeWidth="1.5"/>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    ),
    externalLink: (
        <svg viewBox="0 0 24 24" className={'' /* css(styles.svg) */}>
            <path fill="currentColor" d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
        </svg>
    )
};

export type IconNames = keyof typeof sprite;

export interface IconSpriteProps {
    name: IconNames;
    className?: ''; // StyleDeclarationValue;
    onClick?: (event: React.SyntheticEvent<Element>) => void;
}

const Sprite = ({ name, className, onClick }: IconSpriteProps) => {
    return (sprite[name]) ?
        <span className={'' /* css(styles.icon, className) */} onClick={onClick}>{sprite[name]}</span>
        : null;
};

export default Sprite;