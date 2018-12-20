import { renderReactAmpWithAphrodite } from 'hypernova-amp';
import { ArtistStory } from '../AMP/stories/ArtistStory';
import { ArtistData } from '../AMP/stories/ArtistData';
import ArtistStorySEO from '../AMP/stories/ArtistStorySEO';

declare var require: any;
let prependCSS = require('raw-loader!sass-loader!../../AMP/stories/ArtistStory.scss');

export default (artist: ArtistData) => {
  console.log(`Rendering artist ${artist.cover_artistname}`);
  return renderReactAmpWithAphrodite(
    'HypernovaArtistStory', // this file's name (or really any unique name)
    ArtistStory,
    {
      title: artist.cover_artistname,
      canonicalUrl: `/Story/ArtistStory?artistId=${artist.id}`,
      jsonSchema: ArtistStorySEO.GetArtistLDJSon(artist),
      enableAmpBind: true,
      enableRemoveIs: true,
      scripts: [
        {
          'customElement': 'amp-video',
          'src': 'https://cdn.ampproject.org/v0/amp-video-0.1.js'
        },
        {
          'customElement': 'amp-font',
          'src': 'https://cdn.ampproject.org/v0/amp-font-0.1.js'
        },
        {
          'customElement': 'amp-story',
          'src': 'https://cdn.ampproject.org/v0/amp-story-1.0.js'
        },
      ],
      prependCSS: prependCSS
    }
  )(artist);
};