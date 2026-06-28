import { Text, TextProps } from 'react-native';

import { FontSizeKey } from '@/theme/typography';
import { useTheme } from '@/theme/ThemeProvider';

type Variant = FontSizeKey;
type Weight = 'regular' | 'medium' | 'bold';

type AppTextProps = TextProps & {
  variant?: Variant;
  weight?: Weight;
  color?: string;
  center?: boolean;
};

/**
 * Themed text primitive. Always routes through the theme so the "Larger Text"
 * and "High Contrast" settings apply everywhere automatically.
 */
export function AppText({
  variant = 'body',
  weight = 'regular',
  color,
  center,
  style,
  ...rest
}: AppTextProps) {
  const theme = useTheme();
  const size = theme.fontSizes[variant];

  return (
    <Text
      // Cap OS font scaling so our own scale stays the source of truth and
      // layouts don't break at extreme system sizes.
      maxFontSizeMultiplier={1.6}
      style={[
        {
          color: color ?? theme.colors.textPrimary,
          fontSize: size,
          lineHeight: Math.round(size * theme.lineHeights[variant]),
          fontWeight: theme.fontWeights[weight],
          textAlign: center ? 'center' : 'auto',
        },
        style,
      ]}
      {...rest}
    />
  );
}
