/**
 * Script to clean up old word records that have null values for the new schema fields
 * Run this with: node scripts/cleanup-old-words.js
 * 
 * Note: This requires Strapi to be running. You can also delete records manually
 * via the Strapi admin panel at http://localhost:1337/admin
 */

const Strapi = require('@strapi/strapi');

async function cleanup() {
  const app = await Strapi().load();
  
  try {
    // Find all words with null originalWord (old schema records)
    const oldWords = await app.entityService.findMany('api::word.word', {
      filters: {
        originalWord: {
          $null: true
        }
      }
    });

    console.log(`Found ${oldWords.length} old word records to delete...`);

    // Delete old words
    for (const word of oldWords) {
      await app.entityService.delete('api::word.word', word.id);
      console.log(`Deleted word ID: ${word.id}`);
    }

    console.log(`Successfully deleted ${oldWords.length} old word records.`);
    
    // Also clean up old relations if they exist
    const oldRelations = await app.entityService.findMany('api::relation.relation', {});
    if (oldRelations.length > 0) {
      console.log(`Found ${oldRelations.length} old relation records to delete...`);
      for (const relation of oldRelations) {
        await app.entityService.delete('api::relation.relation', relation.id);
      }
      console.log(`Successfully deleted ${oldRelations.length} old relation records.`);
    }

    await app.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error cleaning up old records:', error);
    await app.destroy();
    process.exit(1);
  }
}

cleanup();

