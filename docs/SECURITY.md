# Security model

OASFuse treats every specification as hostile input. It never resolves external references, URLs, or relative filesystem paths. Documents are held only in memory for the duration of a request and are not logged or persisted.

Controls include per-specification byte limits, YAML alias limits, duplicate-key rejection, maximum tree depth and nodes, bounded `$ref` traversal, bounded concurrent API comparisons, proxy request limits, timeouts, non-root containers, read-only production filesystems, dropped Linux capabilities, and a private API network.

The principal residual risk is parser or runtime resource exhaustion within the configured limits. Production operators should retain reverse-proxy rate limits, container CPU/memory limits, HTTPS, dependency updates, and centralized monitoring that excludes request bodies.
