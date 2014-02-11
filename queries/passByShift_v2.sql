--REQUEST ST: Breakout by shifts – a total of each passenger type for a particular shift 
select [Name], [Rider], sum([Cnt]) as [Cnt]
from (select c.shift_name as [Name], a.passType_refid as [Rider], cast(shift_date as date) as [Date]
,datepart(weekday,b.stopdate) as [Day], passenger_on_count as [Cnt]
from [STRoute].[dbo].[passengers_bystopdetails] a
join [STRoute].[dbo].[passengers_bystop] b
on a.pbs_id = b.pbs_id
join [STRoute].[dbo].[shifts] c
on b.shift_refid = c.shift_refid) z
--where {{{filters}}} ex:[Day] = 1 or [Date] between X and Y
group by [Name], [Rider]
order by [Name], [Rider]

------------------------------------Results displayed as pivot table------------------------------------
select [Name],[CHILD],[DIS],[ELD],[EMP],[PCA],[RF],[STP],[TCA],[VET]
,(isnull([CHILD],0)+isnull([DIS],0)+isnull([ELD],0)+isnull([EMP],0)+isnull([PCA],0)+isnull([RF],0)+isnull([STP],0)+isnull([TCA],0)+isnull([VET],0)) as [On]
,[Off]
from 
(select c.shift_name as [Name], passType_refid as [Rider], sum(b.passenger_on_count) as [Cnt]
from [STRoute].[dbo].[passengers_bystop] a
full join [STRoute].[dbo].[passengers_bystopdetails] b
on a.pbs_id = b.pbs_id
full join [STRoute].[dbo].[shifts] c
on a.shift_refid = c.shift_refid
where passType_refid is not null
and stopdate = '2013-06-01'
--{{{filters}}}
group by c.shift_name, passType_refid
) as magicTable
pivot
(SUM([Cnt]) for [Rider] in ([CHILD],[DIS],[ELD],[EMP],[PCA],[RF],[STP],[TCA],[VET],[TOTAL])) as pvt
full join (select shift_name, sum([PassengersOff]) [Off] from [STRoute].[dbo].[passengers_bystop] a left join [STRoute].[dbo].[shifts] c on a.shift_refid = c.shift_refid where stopdate = '2013-06-01' --{{{filters}}}
group by shift_name) as a
on [Name] = a.shift_name
order by [Name]