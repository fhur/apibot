# Apibot

A swagger compatible integration testing tool.

## Principles

- It's just javascript
  You can always look at the code. The UI is just a way of visualizing the program.
- Keep it simple, solve a few cases in an amazing way.
- Great at error reporting. Errors should not leave users scratching their head.
- Fast: every action should be quick.

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
- [ ] command + hover => shows scope

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

### Feedback Paul & Isaline

- Better labels / descriptions.
- Given when then
- Abstractions: naming
- Think about how a new user would "feel" when they are confronted with a huge apibot script.

### Feedback Cris

- No es claro para quien es el valor
- No es claro qué problema se está resolviendo
-
