/**
 * Bootstrap function that is called before the application gets started.
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 */

module.exports = async () => {
  // Check if we already have words with the new schema
  const wordCount = await strapi.entityService.count('api::word.word', {
    filters: {
      originalWord: {
        $notNull: true
      }
    }
  });
  
  if (wordCount > 0) {
    console.log('Data already exists, skipping bootstrap...');
    return;
  }

  console.log('Bootstrapping sample data...');

  // Create sample Author
  const author = await strapi.entityService.create('api::author.author', {
    data: {
      name: 'Sample Author'
    }
  });
  console.log('Created author:', author.id);

  // Create sample Translator
  const translator = await strapi.entityService.create('api::translator.translator', {
    data: {
      name: 'Sample Translator'
    }
  });
  console.log('Created translator:', translator.id);

  // Create sample Book
  const book = await strapi.entityService.create('api::book.book', {
    data: {
      title: 'Sample Book'
    }
  });
  console.log('Created book:', book.id);

  // Sample words with new schema
  const words = [
    {
      originalWord: 'house',
      originalLanguage: 'English',
      armenianWord: 'տուն',
      originalExampleSentence: 'I live in a beautiful house.',
      armenianExampleSentence: 'Ես ապրում եմ գեղեցիկ տան մեջ:'
    },
    {
      originalWord: 'home',
      originalLanguage: 'English',
      armenianWord: 'տուն',
      originalExampleSentence: 'Welcome home!',
      armenianExampleSentence: 'Բարի վերադարձ տուն:'
    },
    {
      originalWord: 'дом',
      originalLanguage: 'Russian',
      armenianWord: 'տուն',
      originalExampleSentence: 'Это мой дом.',
      armenianExampleSentence: 'Սա իմ տունն է:'
    },
    {
      originalWord: 'maison',
      originalLanguage: 'French',
      armenianWord: 'տուն',
      originalExampleSentence: 'C\'est une grande maison.',
      armenianExampleSentence: 'Սա մեծ տուն է:'
    }
  ];

  const createdWords = [];

  for (const wordData of words) {
    const word = await strapi.entityService.create('api::word.word', {
      data: {
        ...wordData,
        author: author.id,
        translator: translator.id,
        book: book.id
      }
    });
    createdWords.push(word);
    console.log('Created word:', word.originalWord, '->', word.armenianWord);
  }

  // Create connections between words that represent the same concept
  // All these words mean "house/home" in different languages
  const connections = [
    {
      wordId: createdWords[0].id,
      connectedWordIds: [createdWords[1].id, createdWords[2].id, createdWords[3].id]
    },
    {
      wordId: createdWords[1].id,
      connectedWordIds: [createdWords[0].id, createdWords[2].id, createdWords[3].id]
    },
    {
      wordId: createdWords[2].id,
      connectedWordIds: [createdWords[0].id, createdWords[1].id, createdWords[3].id]
    },
    {
      wordId: createdWords[3].id,
      connectedWordIds: [createdWords[0].id, createdWords[1].id, createdWords[2].id]
    }
  ];

  for (const connection of connections) {
    await strapi.entityService.update('api::word.word', connection.wordId, {
      data: {
        connections: connection.connectedWordIds
      }
    });
    console.log('Created connections for word:', connection.wordId);
  }

  console.log('Bootstrap completed successfully!');
};
