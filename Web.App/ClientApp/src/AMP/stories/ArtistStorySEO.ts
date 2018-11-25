import { ArtistData } from './ArtistData';

export default class ArtistStorySEO {
    static GetArtistLDJSon(artist: ArtistData): {} {
        let ldjson: any = {
            '@context': 'http://schema.org/',
            '@type': 'MusicGroup',
            name : artist.cover_artistname,
            image: `assets/${artist.id}/cover.jpg`
        };

        return ldjson;
    }
}