import * as settings    from './settings'
import * as processing  from './processing'
import * as sourcegraph from "sourcegraph"

import { Observable, from, EMPTY } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map, concatMap, toArray } from "rxjs/operators";


/**
*
*/

const tokenAt = (text: string, pos: sourcegraph.Position): string => {
  var line = text.split("\n")[pos.line];

  const leftMatches = /\w+$/.exec(line.slice(0, pos.character));
  const rightMatches = /^\w+/.exec(line.slice(pos.character));

  if (!leftMatches && !rightMatches) {
    return null;
  } else if (!leftMatches) {
    return rightMatches && rightMatches[0];
  } else if (!rightMatches) {
    return leftMatches && leftMatches[0];
  } else {
    return leftMatches[0] + rightMatches[0];
  }
};


/**
*
*/

const highlightMatchingLines = (text, token) => {
  const dictionaryDef = processing.getDictionaryDef(token);
  console.log ("Def: " + dictionaryDef);

  const contentText = " PigLatin: " + processing.convertToPigLatin(token);

  sourcegraph.app.activeWindow.visibleViewComponents[0].setDecorations(
    null,
    text
      .split("\n")
      .map((line, i) => [i, line] as [number, string])
      .filter(([_, line]) => new RegExp("\\b" + token + "\\b").test(line))
      .map(([i, _]) => ({
        range: new sourcegraph.Range(
          new sourcegraph.Position(i, 0),
          new sourcegraph.Position(i, 0)
        ),
        //backgroundColor: "khaki"
         after: {
           contentText: contentText,
           //linkURL: `https://www.npmjs.com/package/${pkg}`,
           backgroundColor: "pink",
           color: "black"
         }
      }))
  );
};

export function activate(): void {
  sourcegraph.workspace.onDidOpenTextDocument.subscribe(doc => {
    from(doc.text.split("\n"))
      .pipe(
        concatMap((line, lineNumber) => {
          const match = settings.commentRE.exec(line);
          if (match && match.length > 1) {
            const pkg = match[1];
            return processing.fetchDownloads(pkg).pipe(
              map(downloads => ({ downloads, lineNumber, pkg }))
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
            annotations.map(({ downloads, lineNumber, pkg }) => ({
              range: new sourcegraph.Range(
                new sourcegraph.Position(lineNumber, 0),
                new sourcegraph.Position(lineNumber, 0)
              ),
              after: {
                contentText: " (" + downloads + " DLs last week)",
                linkURL: `https://www.npmjs.com/package/${pkg}`,
                backgroundColor: "pink",
                color: "black"
              }
            }))
          );
        }
      });
  });
}


/** Entrypoint for the Lionize Sourcegraph extension. */
/*
export function activate(): void {
  sourcegraph.languages.registerHoverProvider(["*"], {
    provideHover: (doc, pos) => {
      const token = tokenAt(doc.text, pos);

      if (token) {
        console.log ("Token: " + token);
        highlightMatchingLines(doc.text, token);
      }

      return null;
    }
  });
}
*/