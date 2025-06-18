import { StyleSheet, TextStyle, ViewStyle, ImageStyle } from 'react-native';

type Style = ViewStyle | TextStyle | ImageStyle;
type StyleInput = Style | Style[] | false | null | undefined;

export function cn(...inputs: StyleInput[]): Style {
  const styles: Style[] = [];
  
  inputs.forEach(input => {
    if (input) {
      if (Array.isArray(input)) {
        styles.push(...input);
      } else {
        styles.push(input);
      }
    }
  });
  
  // Combina todos os estilos em um único objeto
  return Object.assign({}, ...styles);
}