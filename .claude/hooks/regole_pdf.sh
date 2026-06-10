#!/usr/bin/env bash
# Hook PostToolUse: se l'Edit/Write ha toccato il file delle regole, rigenera il PDF.
# Riceve su stdin il JSON dell'evento (tool_input.file_path).
input=$(cat)
file=$(printf '%s' "$input" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null)
case "$file" in
  *frenemies_on_the_road_kb_v1_2.md)
    cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
    echo "Regole modificate: rigenero il PDF…"
    python3 docs/genera_pdf.py
    ;;
esac
exit 0
