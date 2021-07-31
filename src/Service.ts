import express from 'express';

import { DownloadScraperFunction } from './DownloadScraper';

function isString(value: unknown): value is string {
  return typeof value === 'string' || value instanceof String;
}

export default function (scraper: DownloadScraperFunction): express.Express {
  const app = express();

  app.get('/iso', async (req, res, _next) => {
    const requestedRegion = isString(req.query.region)
      ? req.query.region.replace('_', ' ')
      : 'Worldwide';

    try {
      const downloadRegions = await scraper();
      const region = downloadRegions.find(
        (r) => r.location.toLowerCase() === requestedRegion.toLowerCase(),
      );

      if (region) {
        res.redirect(307, region.urls[0]);
      } else {
        res.status(404).end();
      }
    } catch (err) {
      res.status(500).send({ message: 'Unable to fetch download URLs' });
    }
  });

  return app;
}
