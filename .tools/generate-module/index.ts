import * as fs from 'fs'
import { program } from 'commander'

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

(function() {

  program.description('generate <dir/module>')
  program.parse(process.argv)

  // If args length is not equaled 2, error it.
  const args = program.args[0].split('/')
  if (args.length !== 2) {
    console.error('\u001b[31m'+`ERROR: require <Dir/ModuleName>`+'\u001b[0m')
    return;
  }

  const dirName = camelCase(args[0])
  const moduleName = pascalCase(args[1])

  const dir = `./src/${dirName}`

  // If the directory is not yet created, create it.
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const modulePaths = [
    {
      file: `${dir}/${moduleName}.ts`,
      template: require('./templates/module.ts.json')
    },
    {
      file: `${dir}/${moduleName}.spec.ts`,
      template: require('./templates/module.spec.ts.json')
    }
  ]

  // If dir/moduleName.ts and dir/moduleName.spec.ts is yet exist, error it.
  const existFiles = modulePaths.map(v => v.file).map(path => fs.existsSync(path) && path).filter(v => v);
  const isExistFiles = 0 < existFiles.length
  if (isExistFiles) {
    console.error('\u001b[31m'+`ERROR: The file already exists. Please remove ${existFiles.reduce((acc, crr) => acc ? `${acc} and "${crr}"` : `"${crr}"`, '')}.`+'\u001b[0m')
    return;
  }

  // Create modules it.
  modulePaths.forEach(({file, template}) => {
    fs.writeFileSync(
      file,
      template.join('\n').replace(/\$MODULE_NAME/g, moduleName),
      'utf-8'
    )
    console.log('\u001b[32m'+`✨ Create module ${file}.`+'\u001b[0m');
  })

  // Update index.ts it
  fs.readdir(dir, (err, files) => {
    if (err) throw err;
    const fileList = files.filter(file => {
      const filePath = `${dir}/${file}`
      return fs.statSync(filePath).isFile() && /^(?!.*(spec|index)).*\.ts$/.test(file);
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

    console.log('\u001b[32m'+`✨ Update ${dir}/index.ts`+'\u001b[0m');
  })
})()
