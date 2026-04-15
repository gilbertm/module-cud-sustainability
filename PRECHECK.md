# Pre-Commit Checks for cud_sustainability.install

Run these checks in the dev container before committing, from cheapest to most thorough.

---

## 1. PHP Syntax Check

Catches parse errors instantly — zero side effects.

```bash
php -l web/modules/custom/cud_sustainability/cud_sustainability.install
```

---

## 2. Duplicate Function Name Guard

Guards against naming collisions across hook files.

```bash
grep -rn "^function cud_sustainability_" web/modules/custom/cud_sustainability/ | sort -t: -k3
```

---

## 3. Validate `nav_pages()` Data Shape

Runs the function in Drupal's bootstrap without touching the DB.

```bash
drush php:eval "
  require_once DRUPAL_ROOT . '/../modules/custom/cud_sustainability/cud_sustainability.install';
  \$pages = cud_sustainability_nav_pages();
  echo count(\$pages) . ' pages defined\n';
  foreach (\$pages as \$p) {
    if (empty(\$p['title']) || empty(\$p['alias']) || empty(\$p['menu']) || !array_key_exists('parent_key', \$p)) {
      echo 'MISSING KEY in: ' . print_r(\$p, TRUE);
    }
  }
  echo 'All keys OK\n';
"
```

---

## 4. Pre-condition Check (Vocabulary & Bundle)

Verifies required vocabulary exists and checks for bundle conflicts before installing.

```bash
drush php:eval "
  \$vid = \Drupal::entityQuery('taxonomy_vocabulary')->condition('vid','tags')->accessCheck(FALSE)->execute();
  echo \$vid ? 'tags vocab: EXISTS' : 'tags vocab: MISSING - will fail field_tags seeding';
  echo PHP_EOL;
  echo \Drupal::entityTypeManager()->getStorage('node_type')->load('sustainability') ? 'Bundle: ALREADY EXISTS' : 'Bundle: will be created';
"
```

---

## 5. Transaction Dry-Run (Full Simulation)

Most thorough. Runs the install functions inside a DB transaction, then rolls back via a deliberate exception — nothing is committed.

```bash
drush php:eval "
  \$db = \Drupal::database();
  \$db->startTransaction();
  try {
    require_once DRUPAL_ROOT . '/../modules/custom/cud_sustainability/cud_sustainability.install';
    cud_sustainability_ensure_sustainability_bundle();
    echo 'bundle: OK\n';
    cud_sustainability_ensure_extra_fields();
    echo 'extra fields: OK\n';
    throw new \Exception('DRY RUN — rolling back');
  } catch (\Exception \$e) {
    echo \$e->getMessage() . PHP_EOL;
  }
"
```

---

## Recommended Pre-Commit Order

```bash
# 1. Syntax
php -l web/modules/custom/cud_sustainability/cud_sustainability.install

# 2. Quick data shape check
drush php:eval "require_once DRUPAL_ROOT.'/../modules/custom/cud_sustainability/cud_sustainability.install'; echo count(cud_sustainability_nav_pages()).' pages\n';"

# 3. Full transaction simulation (see step 5 above)
```

> **Note:** `drush php:eval` path resolution may vary. Use `$(drush dd)` or hard-code the absolute path if `DRUPAL_ROOT . '/../modules/...'` doesn't resolve in your container layout.
