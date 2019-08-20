import express from 'express';

import { DownloadScraperFunction } from './DownloadScraper';

export default function(scraper: DownloadScraperFunction): Express.Application {
  const app = express();

  app.get('/iso', async (req, res, _next) => {
    const requestedRegion = req.query.region
      ? req.query.region.replace('_', ' ')
      : 'Worldwide';

    try {
      const downloadRegions = await scraper();
      const region = downloadRegions.find(
        r => r.location.toLowerCase() === requestedRegion.toLowerCase(),
      );

      res.redirect(307, region!.urls[0]);
    } catch (err) {
      res.status(500).send({ message: 'Unable to fetch download URLs' });
    }
  });

  return app;
}
