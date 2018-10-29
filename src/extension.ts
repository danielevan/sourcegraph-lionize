import * as settings    from './settings'
import * as processing  from './processing'
import * as sourcegraph from "sourcegraph"

import { from, EMPTY } from "rxjs";
import { map, concatMap, toArray } from "rxjs/operators";


/** Entrypoint for the Lionize Sourcegraph extension. */

export function activate(): void {
  sourcegraph.workspace.onDidOpenTextDocument.subscribe(doc => {
    from(doc.text.split("\n"))
      .pipe(
        concatMap((line, lineNumber) => {

          // Search for a match (as defined by settings.commentRE) in the current line

          const match = settings.commentWordRE.exec(line);
          if (match && match.length > 1) {

            // There is a match, pass it to the translation process

            const englishWord = match[1] ? match[1] : match[2];
            //console.log ("Matched word " + englishWord);
            return processing.fetchWordTranslation(englishWord).pipe(
              map(translation => ({ translation, lineNumber, englishWord }))
            );
          } else {

            // No match, return rxjs.EMPTY

            return EMPTY;
          }
        }),
        toArray()
      )
      .subscribe(annotations => {
        if (
          sourcegraph.app.activeWindow &&
          sourcegraph.app.activeWindow.visibleViewComponents.length > 0
        ) {

          sourcegraph.app.activeWindow.visibleViewComponents[0].setDecorations(
            null,
            annotations.map(({ translation, lineNumber, englishWord }) => ({
              range: new sourcegraph.Range(
                new sourcegraph.Position(lineNumber, 0),
                new sourcegraph.Position(lineNumber, 0)
              ),
              after: {
                contentText: " (" + translation + ")",
                linkURL: settings.spanishToEnglishDictionaryURL + englishWord,
                backgroundColor: settings.translationBackgroundColor,
                color: settings.translationColor
              }
            }))
          );
        }
      });
  });
}
