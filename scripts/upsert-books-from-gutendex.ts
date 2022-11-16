import axios from 'axios';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as util from 'util';
import * as execa from 'execa'
import * as stream from 'stream';
import { MongoClient } from 'mongodb';

const pipeline = util.promisify(stream.pipeline);

const tempDir = `${fs.mkdtempSync('/tmp/')}`;
const compressedCatalogPath = `${tempDir}/catalog.tar.bz2`;
const uncompressedCatalogPath = `${tempDir}/catalog`;
const catalogItemsPath = `${uncompressedCatalogPath}/cache/epub`;

let mongoClient: MongoClient;

const downloadCatalog = async () => {
  console.log(`Downloading Gutendex catalog to ${compressedCatalogPath}...`)
  const response = await axios.get("https://gutenberg.org/cache/epub/feeds/rdf-files.tar.bz2", { responseType: "stream" })
  await pipeline(response.data, fs.createWriteStream(compressedCatalogPath));
}

const uncompressCatalog = async () => {
  console.log(`Uncompressing Gutendex catalog to ${uncompressedCatalogPath}...`);
  fs.mkdirSync(uncompressedCatalogPath);
  execa.sync('tar', ['fjvx', compressedCatalogPath, '-C', uncompressedCatalogPath])
} 

const initMongoDbClient = async () => {
  console.log("Initializing MongoDB Client");
  mongoClient = await MongoClient.connect(`mongodb://localhost:27017/nest-starter-db?minPoolSize=100&maxPoolSize=200`);
}

const closeMongoDbClient = () => mongoClient.close();

const importCatalogItemBatch = async (catalogItemIds: string[]) => {
  const { data } = await axios.get(`https://gutendex.com/books?ids=${catalogItemIds.join(',')}`);
  const booksCollection = mongoClient.db().collection('books');

  const promises = [];
  for (const book of data.results) {
    const { id: gutenbergId, ...bookAttributes } = book;
    promises.push(booksCollection.updateOne({
      gutenbergId,
    }, {
      $set: {
        gutenbergId,
        ...bookAttributes
      }
    }, {
      upsert: true,
    }))
  }

  await Promise.all(promises);
}

const importCatalogItems = async () => {
  console.log(`Importing Gutendex catalog to into mongodb...`);
  const catalogItemIds = fs.readdirSync(catalogItemsPath);

  const catalogItemIdChunks = _.chunk(catalogItemIds, 32);
  const jobChunks = _.chunk(catalogItemIdChunks, 20);

  for (let i = 34; i < jobChunks.length; i++) {
    console.log(`Importing catalog item job ${i + 1} of ${jobChunks.length}`);
    await Promise.all(jobChunks[i].map(chunk => importCatalogItemBatch(chunk)));
  }
} 

const importBooks = async () => {
  await downloadCatalog();
  await uncompressCatalog();
  await initMongoDbClient();
  await importCatalogItems();
  await closeMongoDbClient();
}

importBooks();