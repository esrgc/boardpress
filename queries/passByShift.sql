sselect [ID], [Short], [Long], isnull([CHILD],0) as [CHILD], isnull([DIS],0) as [DIS], isnull([ELD],0) as [ELD], isnull([EMP],0) as [EMP]
, isnull([PCA],0) as [PCA], isnull([RF],0) as [RF], isnull([STP],0) as [STP], isnull([TCA],0) as [TCA], isnull([VET],0) as [VET]
, (isnull([CHILD],0)+isnull([DIS],0)+isnull([ELD],0)+isnull([EMP],0)+isnull([PCA],0)+isnull([RF],0)+isnull([STP],0)+isnull([TCA],0)+isnull([VET],0)) as [On]
, isnull([Off],0) as [Off]
from 
(select a.shift_refid as [ID], c.shift_name as [Short], c.[shift_description] as [Long], b.passType_refid as [Rider], sum(b.passenger_on_count) as [Cnt]
from [STRoute].[dbo].[passengers_bystop] a
left join [STRoute].[dbo].[passengers_bystopdetails] b
on a.pbs_id = b.pbs_id
left join [STRoute].[dbo].[shifts] c
on a.shift_refid = c.shift_refid
where b.passType_refid is not null
{{{dateRangeFilter}}}
{{{dayFilter}}}
{{{passFilter}}}
{{{routeFilter}}}
{{{shiftFilter}}}
{{{tripFilter}}}
{{{stopFilter}}}
group by a.shift_refid, c.shift_name, c.[shift_description], b.passType_refid
) as magicTable
pivot
(SUM([Cnt]) for [Rider] in ([CHILD],[DIS],[ELD],[EMP],[PCA],[RF],[STP],[TCA],[VET],[TOTAL])) as pvt
left join (select a.shift_refid, sum([PassengersOff]) [Off] from [STRoute].[dbo].[passengers_bystop] a left join [STRoute].[dbo].[shifts] c on a.shift_refid = c.shift_refid
where c.shift_name is not null
{{{dateRangeFilter}}}
{{{dayFilter}}}
{{{routeFilter}}}
{{{shiftFilter}}}
{{{tripFilter}}}
{{{stopFilter}}}
group by a.shift_refid) as a
on [ID] = a.shift_refid
order by [Short]
