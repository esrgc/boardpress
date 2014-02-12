select [Name], isnull([CHILD],0) as [CHILD], isnull([DIS],0) as [DIS], isnull([ELD],0) as [ELD], isnull([EMP],0) as [EMP]
, isnull([PCA],0) as [PCA], isnull([RF],0) as [RF], isnull([STP],0) as [STP], isnull([TCA],0) as [TCA], isnull([VET],0) as [VET]
, (isnull([CHILD],0)+isnull([DIS],0)+isnull([ELD],0)+isnull([EMP],0)+isnull([PCA],0)+isnull([RF],0)+isnull([STP],0)+isnull([TCA],0)+isnull([VET],0)) as [On]
, isnull([Off],0) as [Off]
from
(select stop_refid as [Name], passType_refid as [Rider], sum(b.passenger_on_count) as [Cnt]
from [STRoute].[dbo].[passengers_bystop] a
full join [STRoute].[dbo].[passengers_bystopdetails] b
on a.pbs_id = b.pbs_id
where stop_refid is not null
{{{filters}}}
group by stop_refid, passType_refid
) as magicTable
pivot
(SUM([Cnt]) for [Rider] in ([CHILD],[DIS],[ELD],[EMP],[PCA],[RF],[STP],[TCA],[VET],[On])) as pvt
full join (select stop_refid, sum([PassengersOff]) as [Off] from [STRoute].[dbo].[passengers_bystop]
--where {{{filters}}}
group by stop_refid) as a
on [Name] = a.stop_refid
order by [Name]
