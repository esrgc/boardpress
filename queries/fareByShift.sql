select [{{{variable}}}] as variable, [Date], isnull(sum([Fare]), 0) as [Fare]
from (select a.[route_refid] as [Route], a.[shift_refid] as [Shift], a.[trip_refid] as [Trip]
, a.[stop_refid] as [Stop], cast(a.stopdate as date) as [Date], [Fare]
from [STRoute].[dbo].[passengers_bystop] a
left join (select b.pbs_id, sum(b.gross_passenger_fare) as [Fare]
from [STRoute].[dbo].[passengers_bystopdetails] b
where b.pbs_id is not null
{{{passFilter}}}
group by pbs_id) b
on a.pbs_id = b.pbs_id
join [STRoute].[dbo].[shifts] c
on a.shift_refid = c.shift_refid
Where a.[route_refid] is not null
{{{dateRangeFilter}}}
{{{dayFilter}}}
{{{routeFilter}}}
{{{shiftFilter}}}
{{{tripFilter}}}
{{{stopFilter}}}
) a
group by [{{{variable}}}], [Date]
order by [{{{variable}}}], [Date]
