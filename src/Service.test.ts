import request from 'supertest';
import td from 'testdouble';
import { DownloadScraperFunction } from './DownloadScraper';
import makeApp from './Service';

describe('Service', () => {
  it('redirects to worldwide region ISO from scraper', async () => {
    const scraper = td.function<DownloadScraperFunction>();

    td.when(scraper()).thenResolve([
      { location: 'United States', urls: ['http://usa.com/arch.iso'] },
      { location: 'Worldwide', urls: ['http://worldwide.com/arch.iso'] },
    ]);

    const app = makeApp(scraper);

    await request(app)
      .get('/iso')
      .expect(307)
      .expect('Location', 'http://worldwide.com/arch.iso');
  });

  it('redirects to URL for region based on query param', async () => {
    const scraper = td.function<DownloadScraperFunction>();

    td.when(scraper()).thenResolve([
      { location: 'Worldwide', urls: ['http://worldwide.com/arch.iso'] },
      { location: 'United States', urls: ['http://usa.com/arch.iso'] },
    ]);

    const app = makeApp(scraper);

    await request(app)
      .get('/iso')
      .query({ region: 'united_states' })
      .expect(307)
      .expect('Location', 'http://usa.com/arch.iso');
  });
});
