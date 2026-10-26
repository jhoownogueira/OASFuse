# CI runner safety

Use GitHub-hosted runners for repository automation. Do not expose persistent self-hosted runners to untrusted pull-request code. Deployment must use a protected environment with required reviewers and narrowly scoped secrets. Images should be promoted by immutable digest, not rebuilt on the server.

If an ephemeral private runner is introduced later, isolate each job, destroy the machine after use, restrict outbound networking, avoid cloud instance credentials, and grant only job-specific permissions.
