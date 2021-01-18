import * as fs from 'fs'
import { checkExistFiles } from "./utils/checkExistFiles"
import { pascalCase, camelCase } from './utils/chgCaseString';
import { program } from 'commander'

function writeIndexFile(dirName: string) {
  return new Promise(() => {
    try {
      const dir = `./src/${dirName}`
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
    } catch (error) {
    }
  });
}

(async function() {

  program
    .description('<Dir/ModuleName>')
    .option('--update <Dir>', 'update Dir/index.ts')
    .parse(process.argv)


  const updateOption = program.opts().update
  if (updateOption) {
    await writeIndexFile(updateOption)
    process.exit(0);
  }

  // 引数の確認
  const args = program.args[0].split('/')
  if (args.length !== 2) {
    console.error('\u001b[31m'+`ERROR: require <Dir/ModuleName>`+'\u001b[0m')
    process.exit(0);
  }

  const dirName = camelCase(args[0])
  const moduleName = pascalCase(args[1])

  const dir = `./src/${dirName}`

  // If the directory is not yet created, create it.
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

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
  const existFiles = checkExistFiles(...modulePaths.map(v => v.file))
  const isExistFiles = 0 < existFiles.length
  if (isExistFiles) {
    console.error('\u001b[31m'+`ERROR: The file already exists.`+'\u001b[0m')
    console.error('\u001b[31m'+`Please remove ${existFiles.reduce((acc, crr) => acc ? `${acc} and "${crr}"` : `"${crr}"`, '')}.`+'\u001b[0m')
    process.exit(0);
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

  // update index.ts it
  writeIndexFile(dirName)
})()
