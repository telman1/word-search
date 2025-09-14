'use strict';

/**
 * Bootstrap function that is called before the application gets started.
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 */

module.exports = async () => {
  // Check if we already have data
  const languageCount = await strapi.entityService.count('api::language.language');
  
  if (languageCount > 0) {
    console.log('Data already exists, skipping bootstrap...');
    return;
  }

  console.log('Bootstrapping sample data...');

  // Create Armenian language
  const armenianLanguage = await strapi.entityService.create('api::language.language', {
    data: {
      name: 'Armenian',
      code: 'hy'
    }
  });

  console.log('Created Armenian language:', armenianLanguage.id);

  // Sample Armenian words
  const words = [
    {
      lemma: 'տուն',
      part_of_speech: 'noun',
      notes: 'A dwelling place, home'
    },
    {
      lemma: 'տան',
      part_of_speech: 'noun',
      notes: 'Genitive form of տուն'
    },
    {
      lemma: 'տանը',
      part_of_speech: 'noun',
      notes: 'Definite form of տան'
    },
    {
      lemma: 'տներ',
      part_of_speech: 'noun',
      notes: 'Plural form of տուն'
    },
    {
      lemma: 'տներում',
      part_of_speech: 'noun',
      notes: 'Locative plural form of տուն'
    },
    {
      lemma: 'տնակ',
      part_of_speech: 'noun',
      notes: 'Diminutive form of տուն'
    },
    {
      lemma: 'տնային',
      part_of_speech: 'adjective',
      notes: 'Adjective form of տուն'
    },
    {
      lemma: 'տնակային',
      part_of_speech: 'adjective',
      notes: 'Adjective form of տնակ'
    }
  ];

  const createdWords = [];

  for (const wordData of words) {
    const word = await strapi.entityService.create('api::word.word', {
      data: {
        ...wordData,
        language: armenianLanguage.id
      }
    });
    createdWords.push(word);
    console.log('Created word:', word.lemma);
  }

  // Create relations
  const relations = [
    {
      from_word: createdWords[0].id, // տուն
      to_word: createdWords[1].id,  // տան
      relation_type: 'stem',
      comment: 'Genitive form'
    },
    {
      from_word: createdWords[0].id, // տուն
      to_word: createdWords[2].id,  // տանը
      relation_type: 'stem',
      comment: 'Definite genitive form'
    },
    {
      from_word: createdWords[0].id, // տուն
      to_word: createdWords[3].id,  // տներ
      relation_type: 'stem',
      comment: 'Plural form'
    },
    {
      from_word: createdWords[0].id, // տուն
      to_word: createdWords[4].id,  // տներում
      relation_type: 'stem',
      comment: 'Locative plural form'
    },
    {
      from_word: createdWords[0].id, // տուն
      to_word: createdWords[5].id,  // տնակ
      relation_type: 'derived',
      comment: 'Diminutive form'
    },
    {
      from_word: createdWords[0].id, // տուն
      to_word: createdWords[6].id,  // տնային
      relation_type: 'derived',
      comment: 'Adjective form'
    },
    {
      from_word: createdWords[5].id, // տնակ
      to_word: createdWords[7].id,  // տնակային
      relation_type: 'derived',
      comment: 'Adjective form of diminutive'
    }
  ];

  for (const relationData of relations) {
    const relation = await strapi.entityService.create('api::relation.relation', {
      data: relationData
    });
    console.log('Created relation:', relation.id);
  }

  console.log('Bootstrap completed successfully!');
};
