import type { SkParagraph } from "canvaskit-wasm";
import { performance } from "perf_hooks";
import * as React from "react";
import { PaintStyle, TextAlignEnum, useFontManager } from "../src";

const fontPaint = { style: PaintStyle.Fill, antiAlias: true };

const X = 250;
const Y = 250;
const paragraphText =
  "The quick brown fox 🦊 ate a zesty hamburgerfonts 🍔.\nThe 👩‍👩‍👧‍👧 laughed.";

export default () => {
  const skParagraphRef = React.useRef<SkParagraph>(null);
  // const requestRef = React.useRef<number>()
  const fontManager = useFontManager();

  const calcWrapTo = (time: number): number =>
    350 + 150 * Math.sin(time / 2000);
  const [wrapTo, setWrapTo] = React.useState(calcWrapTo(performance.now()));

  // const animate: FrameRequestCallback = time => {
  //   setWrapTo(calcWrapTo(time))
  //   requestRef.current = requestAnimationFrame(animate)
  // }

  // React.useEffect(() => {
  //   requestRef.current = requestAnimationFrame(animate)
  //   return () => {
  //     if (requestRef.current) {
  //       cancelAnimationFrame(requestRef.current)
  //     }
  //   }
  // }, [])

  const posA = skParagraphRef.current?.getGlyphPositionAtCoordinate(X, Y);
  let glyph;
  if (posA) {
    const cp = paragraphText.codePointAt(posA.pos);
    if (cp) {
      glyph = String.fromCodePoint(cp);
    }
  }

  // @ts-ignore
  // The default skia canvaskit font manager has only one font (Noto Mono).
  if (fontManager.getFamilyName(0) === "Noto Mono") {
    return (
      <cg-canvas clear="#FFFFFF">
        <cg-text x={5} y={450} paint={fontPaint}>
          Fetching Font data...
        </cg-text>
      </cg-canvas>
    );
  }

  return (
    <cg-canvas clear="#FFFFFF">
      <cg-paragraph
        fontManager={fontManager}
        ref={skParagraphRef}
        textStyle={{
          color: "#000000",
          fontFamilies: ["Roboto", "Noto Color Emoji"],
          fontSize: 50,
        }}
        textAlign={TextAlignEnum.Left}
        maxLines={7}
        ellipsis="..."
        layout={wrapTo}
      >
        {paragraphText}
      </cg-paragraph>
      <cg-line x1={wrapTo} y1={0} x2={wrapTo} y2={400} paint={fontPaint} />
      <cg-text x={5} y={450} paint={fontPaint}>{`At (${X.toFixed(
        2
      )}, ${Y.toFixed(2)}) glyph is '${glyph}'`}</cg-text>
    </cg-canvas>
  );
};
