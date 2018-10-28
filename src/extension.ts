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
          const match = settings.commentRE.exec(line);
          if (match && match.length > 1) {
            const englishWord = match[1];
            return processing.fetchTranslation(englishWord).pipe(
              map(translation => ({ translation, lineNumber, englishWord }))
            );
          } else {
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
                linkURL: `https://www.npmjs.com/package/${englishWord}`,
                backgroundColor: "pink",
                color: "black"
              }
            }))
          );
        }
      });
  });
}
