select distinct a.route_refid as id
from passengers_bystop a
join passengers_bystopdetails b
on a.pbs_id = b.pbs_id
join routes c
on a.route_refid = c.route_refid
where a.route_refid is not null
{{{dateRangeFilter}}}
{{{dayFilter}}}
{{{passFilter}}}
{{{routeFilter}}}
{{{shiftFilter}}}
{{{tripFilter}}}
{{{stopFilter}}}