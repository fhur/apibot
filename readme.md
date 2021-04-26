# Apibot

A swagger compatible integration testing tool.

## TODO

- [x] Generate urls based on "servers"
- [ ] Improve body generation by using json-schema
- [x] Add jsonl node logging, with scope recordings
- [x] Visualize
- [ ] Detect arguments / pass arguments from the UI
- [ ] Save last scope per node
- [ ] Run node
- [ ] property controls
- [ ] surface errors in a nicer way
- [ ] open with editor
- [ ] run ts watcher -> keep Apibot in sync with code changes

## Future

### Record facts, use facts

- store the fact that policyId is a policy ID

```
fact("iptiq.policyId",policyId)
```

- Should allow for testing things like: if x is an "iptiq.policyId", then these properties should hold:

0. `[fetchLightPolicy(x), assertOk()]`
1. `[fetchPolicy(x), assertOk()]`
2. `[fetchPolicyEvents(x), assertOk()]`

This should be useful for catching data corruption cases.

### Test data generation based on JSON Schemas

Option 1: implement your own

Useful for:

1. Onboarding: Initial generation on `apibot add <>`
2. Test data generation:
3. Bonus: implement your own and add a link on https://json-schema.org/implementations.html. Problem: json-schema spec is incredibly complex.

Use @apidevtools/swagger-parser

Option 2: use

### Explore Graph like UI

Explore using something like https://github.com/wbkd/react-flow
