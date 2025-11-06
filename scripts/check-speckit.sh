#!/bin/bash

# Speckit Validation Script
# Ensures all specs have required plan.md and tasks.md files

set -e

COLOR_RED='\033[0;31m'
COLOR_GREEN='\033[0;32m'
COLOR_YELLOW='\033[1;33m'
COLOR_NC='\033[0m' # No Color

SPECS_DIR="specs"
ERRORS=0
WARNINGS=0

echo "🔍 Validating Speckit structure..."
echo ""

# Check if specs directory exists
if [ ! -d "$SPECS_DIR" ]; then
    echo -e "${COLOR_RED}❌ Error: specs/ directory not found${COLOR_NC}"
    exit 1
fi

# Check constitution.md exists
if [ ! -f ".specify/constitution.md" ]; then
    echo -e "${COLOR_RED}❌ Error: .specify/constitution.md not found${COLOR_NC}"
    echo "   Run: mkdir -p .specify && touch .specify/constitution.md"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${COLOR_GREEN}✓${COLOR_NC} Constitution found"
fi

echo ""
echo "Checking individual specs..."
echo ""

# Check each spec directory
for spec_dir in "$SPECS_DIR"/*/; do
    if [ ! -d "$spec_dir" ]; then
        continue
    fi

    spec_name=$(basename "$spec_dir")
    has_error=false

    # Check for spec.md
    if [ ! -f "$spec_dir/spec.md" ]; then
        echo -e "${COLOR_RED}❌ ${spec_name}: Missing spec.md${COLOR_NC}"
        ERRORS=$((ERRORS + 1))
        has_error=true
    fi

    # Check for plan.md
    if [ ! -f "$spec_dir/plan.md" ]; then
        echo -e "${COLOR_RED}❌ ${spec_name}: Missing plan.md${COLOR_NC}"
        echo "   Generate with: /speckit.plan or manually create the file"
        ERRORS=$((ERRORS + 1))
        has_error=true
    fi

    # Check for tasks.md
    if [ ! -f "$spec_dir/tasks.md" ]; then
        echo -e "${COLOR_RED}❌ ${spec_name}: Missing tasks.md${COLOR_NC}"
        echo "   Generate with: /speckit.tasks or manually create the file"
        ERRORS=$((ERRORS + 1))
        has_error=true
    fi

    # If all files present, show success
    if [ "$has_error" = false ]; then
        echo -e "${COLOR_GREEN}✓${COLOR_NC} ${spec_name}"
    fi
done

echo ""
echo "─────────────────────────────────────"

if [ $ERRORS -eq 0 ]; then
    echo -e "${COLOR_GREEN}✓ All Speckit validations passed!${COLOR_NC}"
    exit 0
else
    echo -e "${COLOR_RED}❌ Found ${ERRORS} error(s)${COLOR_NC}"
    echo ""
    echo "Speckit Workflow Requirements:"
    echo "  1. Each spec must have: spec.md, plan.md, and tasks.md"
    echo "  2. Generate plan.md before implementation"
    echo "  3. Generate tasks.md before coding"
    echo ""
    echo "See .specify/constitution.md for complete guidelines"
    exit 1
fi
