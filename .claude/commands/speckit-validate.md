# Validate Speckit Structure

Run the Speckit validation script to ensure all specs follow the required workflow.

## Instructions

Execute the validation script and report the results:

```bash
bash scripts/check-speckit.sh
```

If validation fails:
1. List all specs with missing files
2. Provide guidance on how to fix each issue
3. Offer to generate missing plan.md or tasks.md files

If validation passes:
- Confirm all specs are compliant
- Show a summary of total specs validated

## Helpful Commands
- To generate a missing plan: `/speckit-plan` (from the spec directory)
- To generate missing tasks: `/speckit-tasks` (from the spec directory)
