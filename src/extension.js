import * as sourcegraph from "sourcegraph";
const tokenAt = (text, pos) => {
    var line = text.split("\n")[pos.line];
    const leftMatches = /\w+$/.exec(line.slice(0, pos.character));
    const rightMatches = /^\w+/.exec(line.slice(pos.character));
    if (!leftMatches && !rightMatches) {
        return null;
    }
    else if (!leftMatches) {
        return rightMatches && rightMatches[0];
    }
    else if (!rightMatches) {
        return leftMatches && leftMatches[0];
    }
    else {
        return leftMatches[0] + rightMatches[0];
    }
};
/**
 * Find the position of the first vowel in the given string
 * @param  {string} word A string to search for vowels
 * @return {number}      The index position of the first vowel matched, 0 if no vowels found
 */
function getVowelPosition(word) {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const position = word.split('').findIndex(character => vowels.includes(character));
    // if there are no vowels then return 0, otherwise return the index of the first vowel
    return position === -1 ? 0 : position;
}
/**
 * Moves the initial consonants to the end of the word and then supplies the appropriate suffix
 * @param  {string} word     A segment from the users input
 * @param  {number} position The position of the vowel in the word
 * @return {string}          The translated word
 */
function convertToPigLatin(word) {
    const position = getVowelPosition(word);
    const initial = word.slice(0, position);
    const base = word.slice(position);
    const suffix = position > 0 ? 'ay' : 'way';
    return base + initial + suffix;
}
const highlightMatchingLines = (text, token) => {
    sourcegraph.app.activeWindow.visibleViewComponents[0].setDecorations(null, text
        .split("\n")
        .map((line, i) => [i, line])
        .filter(([_, line]) => new RegExp("\\b" + token + "\\b").test(line))
        .map(([i, _]) => ({
        range: new sourcegraph.Range(new sourcegraph.Position(i, 0), new sourcegraph.Position(i, 0)),
        //backgroundColor: "khaki"
        after: {
            contentText: " hello!!!!",
            //linkURL: `https://www.npmjs.com/package/${pkg}`,
            backgroundColor: "pink",
            color: "black"
        }
    })));
};
/** Entrypoint for the Lionize Sourcegraph extension. */
/*
export function activate(): void {
  function activeEditor(): sourcegraph.CodeEditor | undefined {
    return sourcegraph.app.activeWindow?
      sourcegraph.app.activeWindow.visibleViewComponents[0] : undefined
  }

  sourcegraph.languages.registerHoverProvider(["*"], {
    provideHover: () => ({ contents: { value: "🦁 convert " + convertToPigLatin("Dog")} })
  })
}
*/
export function activate() {
    sourcegraph.languages.registerHoverProvider(["*"], {
        provideHover: (doc, pos) => {
            const token = tokenAt(doc.text, pos);
            if (token) {
                console.log(token);
                highlightMatchingLines(doc.text, token);
            }
            return null;
        }
    });
}
