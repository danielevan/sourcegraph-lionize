import { ajax } from "rxjs/ajax";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

import * as settings from './settings';

/**
 * Looks up the given word in the translation dictionary via the API.
 *
 * @param  {string} englishWord  A word to look up
 * @return {string}              The translation if known, or settings.unknownString if no translation available
 */

export const fetchTranslation = (englishWord: string): Observable<number> => {

  // Build the URL that look to the API to translate the English word to Spanish

  const apiURL = settings.translationAPI + englishWord + "?key=" + settings.apiKey;
  console.log ("API URL: " + apiURL);

  return ajax({
    url: apiURL
  }).pipe(
    map(v => {
      return v && v.response && v.response[0] && v.response[0]["shortdef"] ?
          v.response[0]["shortdef"] : settings.unknownString;
    })
  );
};
