const GLYPHS = '!<>-_\\/[]{}—=+*^?#________@#$%&';

export function runTextScramble(from, to, durationMs, onUpdate) {
  return new Promise((resolve) => {
    const start = performance.now();
    const maxLen = Math.max(from.length, to.length);

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);

      let output = '';
      for (let i = 0; i < maxLen; i += 1) {
        const targetChar = to[i] ?? '';
        const revealAt = 0.15 + (i / maxLen) * 0.85;

        if (progress >= revealAt && targetChar) {
          output += targetChar;
        } else if (targetChar) {
          output +=
            GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ||
            GLYPHS[0];
        }
      }

      onUpdate(output.trimEnd() || output);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        onUpdate(to);
        resolve(to);
      }
    };

    requestAnimationFrame(tick);
  });
}
