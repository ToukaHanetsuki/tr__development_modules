const fs = require('fs')

/**
 * ファイルの存在確認
 *
 * @param {string} path
 * @return {boolean}
 */
function isExistFile(path) {
  try {
    fs.statSync(path);
    return true
  } catch(err) {
    if(err.code === 'ENOENT') return false
  }
}

const moduleName = process.argv[2]
const moduleFilePath = `./src/modules/${moduleName}.ts`
const moduleSpecFilePath = `./src/modules/${moduleName}.spec.ts`

if (isExistFile(moduleFilePath) || isExistFile(moduleSpecFilePath)) {
  return console.error('ERROR: The file already exists.')
}

const moduleTemplate = [
  `export class ${moduleName} {`,
  '\tpublic static example() {',
  '',
  '\t};',
  '}'
].join('\n')

fs.writeFileSync(`./src/modules/${moduleName}.ts`, moduleTemplate, 'utf-8', (err) => {
  if (err) console.error(err)
})
console.log(`✨ Create module template ./src/modules/${moduleName}.ts`);

const moduleSpecTemplate = [
  `import { ${moduleName} } from './${moduleName}';`,
  '',
  `describe('Test the ${moduleName}.', () => {`,
  '\ttest(\'Test the example method response to undefined.\', () => {',
  `\t\tconst resp = ${moduleName}.example();`,
  '\t\texpect(resp).toBe(undefined);',
  '\t});',
  '})'
].join('\n')

fs.writeFileSync(`./src/modules/${moduleName}.spec.ts`, moduleSpecTemplate, 'utf-8', (err) => {
  if (err) console.error(err)
})
console.log(`✨ Create module template ./src/modules/${moduleName}.spec.ts`);

// index.tsの追記
fs.readdir('./src/modules', (err, files) => {
  if (err) throw err;
  const fileList = files.filter(file => {
    const filePath = `./src/modules/${file}`
    return fs.statSync(filePath).isFile() && /^(?!.*(spec|index)).*\.ts$/.test(file);
  })
  const moduleNames = fileList.map(fileName => fileName.replace(/.ts$/, ''))

  const indexFileText = [
    ...moduleNames.map(name => `import { ${name} } from './${name}';`),
    '',
    'export const Modules = {',
      ...moduleNames.map((name, i) => {
        return moduleNames.length - 1 === i ? `\t${name}` : `\t${name},`
      }),
    '};',
  ].join('\n')

  fs.writeFileSync(`./src/modules/index.ts`, indexFileText, 'utf-8')
  console.log(`✨ Update ./src/modules/index.ts`);
});