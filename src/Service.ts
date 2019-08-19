import express from 'express';

import { DownloadScraperFunction } from './DownloadScraper';

export default function(scraper: DownloadScraperFunction): express.Express {
  const app = express();

  app.get('/iso', async (req, res, _next) => {
    const requestedRegion = req.query.region
      ? req.query.region.replace('_', ' ')
      : 'Worldwide';

    const downloadRegions = await scraper();
    const region = downloadRegions.find(
      r => r.location.toLowerCase() === requestedRegion.toLowerCase(),
    );

    res.redirect(307, region!.urls[0]);
  });

  return app;
}
