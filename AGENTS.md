# CUD Sustainability Chat Guardrails

This file defines mandatory chat-agent behavior for this module.

## Scope

- Work only in `web/modules/custom/cud_sustainability`.
- Do not change Drupal core, contrib modules, themes, profiles, or global project files unless the user explicitly asks.

## Testing command restrictions

- For verification, run only the container cache clear command.
- The required action is running `drush cr` inside the Drupal container.
- Example command format:

```bash
docker compose exec <php-service> drush cr
```

Replace `<php-service>` with the actual service/container name used by the hosting setup.

## Safety

- Do not run database updates, install/uninstall commands, or destructive commands unless explicitly requested.
- Keep all development and fixes focused on `cud_sustainability` module code.
