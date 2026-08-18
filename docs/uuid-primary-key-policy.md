# Politique UUID des clés primaires

Le schéma public de Call of Chess impose désormais une clé primaire composée exclusivement de colonnes PostgreSQL `uuid` pour toute nouvelle table ou toute modification de clé primaire. Cette règle est appliquée par l’event trigger `enforce_public_uuid_primary_keys` installé dans la migration `20260818000001_enforce_uuid_primary_keys.sql`.

Lorsqu’une instruction `CREATE TABLE`, `CREATE TABLE AS` ou `ALTER TABLE` cible le schéma `public`, PostgreSQL vérifie la clé primaire après l’exécution du DDL, mais avant la validation de la transaction. Une table sans clé primaire ou avec une colonne de clé primaire d’un autre type est rejetée et la transaction est annulée. Les tables des schémas gérés par Supabase, notamment `auth`, ne sont pas concernées par cette règle applicative.

La garde a été testée sur Supabase. Une table temporaire avec `id uuid primary key` est acceptée, tandis qu’une table avec `id bigint primary key` est refusée avec une erreur de type `datatype_mismatch`. Les tables de test sont supprimées ou annulées, et l’event trigger est resté actif après vérification.

La désactivation temporaire doit rester exceptionnelle et être effectuée uniquement par un administrateur pendant une opération contrôlée :

```sql
alter event trigger enforce_public_uuid_primary_keys disable;
-- opération administrative contrôlée
alter event trigger enforce_public_uuid_primary_keys enable;
```

Cette politique garantit les clés primaires UUID des tables publiques futures. Elle ne remplace pas les contraintes de clés étrangères, les politiques RLS, ni les validations métier propres à chaque table.

## Références

- [Supabase — Event Triggers](https://supabase.com/docs/guides/database/postgres/event-triggers)
- [PostgreSQL — Event Trigger Behavior](https://www.postgresql.org/docs/current/event-trigger-definition.html)
