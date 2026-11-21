# Independent advanced-practice assessment

This is a practice rubric for the [learning-level target](LEARNING_LEVELS.md), not a handbook review gate, certification or automatic score. The author has supplied implementations; their passing results do not assess the learner. Keep browser progress self-reported and ask another person to review the unfamiliar exercise and explanation.

## Before starting

Choose inputs and a change you have not already rehearsed from the answer key. Have a reviewer select a product/price and one fault after you describe the intended evidence boundary. Work in a personal copy or deliberate exercise edit so the supplied examples remain available for comparison. Record the starting commit, edited files, command and actual result.

## Task A — API response control

From a blank test, intercept the catalog before navigation, change only a reviewer-selected product price and assert the named product and independently predicted total. Implement one pure JSON response and one route.fetch modification. Add an error or abort case, then remove the route and observe real behaviour. Demonstrate that a second browser context is unaffected. Inspect a POST payload with the response waiter registered before the click.

Evidence to review: exact request scope/method, response shape, route lifetime, actual UI outcome and one observation proving mocked success is distinct from server persistence. Explain when HAR replay would help and which recorded information would need sanitising in a real application.

## Task B — fixture ownership

Build a typed fixture graph with test-owned workspace data, one worker-owned transport, an option controlling seed data and automatic failure evidence. Override one inherited fixture without duplicating its resource lifecycle. Introduce a temporary failing assertion and verify the owned workspace is deleted; restore the intended check afterwards.

Evidence to review: setup/dependency/reverse-teardown explanation, no global shared cart, explicit cleanup of additional contexts, and attachments identifying the failed scope. Explain why fixture scope and browser-context isolation solve different problems.

## Task C — page/component composition

Implement a CheckoutComponent for the existing Practice checkout region, compose it into ShopPage and provide it through a typed fixture. Keep price and order-count expectations in the tests. Add one decline scenario and one ambiguous lost-response retry scenario using reviewer-selected products. Do not change the simulator to make the test pass.

Evidence to review: root-scoped component locators, a focused page interface, ownership remaining with fixtures, explicit business oracles, separate state for two instances and a reasoned choice of what not to abstract.

## Task D — investigation and delivery

Run the appropriate selection, inspect a trace and produce a short incident record: risk, reproduction, observed request/response/state, hypothesis, falsifying observation, decision and remaining uncertainty. Explain how CI artifacts preserve that decision context, which browser projects actually ran, and what visual/accessibility evidence remains outside the result.

## Review outcomes

| Outcome | Meaning |
|---|---|
| Not yet demonstrated | A supplied example was replayed, a required observation is missing, or the explanation cannot identify its boundary |
| Needs another attempt | The implementation is partly credible but ownership, oracle, diagnosis or limits need correction and a new run |
| Demonstrated for this task | An unfamiliar implementation runs, its failure is investigated, cleanup is established and the reviewer accepts the explanation for this specific scope |

Record outcomes per capability rather than combining them into a single score. A reviewer should re-derive the important observations, not accept a green report without inspecting what the test actually proves. Production readiness and independent publication acceptance remain separate questions.
