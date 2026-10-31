import { describe, expect, it } from "vite-plus/test";

import "~/index.css";
import { applyAppearanceFontVariables } from "./appearanceFonts";

function renderedFontSize(style: (probe: HTMLElement) => void): string {
  const probe = document.createElement("div");
  style(probe);
  document.body.append(probe);
  try {
    return getComputedStyle(probe).fontSize;
  } finally {
    probe.remove();
  }
}

const composerFontSize = () =>
  renderedFontSize((probe) => {
    // The composer editor's own size class.
    probe.className = "text-(length:--font-size-prompt,var(--text-sm))";
  });

const chatFontSize = () =>
  renderedFontSize((probe) => {
    // The chat message's own size class.
    probe.className = "text-(length:--font-size-chat,var(--text-sm))";
  });

const touchComposerFontSize = () =>
  renderedFontSize((probe) => {
    probe.style.fontSize = "var(--font-size-prompt-touch)";
  });

describe("applyAppearanceFontVariables", () => {
  it("sizes the composer from the interface size until fonts are set separately", () => {
    const root = document.documentElement;
    const style = root.getAttribute("style");
    const preferences = {
      sans: "",
      code: "",
      composer: "",
      chat: "",
      sizeInterface: 20,
      sizePrompt: 14,
      sizeChat: null,
      sizeCode: 13,
      smoothing: true,
    };
    try {
      applyAppearanceFontVariables(root, { ...preferences, separate: false });
      expect(composerFontSize()).toBe("17.5px");
      expect(touchComposerFontSize()).toBe("17.5px");

      applyAppearanceFontVariables(root, { ...preferences, separate: true });
      expect(composerFontSize()).toBe("14px");
      // iOS zooms into inputs under 16px.
      expect(touchComposerFontSize()).toBe("16px");
    } finally {
      if (style === null) root.removeAttribute("style");
      else root.setAttribute("style", style);
    }
  });

  it("keeps chat messages on the interface size until a chat size is picked", () => {
    const root = document.documentElement;
    const style = root.getAttribute("style");
    const preferences = {
      sans: "",
      code: "",
      composer: "",
      chat: "",
      sizeInterface: 20,
      sizePrompt: 14,
      sizeCode: 13,
      smoothing: true,
      separate: true,
    };
    try {
      applyAppearanceFontVariables(root, { ...preferences, sizeChat: null });
      expect(chatFontSize()).toBe("17.5px");

      applyAppearanceFontVariables(root, { ...preferences, sizeChat: 14 });
      expect(chatFontSize()).toBe("14px");

      applyAppearanceFontVariables(root, { ...preferences, sizeChat: 14, separate: false });
      expect(chatFontSize()).toBe("17.5px");
    } finally {
      if (style === null) root.removeAttribute("style");
      else root.setAttribute("style", style);
    }
  });
});
