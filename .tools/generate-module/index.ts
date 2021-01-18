import * as fs from 'fs'
import { program } from 'commander'

/**
 * キャメルケースへ変換 sampleString
 * @param string
 * @return string
 */
function camelCase(str: string): string {
  str = str.charAt(0).toLowerCase() + str.slice(1);
  return str.replace(/[-_](.)/g, (_, group) => {
    return group.toUpperCase()
  });
}

/**
 * パスカルケースへ変換 SampleString
 * @param string
 * @return string
 */
function pascalCase(str: string): string {
  const camel = camelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/**
 * Run console.log() color is green
 *
 * @param {string} msg
 */
function saySuccessMessage(msg: string): void {
  console.log('\u001b[32m✨ ' + msg + '\u001b[0m')
}

/**
 * Run console.error() color is red
 *
 * @param {string} msg
 */
function sayErrorMessage(msg: string): void {
  console.log('\u001b[31mERROR: ' + msg + '\u001b[0m')
}

(async function() {

  program.description('generate <dir/module>')
  program.parse(process.argv)

  // If args length is not equaled 2, error it.
  const args = program.args[0].split('/')
  if (args.length !== 2) {
    sayErrorMessage('require <Dir/ModuleName>')
    return;
  }

  const dirName = camelCase(args[0])
  const moduleName = pascalCase(args[1])

  const dir = `./src/${dirName}`

  // If the directory is not yet created, create it.
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)

  const modulePaths = [
    {
      file: `${dir}/${moduleName}.ts`,
      template: `./.tools/generate-module/templates/$MODULE_NAME.ts`
    },
    {
      file: `${dir}/${moduleName}.spec.ts`,
      template: `./.tools/generate-module/templates/$MODULE_NAME.spec.ts`
    }
  ]

  // If dir/moduleName.ts and dir/moduleName.spec.ts is yet exist, error it.
  const existFiles = modulePaths.map(v => v.file).map(path => fs.existsSync(path) && path).filter(v => v)
  const isExistFiles = 0 < existFiles.length
  if (isExistFiles) {
    const errorMsg = `The file already exists. Please remove ${existFiles.reduce((acc, crr) => acc ? `${acc} and "${crr}"` : `"${crr}"`, '')}.`
    sayErrorMessage(errorMsg)
    return;
  }

  // Create modules it.
    modulePaths.forEach(({file, template}) => {
    const data = fs.readFileSync(template, 'utf-8')
    const result = data.replace(/\$MODULE_NAME/g, moduleName)

    fs.writeFileSync(file, result, 'utf-8')
    saySuccessMessage(`Create module ${file}.`)
  })

  // Update index.ts it
  const files = fs.readdirSync(dir)
  const fileList = files.filter(file => {
    const filePath = `${dir}/${file}`
    return fs.statSync(filePath).isFile() && /^(?!.*(spec|index)).*\.ts$/.test(file)
  })
  const moduleNames = fileList.map(fileName => fileName.replace(/.ts$/, ''))

  const indexFileText = [
    ...moduleNames.map(name => `import { ${name} } from './${name}';`),
    '',
    `export const ${pascalCase(dirName)} = {`,
      ...moduleNames.map((name, i) => {
        return moduleNames.length - 1 === i ? `\t${name}` : `\t${name},`
      }),
    '};',
  ].join('\n')

  fs.writeFileSync(`${dir}/index.ts`, indexFileText, 'utf-8')
  saySuccessMessage(`Update ${dir}/index.ts`)
})()
