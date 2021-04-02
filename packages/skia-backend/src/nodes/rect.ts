import type { CanvasKit, SkFont, SkPaint } from "canvaskit-oc";
import { isCkCanvas } from "./canvas";
import { toSkFont, toSkPaint } from "../skia-element-mapping";
import {
  CkElement,
  CkElementContainer,
  CkElementCreator,
  CkElementProps,
  CkObjectTyping,
  Paint,
} from "../skia-element-types";

export interface CkRectProps extends CkElementProps<never> {
  paint?: Paint;
  fLeft: number;
  fTop: number;
  fRight: number;
  fBottom: number;
}

class CkRect implements CkElement<"cg-rect"> {
  readonly canvasKit: CanvasKit;
  readonly props: CkObjectTyping["cg-rect"]["props"];
  readonly skObjectType: CkObjectTyping["cg-rect"]["name"] = "Rect";
  readonly type: "cg-rect" = "cg-rect";

  private readonly defaultPaint: SkPaint;

  private renderPaint?: SkPaint;
  deleted = false;

  constructor(canvasKit: CanvasKit, props: CkObjectTyping["cg-rect"]["props"]) {
    this.canvasKit = canvasKit;
    this.props = props;

    this.defaultPaint = new this.canvasKit.SkPaint();
    this.defaultPaint.setStyle(this.canvasKit.PaintStyle.Stroke);
    this.defaultPaint.setAntiAlias(true);
  }

  render(parent?: CkElementContainer<any>): void {
    if (this.deleted) {
      throw new Error("BUG. Rect element deleted.");
    }

    if (parent && isCkCanvas(parent)) {
      const { fLeft, fRight, fTop, fBottom } = this.props;

      // TODO we can be smart and only recreate the paint object if the paint props have changed.
      this.renderPaint?.delete();
      this.renderPaint = toSkPaint(this.canvasKit, this.props.paint);

      parent.skObject?.drawRect(
        {
          fLeft: fLeft ?? 0,
          fTop: fTop ?? 0,
          fRight: fRight ?? 0,
          fBottom: fBottom ?? 0,
        },
        this.renderPaint ?? this.defaultPaint
      );
    }
  }

  delete() {
    if (this.deleted) {
      return;
    }
    this.deleted = true;
    this.defaultPaint.delete();
    this.renderPaint?.delete();
  }
}

export const createCkRect: CkElementCreator<"cg-rect"> = (
  type,
  props,
  canvasKit
) => new CkRect(canvasKit, props);
