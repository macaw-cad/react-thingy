import React from 'react';
import { Header } from '../sample/Header';
import { Footer } from '../sample/Footer';

export const AmpStoriesPage = () => {
    return (
        <>
            <Header />
            <h1>AMP Stories</h1>
            <h2>visual storytelling for the open web</h2>
            <p>
                <a href="https://amp.dev/about/stories/" target="_blank" rel="noopener noreferrer">AMP stories</a> immerse your readers in fast-loading full-screen experiences.
                Easily create visual narratives, with engaging animations and tappable interactions.
                </p>

            <h2>AMP HipHop Rap stories</h2>
            <ul>
                <li><a href="/Story/ArtistStory?artistId=biggie_smalls" target="_blank">The Notorious B.I.G.</a></li>
                <li><a href="/Story/ArtistStory?artistId=big_l" target="_blank">Big L</a></li>
                <li><a href="/Story/ArtistStory?artistId=ice_cube" target="_blank">Ice Cube</a></li>
                <li><a href="/Story/ArtistStory?artistId=tupac" target="_blank">Tupac Shakur</a></li>
            </ul>
            <Footer />
        </>
    );
};