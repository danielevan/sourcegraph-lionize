/** The set of characters considered vowels */
export const vowels = ['a', 'e', 'i', 'o', 'u'];

/**
 * The regular expression that describes the body of a comment (in the future).
 * For now I'm having a devil of a time debugging regular expressions so we're keeping it simple.
 */

export const commentRE = /^(\w+) /;

/** When no translation is known */

export const unknownString = 'no lo sé';

/** The dictionary API key */

export const apiKey = "207a9fb4-bb07-44af-9d9c-bf6bb79405ed";

/** The dictionary API URL */

export const dictionaryURL = 'https://www.dictionaryapi.com/api/v3/references/spanish/json/'
