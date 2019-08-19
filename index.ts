import downloadScraper from './src/DownloadScraper';
import makeApp from './src/Service';

const port = process.env.PORT || 3000;

const app = makeApp(downloadScraper);
app.listen(port, () => console.log(`listening on port ${port}`))
