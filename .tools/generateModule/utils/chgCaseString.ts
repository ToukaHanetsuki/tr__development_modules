/**
 * キャメルケースへ変換 sampleString
 * @param string
 * @return string
 */
export function camelCase(str: string): string {
  str = str.charAt(0).toLowerCase() + str.slice(1);
  return str.replace(/[-_](.)/g, (match, group1) => {
      return group1.toUpperCase();
  });
}

/**
 * パスカルケースへ変換 SampleString
 * @param string
 * @return string
 */
export function pascalCase(str: string): string {
  const camel = camelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}