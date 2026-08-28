# なないろ 子育て相談窓口（チャット相談デモ）

保護者向け「AIがそっと話をきく相談窓口」のデモサイトです。
静的ファイル（HTML / CSS / JS）のみで動作し、GitHub Pages でそのまま公開できます。
**応答はすべてダミーの定型文で、外部APIやサーバーには接続していません。**

## 画面構成
- **A. 案内ホームページ** … 導入コピー / QR（サンプル）/ ご利用の流れ / 注意 / FAQ / 相談窓口一覧
- **B. AIチャット相談画面**（スマホ枠）… 区・校種の選択 → 規約同意 → 入力・送信 → 定型返答

## 動作する機能
1. 「相談をはじめる」でチャットへスクロール
2. 区・校種を選び「同意して開始」で相談スタート
3. メッセージを入力・送信すると寄り添う定型返答が届く
4. **緊急ワード検知**（「死にたい」等）→ 目立つ色で専門窓口を案内
5. 最後の送信から5分で自動終了
6. スマホ／PC 両対応

## ローカルで確認
`index.html` をブラウザで開くだけです。

## GitHub Pages で公開する手順
1. GitHubで新しいリポジトリを作成（例：`chat-demo`）
2. このフォルダの中身を push
   ```bash
   git init
   git add .
   git commit -m "チャット相談デモ"
   git branch -M main
   git remote add origin https://github.com/<ユーザー名>/chat-demo.git
   git push -u origin main
   ```
3. GitHub の **Settings → Pages** で
   - Source: `Deploy from a branch`
   - Branch: `main` / `/ (root)` を選んで Save
4. 数分後 `https://<ユーザー名>.github.io/chat-demo/` で公開されます

## 注意
サンプル用のダミーです。掲載している電話番号・区名・サービスは実在のものではありません。
実運用では、本物のAI応答・相談履歴の扱い・個人情報保護などを別途設計してください。
