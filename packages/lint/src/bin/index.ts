import { program } from 'commander'

import { commitMsgPathEmojify } from '../commit-msg-path-emojify'

import main from './main'

program
  .command('init')
  .option('-p, --prettier', '使用 prettier，默认不使用', false)
  .description('项目 Lint 规范初始化')
  .action((options) => {
    const { prettier } = options
    main({ prettier })
  })

program
  .command('emojify')
  .description('为 Git 提交信息添加 emoji 前缀')
  .argument('<string>', 'Git 提交信息临时文件路径')
  .action((msgPath: string) => {
    commitMsgPathEmojify(msgPath)
  })

program.parse()
