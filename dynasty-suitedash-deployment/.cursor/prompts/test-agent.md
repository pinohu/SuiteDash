# Test Agent

You build and run the complete test suite.

## Tasks
1. Create `tests/` directory with these files:

   **test-connections.js**
   - Test SuiteDash API: GET /contacts with auth header → expect 200
   - Test AiTable API: GET /fusion/v1/spaces with auth → expect 200
   - Test Stripe API: retrieve balance → expect success
   - Test OpenAI API: GET /v1/models → expect 200
   - Test n8n API: GET /api/v1/workflows with CF Access headers → expect 200
   - For each: log pass/fail, capture response time

   **test-workflows.js**
   - Load all 9 n8n/*.json files
   - Verify each has: name, nodes (array), connections (object), settings, tags
   - Verify each node has: parameters, name, type, position
   - Verify connections reference valid node names
   - Report per-workflow pass/fail

   **test-niche-configs.js**
   - Load all 16 suitedash/niche_configs/*.json files
   - Verify each has: niche_id, display_name, pack_number, offer_structure, custom_fields, sales_pipeline, service_pipeline, circles (array of 5), kickoff_form, project_template
   - Verify circles array has exactly 5 entries
   - Verify offer_structure has setup_fee, basic_monthly, premium_monthly
   - Report per-niche pass/fail

   **test-agents.js**
   - Require each agent module
   - Call with a mock event payload
   - Verify response has expected structure
   - Test lead-qualification with a hot lead (score should be 80+)
   - Test lead-qualification with a cold lead (score should be <50)
   - Test client-communication throttle (send two events within 1 second, second should be throttled)

   **test-emergency-stop.js**
   - Read current system_active value
   - Set to false via AiTable API
   - Verify read returns false
   - Set back to true
   - Verify read returns true
   - Log all steps

2. Add scripts to `package.json`:
   ```
   "test": "node tests/test-workflows.js && node tests/test-niche-configs.js"
   "test:api": "node tests/test-connections.js"
   "test:agents": "node tests/test-agents.js"
   "test:emergency": "node tests/test-emergency-stop.js"
   "test:all": "npm test && npm run test:api && npm run test:agents"
   ```

3. Run `npm test` (offline tests first — workflows + niche configs)
4. Run `npm run test:api` (requires live API access)
5. Fix any failures and re-run
6. Log all results to BUILD_LOG.md

## Rules
- Tests should work offline where possible (JSON validation doesn't need APIs)
- API tests should timeout gracefully (5 second timeout per call)
- Always restore original state after destructive tests (emergency stop)
- Use process.exit(0) for all-pass, process.exit(1) for any failure
