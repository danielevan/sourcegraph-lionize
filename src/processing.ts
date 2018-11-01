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

export const fetchWordTranslation = (englishWord: string): Observable<number> => {

  // Build the URL that looks to the API to translate the English word to Spanish

  const apiCallURL = settings.wordTranslationAPI + englishWord + "?key=" + settings.apiKey;
  console.log (`API Call URL: ${apiCallURL}`);

  return ajax({
    url: apiCallURL
  }).pipe(
    map(v => {
      return v && v.response && v.response[0] && v.response[0]["shortdef"] ?
          v.response[0]["shortdef"] : settings.unknownString;
    })
  );
};

/**
 * Looks up the given phrase in the translation service via the API.
 *
 * @see    {@link https://cloud.google.com/nodejs/docs/reference/translate/2.1.x/|Google Cloud Translation API}
 * @param  {string} englishPhrase  A phrase to look up
 * @return {string}                The translation if known, or settings.unknownString if no translation available
 */

export const fetchPhraseTranslation = (englishPhrase: string): Observable<number> => {
  const key = require ('./google-api-key.json');

  //console.log ("Google key " + JSON.stringify (key));

  const postData = {
    q: englishPhrase,
    source: 'en',
    target: 'es',
    format: 'text',
    key: key
  };

  const constructorData = {
    url: 'https://translation.googleapis.com/language/translate/v2',
    method: 'POST',
    contentType: 'application/json',
    body: postData
  }

  console.log ('Constructor data ' + JSON.stringify(constructorData));

  return ajax({
    url: 'https://translation.googleapis.com/language/translate/v2',
    method: 'POST',
    //contentType: 'application/json',
    body: postData
  }).pipe(
    map(v => {
      console.log ("Got " + JSON.stringify(v));
      return 1;
      //return v && v.response && v.response[0] && v.response[0]["shortdef"] ?
      //    v.response[0]["shortdef"] : settings.unknownString;
    })
  );

}