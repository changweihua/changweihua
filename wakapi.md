# wakapi 代码统计配置

```
name: WakaTime Readme

on:
  workflow_dispatch:
  schedule:
    - cron: '0 20 * * *'

jobs:
  update-readme:
    name: Update README
    runs-on: ubuntu-latest
    steps:
      - uses: athul/waka-readme@master
        with:
          API_BASE_URL: ${{ secrets.WAKAPI_BASE_URL }}
          WAKATIME_API_KEY: ${{ secrets.WAKATIME_API_KEY }}
          # 提交消息
          COMMIT_MESSAGE: Update Wakapi stats
          # 图形
          BLOCKS: "⬜🟨🟩"
          # 时间范围
          TIME_RANGE: last_30_days
          # 显示时间
          SHOW_TIME: true
```
