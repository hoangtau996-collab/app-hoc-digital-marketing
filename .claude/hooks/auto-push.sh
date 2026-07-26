#!/usr/bin/env bash
#
# Tự động commit & đẩy toàn bộ thay đổi lên GitHub.
# Được gọi bởi hook Stop và SessionEnd trong .claude/settings.json
#
# Nguyên tắc:
#   - Không có thay đổi và không có commit tồn đọng  -> im lặng thoát (khỏi làm phiền).
#   - Commit được nhưng đẩy hỏng  -> giữ commit ở máy và báo rõ, KHÔNG tự ý sửa lịch sử.
#   - Không bao giờ tự rebase/merge khi nhánh trên GitHub đã chạy trước:
#     việc đó phải do người quyết định, hook làm ngầm rất dễ mất code.

set -uo pipefail

# Chặn git bật hộp thoại hỏi mật khẩu. Thà báo lỗi ngay còn hơn treo hook đến hết timeout.
export GIT_TERMINAL_PROMPT=0

cd "${CLAUDE_PROJECT_DIR:-$(pwd)}" 2>/dev/null || exit 0

# Hook nói chuyện với Claude Code bằng JSON trên stdout.
# Máy này không có jq nên dùng node (dự án đã cần node sẵn) để escape cho chuẩn.
emit() {
  node -e 'process.stdout.write(JSON.stringify({systemMessage:process.argv[1],suppressOutput:true}))' "$1" 2>/dev/null
  exit 0
}

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
if [ -z "$BRANCH" ] || [ "$BRANCH" = "HEAD" ]; then
  emit "⚠️ Auto-push bỏ qua: đang ở detached HEAD, không rõ nên đẩy lên nhánh nào."
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  emit "⚠️ Auto-push bỏ qua: repo chưa nối remote 'origin'."
fi

DIRTY=$(git status --porcelain 2>/dev/null)
AHEAD=$(git rev-list --count "origin/${BRANCH}..HEAD" 2>/dev/null || echo 0)

# Không có gì để làm -> thoát im lặng.
if [ -z "$DIRTY" ] && [ "$AHEAD" = "0" ]; then
  exit 0
fi

if [ -n "$DIRTY" ]; then
  if ! git add -A 2>/dev/null; then
    emit "⚠️ Auto-push: 'git add' thất bại, chưa có gì được lưu."
  fi

  N=$(git diff --cached --name-only | wc -l | tr -d ' ')
  FILES=$(git diff --cached --name-only | head -3 | sed 's|.*/||' | tr '\n' ',' | sed 's/,$//; s/,/, /g')
  if [ "$N" -gt 3 ]; then
    FILES="${FILES}, +$((N - 3)) file khác"
  fi

  if ! git commit -q \
      -m "chore: tự động lưu ${N} file sau phiên chỉnh sửa" \
      -m "Thay đổi: ${FILES}" \
      -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>" 2>/dev/null; then
    emit "⚠️ Auto-push: tạo commit thất bại. Thay đổi vẫn còn nguyên trên máy."
  fi
fi

if PUSH_OUT=$(git push origin "$BRANCH" 2>&1); then
  emit "✅ Đã đẩy lên GitHub — nhánh ${BRANCH}."
else
  REASON=$(printf '%s' "$PUSH_OUT" | grep -viE '^(remote:|To |Enumerating|Counting|Compressing|Writing|Total|hint:)' \
           | tr '\n' ' ' | sed 's/  */ /g' | cut -c1-220)
  emit "❌ Đã commit ở máy nhưng KHÔNG đẩy lên GitHub được (nhánh ${BRANCH}). Code vẫn an toàn tại máy, chạy 'git push' thủ công để xử lý. Lý do: ${REASON}"
fi
