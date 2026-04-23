/**
 * Canonical authors, books, and translator for the dictionary project.
 * Seeded on bootstrap so Strapi relation fields act as controlled vocabularies.
 */

module.exports.CANONICAL_AUTHORS = [
  { nameArmenian: 'Միշել Ֆուկո', nameOriginalLanguage: 'Michel Foucault', originalLanguageType: 'french' },
  { nameArmenian: 'Ալան Բադիու', nameOriginalLanguage: 'Alain Badiou', originalLanguageType: 'french' },
  { nameArmenian: 'Անտոնիո Գրամշի', nameOriginalLanguage: 'Antonio Gramsci', originalLanguageType: 'italian' },
  { nameArmenian: 'Ժան-Ֆրանսուա Լիոտար', nameOriginalLanguage: 'Jean-Francois Lyotard', originalLanguageType: 'french' },
  { nameArmenian: 'Հաննա Արենդթ', nameOriginalLanguage: 'Hannah Arendt', originalLanguageType: 'english' },
  { nameArmenian: 'Յուրգեն Հաբերմաս', nameOriginalLanguage: 'Jürgen Habermas', originalLanguageType: 'german' },
  { nameArmenian: 'Ջորջո Ագամբեն', nameOriginalLanguage: 'Giorgio Agamben', originalLanguageType: 'italian' },
  { nameArmenian: 'Ջուդիթ Բաթլեր', nameOriginalLanguage: 'Judith Butler', originalLanguageType: 'english' },
  { nameArmenian: 'Էռնեստո Լակլաու', nameOriginalLanguage: 'Ernesto Laclau', originalLanguageType: 'english' },
  { nameArmenian: 'Սլավոյ Ժիժեկ', nameOriginalLanguage: 'Slavoj Zizek', originalLanguageType: 'english' },
  { nameArmenian: 'Սիմոն դը Բովուար', nameOriginalLanguage: 'Simone de Beauvoir', originalLanguageType: 'french' },
  { nameArmenian: 'Էդուարդ Սայիդ', nameOriginalLanguage: 'Edward Said', originalLanguageType: 'english' },
]

/** authorNameArmenian must match an entry in CANONICAL_AUTHORS */
module.exports.CANONICAL_BOOKS = [
  {
    nameArmenian: 'Գիտելիքի հնագիտությունը',
    nameOriginalLanguage: "L'Archéologie du savoir",
    originalLanguageType: 'french',
    authorNameArmenian: 'Միշել Ֆուկո',
  },
  {
    nameArmenian: 'Դարը',
    nameOriginalLanguage: 'Le Siècle',
    originalLanguageType: 'french',
    authorNameArmenian: 'Ալան Բադիու',
  },
  {
    nameArmenian: 'Բանտի տետրեր',
    nameOriginalLanguage: 'Quaderni del carcere',
    originalLanguageType: 'italian',
    authorNameArmenian: 'Անտոնիո Գրամշի',
  },
  {
    nameArmenian: 'Հետարդիական կացություն (եւ յարակից գործեր)',
    nameOriginalLanguage:
      'La condition postmoderne; Instructions Païennes et Le Postmoderne expliqué aux enfants',
    originalLanguageType: 'french',
    authorNameArmenian: 'Ժան-Ֆրանսուա Լիոտար',
  },
  {
    nameArmenian: 'Ամբողջատիրության ակունքները',
    nameOriginalLanguage: 'The Origins of Totalitarianism',
    originalLanguageType: 'english',
    authorNameArmenian: 'Հաննա Արենդթ',
  },
  {
    nameArmenian: 'Հանրայնության կառուցվածքային փոփոխությունը',
    nameOriginalLanguage: 'Strukturwandel der Öffentlichkeit',
    originalLanguageType: 'german',
    authorNameArmenian: 'Յուրգեն Հաբերմաս',
  },
  {
    nameArmenian: 'Մնացորդք Աւշուիցի: Արխիւը եւ վկան',
    nameOriginalLanguage: "Quel che reste de Auschwitz. L'Archivio e il testimone (Homo sacer III)",
    originalLanguageType: 'italian',
    authorNameArmenian: 'Ջորջո Ագամբեն',
  },
  {
    nameArmenian:
      'Դիպվածականություն, գերիշխանություն, միեղինություն. ժամանակակից երկխոսություններ ձախից',
    nameOriginalLanguage: 'Contingency, Hegemony, Universality: Contemporary Dialogues on the Left',
    originalLanguageType: 'english',
    authorNameArmenian: 'Ջուդիթ Բաթլեր',
  },
  {
    nameArmenian: 'Երկրորդ սեռը',
    nameOriginalLanguage: 'Le deuxième sexe',
    originalLanguageType: 'french',
    authorNameArmenian: 'Սիմոն դը Բովուար',
  },
  {
    nameArmenian: 'Արևելաբանություն',
    nameOriginalLanguage: 'Orientalism',
    originalLanguageType: 'english',
    authorNameArmenian: 'Էդուարդ Սայիդ',
  },
]

module.exports.CANONICAL_TRANSLATOR = {
  nameArmenian: 'Նազարեթ Կարոյան',
  nameOriginalLanguage: 'Nazareth Karoyan',
  originalLanguageType: 'english',
}
