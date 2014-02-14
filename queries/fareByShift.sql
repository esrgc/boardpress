select [{{{variable}}}], [Date], sum([Fare]) as [Fare]
from (select a.[route_refid] as [Route], a.[shift_refid] as [Shift], [trip_refid] as [Trip]
, [stop_refid] as [Stop], cast(a.stopdate as date) as [Date], [Fare]
from [STRoute].[dbo].[passengers_bystop] a
join (select pbs_id, sum(gross_passenger_fare) as [Fare]
from [STRoute].[dbo].[passengers_bystopdetails]
where pbs_id is not null
{{{passFilter}}}
group by pbs_id) b
on a.pbs_id = b.pbs_id
join [STRoute].[dbo].[shifts] c
on a.shift_refid = c.shift_refid
Where [route_refid] is not null
{{{dateRangeFilter}}}
{{{dayFilter}}}
{{{routeFilter}}}
{{{shiftFilter}}}
{{{tripFilter}}}
{{{stopFilter}}}
) a
group by [{{{variable}}}], [Date]
order by [{{{variable}}}], [Date]
