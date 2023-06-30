import { program } from 'commander'

import { emojify } from '../emojify'

import main from './main'

program
  .command('init')
  .description('项目 Lint 规范初始化')
  .action(() => {
    main()
  })

program
  .command('emojify')
  .description('为 Git 提交信息添加 emoji 前缀')
  .argument('<string>', 'Git 提交信息临时文件路径')
  .action((msgPath) => {
    emojify(msgPath)
  })

program.parse()
