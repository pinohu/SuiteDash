#!/bin/bash
# Dynasty Empire — Bootstrap Script
# Run this ONCE before giving Cursor the build prompt.
# It handles all the environment setup that Cursor struggles with.

set -e
echo "=== Dynasty Empire Bootstrap ==="
echo ""

# 1. Check Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not found. Install Node.js 18+ first."
    exit 1
fi
echo "✓ Node.js $(node -v)"

# 2. Check npm
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm not found."
    exit 1
fi
echo "✓ npm $(npm -v)"

# 3. Install dependencies
echo ""
echo "Installing dependencies..."
npm install 2>&1
echo "✓ Dependencies installed"

# 4. Copy .env to root
if [ -f "env/.env" ]; then
    cp env/.env .env
    echo "✓ .env copied to project root"
fi

# 5. Create .env.example (strip secrets)
if [ -f ".env" ]; then
    sed 's/=.*/=REPLACE_ME/' .env > env/.env.example
    echo "✓ .env.example created"
fi

# 6. Init git
if [ ! -d ".git" ]; then
    git init
    git add -A
    git commit -m "BUILD CHECKPOINT: Initial state before autonomous build"
    echo "✓ Git initialized with checkpoint"
else
    echo "✓ Git already initialized"
fi

# 7. Validate JSONs
echo ""
echo "Validating JSON files..."
VALID=0
INVALID=0
for f in n8n/*.json suitedash/niche_configs/*.json; do
    if node -e "JSON.parse(require('fs').readFileSync('$f','utf8'))" 2>/dev/null; then
        VALID=$((VALID + 1))
    else
        echo "  ✗ INVALID: $f"
        INVALID=$((INVALID + 1))
    fi
done
echo "✓ JSON validation: $VALID valid, $INVALID invalid"

# 8. Create directories Cursor will need
mkdir -p agents/prompts tests data dashboard

# 9. Create stub BUILD_LOG
cat > BUILD_LOG.md << 'BUILDLOG'
# Dynasty Empire — Build Log

## Bootstrap
- Node.js: Ready
- Dependencies: Installed
- Git: Initialized
- JSON Validation: Complete

## Phase 2: AiTable Setup
_Cursor will fill this in_

## Phase 3: n8n Workflows
_Cursor will fill this in_

## Phase 4: Agent Layer
_Cursor will fill this in_

## Phase 5: Dashboard
_Cursor will fill this in_

## Phase 6: Niche Deployment
_Cursor will fill this in_

## Phase 7: Tests
_Cursor will fill this in_

## Phase 8: Documentation
_Cursor will fill this in_
BUILDLOG

echo ""
echo "=== Bootstrap Complete ==="
echo "Phase 1 is done. Open this folder in Cursor and paste the build prompt."
echo ""
