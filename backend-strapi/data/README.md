# PDF Import Data

## Format

One line per entry: `easternArmenian – originalLanguage`

Use en-dash (–) or hyphen (-) as separator between left (Eastern Armenian) and right (original language) parts.

Example:
```
ախտաբանական – pathologique
ախտաբանական կազմախոսություն – anatomie-pathologique
այլասերություն – dégénérescence
```

## To clear and import from your PDF

1. Extract text from your PDF and save as a `.txt` file in this folder
2. Put one entry per line in the format above
3. Stop Strapi if running
4. Run Strapi with:
   ```bash
   cd backend-strapi
   CLEAR_AND_IMPORT_PDF=1 IMPORT_FILE=./data/your-file.txt npm run develop
   ```
5. Strapi will clear all word entries, books, translators, then import from your file
6. A default Book and Translator "PDF Import" will be created for all entries

## Default sample file

`sample-import.txt` contains 3 example French entries.
