# Reference Validation Evidence

Run the commands below from the capstone directory and replace the sample status with your own dated output when submitting the project.

| Command | Expected evidence |
| --- | --- |
| `npm ci` | Installs the lockfile-resolved development dependencies. |
| `npm run check` | Strict TypeScript check passes without emitting files. |
| `npm run build` | Compiles `src` and `test` to `.build`. |
| `npm test` | Covers validation, transformation, async, diagnostic, workflow, and report behaviour. |
| `npm start` | Generates `.build/quality-report.json` from the fictional fixtures. |

Additional evidence to capture during review:

- malformed configuration and malformed execution fixture produce `invalid-input`;
- a missing or unwritable file produces a controlled `dependency-failure`;
- polling completion and timeout use virtual time;
- retry succeeds only after a classified transient dependency failure, stops on non-retryable input, and exhausts at its configured total-attempt limit; and
- an arbitrary caught error is rendered as a generic `unexpected-result` diagnostic rather than disclosing its message.
