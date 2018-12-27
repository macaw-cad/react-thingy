import * as React from 'react';
import { ApplicationContext, ApplicationContextConsumerProps } from './ApplicationContext';
import { Helmet } from 'react-helmet';

type PwaAppFullHtmlProps = {
};

type PwaAppFullHtmlAllProps = PwaAppFullHtmlProps;
export class PwaAppFullHtml extends React.Component<PwaAppFullHtmlAllProps> {
    constructor(props: PwaAppFullHtmlAllProps) {
        super(props);
    }
    
    public render(): React.ReactNode {
        const favIconUrl = process.env.PUBLIC_URL + '/favicon.ico';
        const manifestUrl =  process.env.PUBLIC_URL + '/manifest.json';

        const helmet = Helmet.renderStatic();

        const htmlAttrs = helmet.htmlAttributes.toComponent();
        const bodyAttrs = helmet.bodyAttributes.toComponent();

        return (
            <ApplicationContext.Consumer>
                {(applicationContextConsumer: ApplicationContextConsumerProps) => {
                    return (
                        <html {...htmlAttrs}>
                            <head>
                                <meta charSet="utf-8" />
                                <link rel="shortcut icon" href={favIconUrl} />
                                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                                <link rel="manifest" href={manifestUrl} />
                                {helmet.title.toComponent()}
                                {helmet.meta.toComponent()}
                                {helmet.link.toComponent()}
                                { applicationContextConsumer.applicationContext.cssUrls.map((cssUrl: string, i: number) => <link key={i} href={cssUrl} rel="stylesheet" /> ) }
                            </head>
                            <body {...bodyAttrs}>
                                <noscript>
                                    You need to enable JavaScript to run this app.
                                </noscript>
                                <div id="content">
                                    {this.props.children}
                                </div>
                                { applicationContextConsumer.applicationContext.cssUrls.map((jsUrl: string, i: number) => <script key={i} src={jsUrl} /> ) }
                            </body>
                        </html>
                    );
                }}
            </ApplicationContext.Consumer>
        );
    }
}