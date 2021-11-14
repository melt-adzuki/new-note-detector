# new-note-detector
Misskey APIを使って misskey.io 上にいる特定ユーザーの合計ノート数を監視し、新しく投稿されたかどうかを検出します。

## 使い方
プロジェクトのルートフォルダーに.envファイルを作成し、以下のように設定してください。
```yaml
TARGET_USERNAME=syuilo #監視したいアカウントのユーザー名
INTERVAL_SECONDS=10 #APIにアクセスする頻度(秒)
```
なお、INTERVAL_SECONDSは低く設定しすぎるとサーバーに負荷がかかる可能性があります。常識の範囲内で指定することを心がけてください。

次に、インターバルで呼び出されるコールバック関数を作り、これをクラスの第一引数に渡します。
```typescript
import NewNoteDetector, { ICountState } from "./new-note-detector"

const onUpdate = (state: ICountState): void =>
{
    switch (state.hasValueChanged) {
        case false:
            console.log("新しい投稿は検出されませんでした。")
            break
        
        case true:
            console.log("新しい投稿が検出されました!")
            break
    }
}

const newNoteDetector = new NewNoteDetector(onUpdate)
newNoteDetector.start()
```
最後にstart関数を呼び出すとインターバル実行が開始されます。
