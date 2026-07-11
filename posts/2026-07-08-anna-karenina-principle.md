# The Anna Karenina Principle of Data Quality

All clean datasets are alike; every dirty dataset is dirty in its own way.

Tolstoy figured this out in 1877, he just didn't have the tooling to prove it. A clean dataset is boring in the best sense of the word: types match, keys join, dates live in the current century. There is exactly one way for all of this to be true, and infinitely many ways for any of it to be false.

## A field guide to unhappy families

Over the years I've been keeping a mental taxonomy. Every dirty dataset I've met belongs to at least one of these households:

- **The time travelers.** Orders delivered on `1970-01-01`, users born in `2201`. Somebody cast an empty string to a timestamp and now a third of your cohort predates Unix itself.
- **The identity crisis.** `user_id` is an integer in one table, a string in another, and in the third it's an email address, because the intern was told to "just make it work" and, to be fair, it did.
- **The quiet NULLs.** Not the honest `NULL` — the string `"NULL"`. Also `"N/A"`, `"-"`, `"нет"`, and my personal favorite, `" "` (one space, load-bearing).
- **The Excel survivor.** It was a CSV once. Then someone opened it in Excel, and now every 16-digit ID ends in `E+15` and the phone numbers are dates in March.
- **The encoding martyr.** Half the names are `Ð•Ð³Ð¾Ñ€`. The other half are fine, which is somehow worse, because now it's a *conditional* bug.

## The principle in practice

The corollary is what matters. You cannot write one validator for "dirty" — dirt has too many degrees of freedom. But you can write one validator for "clean", because clean is a single point in the space:

```sql
SELECT
    count(*)                                    AS rows_total,
    count(*) FILTER (WHERE id IS NULL)          AS orphans,
    count(*) FILTER (WHERE created_at < '2000-01-01') AS time_travelers,
    count(*) FILTER (WHERE email !~ '@')        AS definitely_not_emails
FROM users;
```

If every counter after the first is zero — congratulations, your family is happy. If not, at least now you know *which* chapter of the novel you're in.

## Epilogue

Levin found meaning in working the land. I find it in a `WHERE` clause that finally returns zero rows of garbage. I am not saying these are the same thing. I am saying they are not different things.

*Data wants to be understood. Sometimes it just needs eight hundred pages to open up.*
