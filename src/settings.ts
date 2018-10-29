/**
 * The regular expression that describes the body of a comment (in the future).
 * For now I'm having a devil of a time debugging regular expressions so we're keeping it simple.
 */

export const commentWordRE = /^(\w+) /;

/** When no translation is known */

export const unknownString = 'No lo sé';

/** The dictionary API key */

export const apiKey = "207a9fb4-bb07-44af-9d9c-bf6bb79405ed";

/** The translation API URL */

export const translationAPI = 'https://www.dictionaryapi.com/api/v3/references/spanish/json/';


/** The spanish dictionary URL */

export const spanishToEnglishDictionaryURL = 'http://www.spanishcentral.com/translate/';

/** The background color of the translation */

export const translationBackgroundColor = "red";

/** The text/foreground color of the translation */

export const translationColor = "black";