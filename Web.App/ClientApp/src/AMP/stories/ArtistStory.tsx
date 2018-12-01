import * as React from 'react';
import { ArtistData } from './ArtistData';

declare module 'react' {
  interface HTMLProps<T> {
    is?: string;
    fallback?: string;
    standalone?: string;
  }
}

function getArtistBackground(artist: ArtistData) {
  return "";
}

export const ArtistStory = (artist: ArtistData) => {

  return (
    <amp-story
      standalone=""
      title={artist.cover_artistname}
      publisher="Serge van den Oever"
      publisher-logo-src="/images/icons/icon-128x128.png"
      poster-portrait-src={getArtistBackground(artist)}
      poster-square-src={getArtistBackground(artist)}
      poster-landscape-src={getArtistBackground(artist)}
    >
      <amp-story-page id="cover">
        <amp-story-grid-layer template="fill">
          <amp-img src={`/artists/${artist.id}/cover.jpg`} width="720" height="1280" layout="responsive">
          </amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical">
          <h1>{artist.cover_artistname}</h1>
          <h2>{artist.cover_realname}</h2>
          <p>{artist.cover_lifespan}</p>
          <p>By {artist.author}</p>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="bottom">
          <p className="source">
            Photo: {artist.cover_photosource}
          </p>
        </amp-story-grid-layer>
      </amp-story-page>

      <amp-story-page id="life">
        <amp-story-grid-layer template="fill">
          <amp-img src={`/artists/${artist.id}/life.jpg`} width="720" height="1280" layout="responsive">
          </amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical">
          <h1>Life</h1>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="bottom">
          <p>{artist.life_text}</p>
          <p className="source">
            Text: {artist.life_textsource}, 
            Photo: {artist.life_photosource}
          </p>
        </amp-story-grid-layer>
      </amp-story-page>

      <amp-story-page id="hit">
        <amp-story-grid-layer template="fill">
          <amp-video autoplay loop width="720" height="1280" layout="responsive" poster="images/black.png">
            <source src={`/artists/${artist.id}/hit.mp4`} type="video/mp4" />
          </amp-video>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical">
          <h1>{artist.hit_title}</h1>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="bottom">
          <p>{artist.hit_text}</p>
          <p className="source">
            Text: {artist.hit_textsource}, 
            Video: {artist.hit_videosource}
          </p>
        </amp-story-grid-layer>
      </amp-story-page>

      <amp-story-page id="facts">
        <amp-story-grid-layer template="fill">
          <amp-img src={`/artists/${artist.id}/facts.jpg`} width="720" height="1280" layout="responsive">
          </amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical">
          <h1>Facts</h1>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="bottom">
          <p className="source">
          <ul>
          <li>{artist.facts1}</li>
          <li>{artist.facts2}</li>
          <li>{artist.facts3}</li>
    </ul>
    </p>
    <p className="source">
            Text: {artist.facts_textsource}, 
            Photo: {artist.facts_photosource}
          </p>
        </amp-story-grid-layer>
      </amp-story-page>    

      <amp-story-bookend src={`/Story/ArtistStoryBookend?artistId=${artist.id}`} layout="nodisplay" />

    </amp-story>
  );
};
