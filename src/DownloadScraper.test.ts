import path from 'path';
import { readFileSync } from 'fs';
import nock from 'nock';

import downloadScraper from './DownloadScraper';

describe('DownloadScraper', () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('returns download URLs grouped by location', async () => {
    const archHtml = readFileSync(
      path.resolve(__dirname, 'testFixtures', 'archlinux-downloads.html'),
    ).toString();
    nock('https://archlinux.org').get('/download').reply(200, archHtml);

    const results = await downloadScraper();

    expect(results).toEqual([
      {
        location: 'Worldwide',
        urls: [
          'http://mirrors.evowise.com/archlinux/iso/2019.08.01/archlinux-2019.08.01-x86_64.iso',
          'http://mirror.rackspace.com/archlinux/iso/2019.08.01/archlinux-2019.08.01-x86_64.iso',
        ],
      },
      {
        location: 'United States',
        urls: [
          'http://mirrors.acm.wpi.edu/archlinux/iso/2019.08.01/archlinux-2019.08.01-x86_64.iso',
        ],
      },
      {
        location: 'Vietnam',
        urls: [
          'http://f.archlinuxvn.org/archlinux/iso/2019.08.01/archlinux-2019.08.01-x86_64.iso',
        ],
      },
    ]);
  });

  it('handles error when download page cannot be fetched', async () => {
    await expect(downloadScraper()).rejects.toThrowError(
      'Failed to scrape archlinux downloads page',
    );
  });

  it('handles error when no results', async () => {
    nock('https://archlinux.org').get('/download').reply(500);

    await expect(downloadScraper()).rejects.toThrowError(
      'Failed to scrape archlinux downloads page',
    );
  });
});
