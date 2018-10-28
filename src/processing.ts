import { ajax } from "rxjs/ajax";
import { map, concatMap, toArray } from "rxjs/operators";
import { Observable, from, EMPTY } from "rxjs";

import * as settings from './settings';

/**
 * Find the index of the first vowel in the given string
 * @param  {string} word A string to search for vowels
 * @return {number}      The index of the first vowel matched, -1 if no vowels found
 */

function getFirstVowelIndex(word: string): number {

  var index = -1;

  const letters = word.split('');

  for (let i=0; i < letters.length; i++) {

    const letterIndexInVowels = settings.vowels.indexOf(letters[i].toLowerCase());

    if (letterIndexInVowels > -1) {
      index = i;
      break;
    }
  }

  return index;
}


/**
 * Moves the initial consonants to the end of the word and then supplies the appropriate suffix
 * @param  {string} word     A word to translate
 * @return {string}          The translated word
 */

export function convertToPigLatin(word: string): string {
  // Start by initializing as if we don't have a vowel

  var suffix  = 'way';
  var initial = '';
  var base    = word;

  // Rules differ if we found a vowel:

  const vowelIndex = getFirstVowelIndex(word)
  if (vowelIndex > -1) {
    suffix  = 'ay';
    initial = word.slice(0, vowelIndex);
    base    = word.slice(vowelIndex);
  }

  return base + initial + suffix;
}

export const fetchDownloads = (pkg: string): Observable<number> => {
  return ajax({
    url: `https://api.npmjs.org/downloads/point/last-week/${pkg}`
  }).pipe(
    map(v => {
      return v && v.response && v.response.downloads ? v.response.downloads : 0;
    })
  );
};


/**
 * Looks up the given word in the dictionary.
 * @param  {string} word     A word to look up
 * @return {string}          The definition
 */

export function getDictionaryDef(word: string): string {
  return "";
}