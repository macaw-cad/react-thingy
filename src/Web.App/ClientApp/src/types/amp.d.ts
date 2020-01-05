import * as React from 'react';
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'amp-img': any;
            'amp-video': any;
            // 'amp-story': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'amp-story': any;
            'amp-story-page': any;
            'amp-story-grid-layer': any;
            'amp-story-cta-layer': any;
            'amp-story-bookend': any;
        }
    }
}