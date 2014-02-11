
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
from (select c.shift_name as [Name], a.passType_refid as [Rider], cast(shift_date as date) as [Date]
,datepart(weekday,b.stopdate) as [Day], passenger_on_count as [Cnt]
from [STRoute].[dbo].[passengers_bystopdetails] a
join [STRoute].[dbo].[passengers_bystop] b
on a.pbs_id = b.pbs_id
join [STRoute].[dbo].[shifts] c
on b.shift_refid = c.shift_refid) z
--where {{{filters}}} ex:[Day] = 1 or [Date] between X and Y
group by [Name], [Rider]
) as magicTable
pivot
(SUM([Cnt]) for [Rider] in ([CHILD],[DIS],[ELD],[EMP],[PCA],[RF],[STP],[TCA],[VET],[TOTAL])) as pvt
order by [Name]