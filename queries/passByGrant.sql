select * from (select [Name], sum(c.passengerOn) as [On], sum(c.passengersOff) as [Off]
from (select a.shift_refid, b.passengerOn, a.passengersOff
from [STRoute].[dbo].[passengers_bystop] a
full join 
(select b.pbs_id, sum(b.passenger_on_count) passengerOn
from [STRoute].[dbo].[passengers_bystopdetails] b
where b.passenger_on_count is not null
{{{passFilter}}}
group by b.pbs_id) b
on a.pbs_id = b.pbs_id
where a.shift_refid is not null
{{{dateRangeFilter}}}
{{{dayFilter}}}
{{{routeFilter}}}
{{{shiftFilter}}}
{{{tripFilter}}}
{{{stopFilter}}}
) c
left join 
(select a.shift_refid, b.[BucketName] as [Name]
from [STRoute].[dbo].[shifts] a
join [STRoute].[dbo].[info_fares_BucketInfo] b
on a.BucketInfo_ID = b.BucketInfo_ID) d
on c.shift_refid = d.shift_refid
group by [Name])z
where [On] is not null
order by [Name]
