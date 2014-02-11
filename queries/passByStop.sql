
select
[Name],
(isnull([CHILD],0)+isnull([DIS],0)+isnull([ELD],0)+isnull([EMP],0)+isnull([PCA],0)+isnull([RF],0)+isnull([STP],0)+isnull([TCA],0)+isnull([VET],0)) as [TOTAL],
isnull([CHILD],0) as [CHILD],
isnull([DIS],0) as [DIS],
isnull([ELD],0) as [ELD],
isnull([EMP],0) as [EMP],
isnull([PCA],0) as [PCA],
isnull([RF],0) as [RF],
isnull([STP],0) as [STP],
isnull([TCA],0) as [TCA],
isnull([VET],0) as [VET]
from 
(select [Name], [Rider], sum([Cnt]) as [Cnt]
from (select stop_refid as [Name], passType_refid as [Rider], cast(stopdate as date) as [Date]
, datepart(weekday,a.stopdate) as [Day], b.passenger_on_count as [Cnt]
from [STRoute].[dbo].[passengers_bystop] a
join [STRoute].[dbo].[passengers_bystopdetails] b
on a.pbs_id = b.pbs_id) z
--where {{{filters}}} ex:[Day] = 1 or [Date] between X and Y
group by [Name], [Rider]
) as magicTable
pivot
(SUM([Cnt]) for [Rider] in ([CHILD],[DIS],[ELD],[EMP],[PCA],[RF],[STP],[TCA],[VET],[TOTAL])) as pvt
order by [Name]