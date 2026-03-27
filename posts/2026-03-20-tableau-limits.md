# The Limits of Tableau
Sometimes, dragging and dropping pills onto a canvas is not enough.

## The Problem
When dealing with billions of rows, simple aggregate queries take far too long. Dashboards become unacceptably slow, taking over 10 seconds to render. Users hate this. I hate this.

## The Solution
Instead of forcing the BI tool to do the heavy lifting:
1. Aggregate data pipeline in **Python** using `pandas` (or `dask` if memory is an issue)
2. Store pre-aggregated rollups in a fast datastore like **PostgreSQL** or **ClickHouse**
3. Point Tableau only to the aggregated views.

```python
import pandas as pd

def process_chunk(df):
    # Perform grouping before ever hitting the BI tool
    return df.groupby(["date", "region_id"])["revenue"].sum().reset_index()
```

If your query takes more than 3 seconds in the source logic, no amount of Tableau magic will fix it. Fix your data models first.