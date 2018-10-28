import { ajax } from "rxjs/ajax";
import { map, concatMap, toArray } from "rxjs/operators";
import { Observable } from "rxjs";

import * as settings from './settings';

/**
 * Looks up the given word in the translation dictionary.
 * @param  {string} word     A word to look up
 * @return {string}          The translation, or settings.unknownString if no translation available
 */

export const fetchTranslation = (pkg: string): Observable<number> => {
  const url = settings.dictionaryURL + pkg + "?key=" + settings.apiKey;
  console.log ("URL: " + url);

  return ajax({
    url: url
  }).pipe(
    map(v => {
      return v && v.response && v.response[0] && v.response[0]["shortdef"] ?
          v.response[0]["shortdef"] : settings.unknownString;
    })
  );
};
