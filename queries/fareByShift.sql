--REQUEST ST:  Breakout on how much fare should have been collected for a particular shift on a particular day
select [Name], [Date], sum([Fare]) as [Fare]
from (select c.[shift_name] as [Name], cast(shift_date as date) as [Date], datepart(weekday,a.stopdate) as [Day], [Fare]
from [STRoute].[dbo].[passengers_bystop] a
join (select pbs_id, sum(gross_passenger_fare) as [Fare]
from [STRoute].[dbo].[passengers_bystopdetails]
group by pbs_id) b
on a.pbs_id = b.pbs_id
join [STRoute].[dbo].[shifts] c
on a.shift_refid = c.shift_refid) a
--where {{{filters}}} ex:[Day] = 1 or [Date] between X and Y
group by [Name], [Date]
order by [Name], [Date]

------------------------------------Results displayed as pivot table------------------------------------
declare @cols as nvarchar(max),
	@query  as nvarchar(max)

set @cols = stuff((select ',' + quotename([Date])
            from (select distinct cast(shift_date as date) as [Date], datepart(weekday, stopdate) as [Day]
			from [STRoute].[dbo].[passengers_bystop]) z
			--where {{{filters}}} ex:[Date] between X and Y or [Day] = 1
            order by [Date]
		    for xml path(''))--, type
           -- ).value('.', 'nvarchar(max)') 
        ,1,1,'')
		
set @query = 
'select [Name], ' + @cols + ' 
from 
(select [Name], [Date], sum([Fare]) as [Fare]
from (select c.[shift_name] as [Name], cast(shift_date as date) as [Date], datepart(weekday,a.stopdate) as [Day], [Fare]
from [STRoute].[dbo].[passengers_bystop] a
join (select pbs_id, sum(gross_passenger_fare) as [Fare]
from [STRoute].[dbo].[passengers_bystopdetails]
group by pbs_id) b
on a.pbs_id = b.pbs_id
join [STRoute].[dbo].[shifts] c
on a.shift_refid = c.shift_refid) a
--where {{{filters}}} ex:[Name] = ''111a, 111r (Shift 1)''
group by [Name], [Date]
) as magicTable
pivot
(sum([Fare]) for [Date] in (' + @cols + ')) as pvt
order by [Name]'

execute(@query)