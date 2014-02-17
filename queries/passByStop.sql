select [ID], [Short], isnull([CHILD],0) as [CHILD], isnull([DIS],0) as [DIS], isnull([ELD],0) as [ELD], isnull([EMP],0) as [EMP]
, isnull([PCA],0) as [PCA], isnull([RF],0) as [RF], isnull([STP],0) as [STP], isnull([TCA],0) as [TCA], isnull([VET],0) as [VET]
, (isnull([CHILD],0)+isnull([DIS],0)+isnull([ELD],0)+isnull([EMP],0)+isnull([PCA],0)+isnull([RF],0)+isnull([STP],0)+isnull([TCA],0)+isnull([VET],0)) as [On]
, isnull([Off],0) as [Off]
from
(select a.stop_refid as [ID], c.[stop_name] as [Short], b.passType_refid as [Rider], sum(b.passenger_on_count) as [Cnt]
from [STRoute].[dbo].[passengers_bystop] a
full join [STRoute].[dbo].[passengers_bystopdetails] b
on a.pbs_id = b.pbs_id
left join [STRoute].[dbo].[stops] c
on a.stop_refid = c.stop_refid
where a.stop_refid is not null
{{{dateRangeFilter}}}
{{{dayFilter}}}
{{{passFilter}}}
{{{routeFilter}}}
{{{shiftFilter}}}
{{{tripFilter}}}
{{{stopFilter}}}
group by a.stop_refid, c.[stop_name], b.passType_refid
) as magicTable
pivot
(SUM([Cnt]) for [Rider] in ([CHILD],[DIS],[ELD],[EMP],[PCA],[RF],[STP],[TCA],[VET],[On])) as pvt
full join (select a.stop_refid, sum([PassengersOff]) as [Off] from [STRoute].[dbo].[passengers_bystop] a
where a.stop_refid is not null
{{{dateRangeFilter}}}
{{{dayFilter}}}
{{{routeFilter}}}
{{{shiftFilter}}}
{{{tripFilter}}}
{{{stopFilter}}}
group by a.stop_refid) as a
on [ID] = a.stop_refid
order by [ID]
