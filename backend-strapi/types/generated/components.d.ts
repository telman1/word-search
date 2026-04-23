import type { Schema, Struct } from '@strapi/strapi';

export interface WordEntryPartOfSpeechItem extends Struct.ComponentSchema {
  collectionName: 'components_word_entry_part_of_speech_items';
  info: {
    description: 'One part-of-speech tag (repeat for multiple)';
    displayName: 'Part of speech';
  };
  attributes: {
    value: Schema.Attribute.Enumeration<
      [
        '\u0563\u0578\u0575\u0561\u056F\u0561\u0576',
        '\u0561\u056E\u0561\u056F\u0561\u0576',
        '\u0569\u057E\u0561\u056F\u0561\u0576',
        '\u0564\u0565\u0580\u0561\u0576\u0578\u0582\u0576',
        '\u0562\u0561\u0575',
        '\u0574\u0561\u056F\u0562\u0561\u0575',
        '\u056F\u0561\u057A',
        '\u0577\u0561\u0572\u056F\u0561\u057A',
        '\u057E\u0565\u0580\u0561\u0562\u0565\u0580\u0561\u056F\u0561\u0576',
        '\u0571\u0561\u0575\u0576\u0561\u0580\u056F\u0578\u0582\u0569\u0575\u0578\u0582\u0576',
      ]
    > &
      Schema.Attribute.Required;
  };
}

export interface WordEntryPluralFormationItem extends Struct.ComponentSchema {
  collectionName: 'components_word_entry_plural_formation_items';
  info: {
    description: 'One plural-formation option (add another for multiple)';
    displayName: 'Plural formation';
  };
  attributes: {
    value: Schema.Attribute.Enumeration<
      [
        '\u0565\u0580',
        '\u0576\u0565\u0580',
        '\u056B\u056F',
        '\u0561\u0575\u0584',
        '\u056B\u0576\u0584',
        '\u0584',
      ]
    > &
      Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'word-entry.part-of-speech-item': WordEntryPartOfSpeechItem;
      'word-entry.plural-formation-item': WordEntryPluralFormationItem;
    }
  }
}
