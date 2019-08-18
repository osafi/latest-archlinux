import url from 'url';
import Xray from 'x-ray';
const x = Xray();

type HandlerType = (
  err: Error,
  result: { 
    release: string;
    locations: string[]; 
    urls: string[][] 
  },
) => void;

export interface DownloadRegion {
  location: string;
  urls: string[];
}

export type DownloadScraperFunction = () => Promise<DownloadRegion[]>;

const downloadScraper: DownloadScraperFunction = () => {
  return new Promise(resolve => {
    const handler: HandlerType = (_, result) => {
      
      const version = result.release.replace(/Current Release:\ ?/, '');
      const isoName = `archlinux-${version}-x86_64.iso`;

      const final = result.locations.map((location, index) => {
        return {
          location: location.trim(),
          urls: result.urls[index].map(base => url.resolve(base, isoName)),
        };
      });
      resolve(final);
    };

    x('https://archlinux.org/download', 'body', {
      release: x('#arch-downloads', 'ul li'),
      locations: x('#download-mirrors', ['h5']),
      urls: x('#download-mirrors > ul', [['li a@href']]),
    })(handler);
  });
};

export default downloadScraper;
