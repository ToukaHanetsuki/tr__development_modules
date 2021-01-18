import * as fs from 'fs';

/**
 * ファイルの存在確認
 *
 * @param {string} path
 * @return {*} {string[]}
 */
export function checkExistFiles(...paths: string[]): string[] {
  return paths.map(path => {
    if (fs.existsSync(path)) {
      return path;
    }
  }).filter(v => v);
}