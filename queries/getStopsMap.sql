select distinct a.stop_refid as id, c.stop_name as name, c.stop_lat as lat, c.stop_lon as lng 
from passengers_bystop a
join passengers_bystopdetails b
on a.pbs_id = b.pbs_id
join stops c
on a.stop_refid = c.stop_refid
where a.stop_refid is not null
{{{dateRangeFilter}}}
{{{dayFilter}}}
{{{passFilter}}}
{{{routeFilter}}}
{{{shiftFilter}}}
{{{tripFilter}}}
{{{stopFilter}}}


