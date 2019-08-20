import request from 'supertest';
import td from 'testdouble';
import { DownloadScraperFunction } from './DownloadScraper';
import makeApp from './Service';

describe('Service', () => {
  let scraper: DownloadScraperFunction;
  let subject: Express.Application;

  beforeEach(() => {
    scraper = td.function<DownloadScraperFunction>();
    subject = makeApp(scraper);
  });

  it('redirects to worldwide region ISO from scraper', async () => {
    td.when(scraper()).thenResolve([
      { location: 'United States', urls: ['http://usa.com/arch.iso'] },
      { location: 'Worldwide', urls: ['http://worldwide.com/arch.iso'] },
    ]);

    await request(subject)
      .get('/iso')
      .expect(307)
      .expect('Location', 'http://worldwide.com/arch.iso');
  });

  it('redirects to URL for region based on query param', async () => {
    td.when(scraper()).thenResolve([
      { location: 'Worldwide', urls: ['http://worldwide.com/arch.iso'] },
      { location: 'United States', urls: ['http://usa.com/arch.iso'] },
    ]);

    await request(subject)
      .get('/iso')
      .query({ region: 'united_states' })
      .expect(307)
      .expect('Location', 'http://usa.com/arch.iso');
  });

  it('returns 404 when no download URLs for requested region', async () => {
    td.when(scraper()).thenResolve([
      { location: 'Worldwide', urls: ['http://worldwide.com/arch.iso'] },
    ]);

    await request(subject)
      .get('/iso')
      .query({ region: 'united_states' })
      .expect(404);
  });

  it('returns 500 when scraper fails', async () => {
    td.when(scraper()).thenReject(new Error('scraper failed'));

    await request(subject)
      .get('/iso')
      .expect(500, { message: 'Unable to fetch download URLs' });
  });
});
