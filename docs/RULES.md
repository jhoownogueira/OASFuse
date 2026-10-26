# Comparison rules

## Breaking

- Removed operations, request parameters, and response properties.
- Newly required request parameters, bodies, or properties.
- Narrowed request enums and expanded response enums.
- Incompatible request or response type changes.
- Removed response status codes.

## Review

- Operation identifier changes.
- Composition changes involving `oneOf`, `anyOf`, or `allOf`.
- Security requirement changes.

## Non-breaking

- Added operations and response status codes.
- Optional request parameters or properties.
- Expanded request enums and narrowed response enums.

Documentation-only changes are categorized separately. Rule coverage intentionally focuses on a conservative OpenAPI 3.0/3.1 subset and should grow through fixtures before heuristics are added.
