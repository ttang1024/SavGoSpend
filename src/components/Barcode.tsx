import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

type BarcodeProps = {
  /** The value encoded by the bars (e.g. the membership number). */
  value: string;
  /** Bar colour. Defaults to near-black for reliable scanner contrast. */
  color?: string;
  height?: number;
  /** Width of a single module; bars are 1–3 modules wide. */
  moduleWidth?: number;
};

/**
 * A scannable-looking barcode rendered entirely with Views — no native module
 * or image, so it works offline and at any text scale. The pattern is derived
 * deterministically from `value`, so a given membership number always renders
 * the same bars. (Decorative: the human-readable number below it carries the
 * real data for accessibility and manual entry.)
 */
export function Barcode({
  value,
  color = '#111111',
  height = 88,
  moduleWidth = 3,
}: BarcodeProps) {
  const widths = useMemo(() => buildBars(value), [value]);

  return (
    <View
      style={styles.row}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {widths.map((w, i) => (
        <View
          key={i}
          style={{
            width: w * moduleWidth,
            height,
            // Even indices are bars; odd indices are the spaces between them.
            backgroundColor: i % 2 === 0 ? color : 'transparent',
          }}
        />
      ))}
    </View>
  );
}

/**
 * Build alternating bar/space widths (in modules) starting and ending with a
 * guard bar. A small seeded PRNG keeps the output stable per value.
 */
function buildBars(value: string): number[] {
  let seed = 0;
  for (let i = 0; i < value.length; i++) {
    seed = (seed * 31 + value.charCodeAt(i)) >>> 0;
  }
  let state = seed || 1;
  const next = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };

  const moduleCount = Math.max(48, value.length * 6);
  const widths: number[] = [2]; // leading guard bar
  for (let i = 0; i < moduleCount; i++) {
    widths.push(1 + Math.floor(next() * 3)); // 1–3 modules
  }
  widths.push(2); // trailing guard bar
  return widths;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end' },
});
