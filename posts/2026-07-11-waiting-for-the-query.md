# Waiting for the Query

> ESTRAGON: Let's go.  
> VLADIMIR: We can't.  
> ESTRAGON: Why not?  
> VLADIMIR: We're waiting for the query.

A tragicomedy in two acts, performed nightly in every analytics department. Act One: the dashboard is loading. Act Two: the dashboard is still loading. Critics call it "unbearable". Users call it "Tuesday".

## The trial

Someone must have slandered my query, because one morning, without having done anything wrong, it was killed by the OOM killer.

I appealed, of course. I opened `EXPLAIN ANALYZE` — the closest thing our profession has to reading your own case file. The verdict was in there, buried in the bureaucratic prose the planner favors:

```
->  Nested Loop  (cost=0.00..4148174.93 rows=1 width=8)
      (actual time=284611.02..284611.02 rows=9451223 loops=1)
```

Note the two numbers. The court *estimated* one row. Nine and a half million showed up. This is not an error, the planner explains patiently; this is an *estimate*. The planner has never been wrong. The planner has merely been given outdated statistics, and whose fault is that? Yours. You never ran `ANALYZE`. The trial was fair.

## What the query was waiting for

It turned out — it always turns out — that the query was waiting for the same three things everything waits for:

1. **An index** that existed in staging, in documentation, and in everyone's heart, but not in production.
2. **A `DISTINCT`** someone added in 2024 "just in case", which the database honored the way a monk honors a vow: silently, completely, and at enormous cost.
3. **A join condition.** The missing JOIN doesn't announce itself. It just quietly hands you the Cartesian product — every row introduced to every other row, like a wedding where nobody knows the couple but everyone came anyway.

Fixed all three. The query now runs in 1.4 seconds. Nobody noticed. This is the correct outcome: performance work is only ever visible when you don't do it.

## Godot arrives

Here the play and the profession part ways. Beckett's Godot never comes. The query, eventually, returns — that's the miracle of our art form. You wait, you doubt, you consider a career in carpentry, and then: `9451223 rows affected`. Meaning arrives. It just doesn't arrive *on time*.

> VLADIMIR: Well? Shall we go?  
> ESTRAGON: Yes, let's go.
>
> *They do not move. The dashboard is refreshing.*
