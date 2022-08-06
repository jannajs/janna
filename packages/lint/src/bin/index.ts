import { program } from 'commander'

import prepareCommitMsg from '../prepareCommitMsg'
import verifyCommit from '../verifyCommit'

import main from './main'

program
  .command('init')
  .description('项目 Lint 规范初始化')
  .action(() => {
    main()
  })

program
  .command('prepare-commit-msg')
  .description('Git 提交信息预处理')
  .argument('<string>', 'Git 提交信息临时文件路径')
  .option('-d, --debug', 'Debug 模式')
  .action((msgPath, options) => {
    prepareCommitMsg(msgPath, options.debug)
  })

program
  .command('verify-commit')
  .description('Git 提交信息验证')
  .argument('<string>', 'Git 提交信息临时文件路径')
  .option('-d, --debug', 'Debug 模式')
  .action((msgPath, options) => {
    verifyCommit(msgPath, options.debug)
  })

program.parse()
