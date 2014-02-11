--REQUEST ST:  Breakout by stops on a particular trip or shift – total of each passenger type, when doing this I first filter on route name
--and then I do custom sort by shiftname & stop sequence.  Then I do subtotals at every change in stoprefid or stopname.
select [Name], [Order], [Rider], sum([Cnt]) as [Cnt]
from (select a.[pbs_id], a.[route_refid] as [Route], a.[shift_refid], c.[shift_name] as [Shift], a.[trip_refid]
, a.route_refid + '  ('+isnull(substring(cast(d.trip_startdeparttime as varchar),1,5), '')+ ')' as [Trip]
, [stop_refid] as [Name], [stop_sequence] as [Order], cast([stopdate] as date) as [Date]
, datepart(weekday,a.[stopdate]) as [Day], b.[passType_refid] as [Rider], b.passenger_on_count as [Cnt] , a.[PassengersOff]
from [STRoute].[dbo].[passengers_bystop] a
left join [STRoute].[dbo].[passengers_bystopdetails] b
on a.pbs_id = b.pbs_id
left join [STRoute].[dbo].[shifts] c
on a.[shift_refid] = c.[shift_refid]
left join [STRoute].[dbo].[trips] d
on a.[trip_refid] = d.[trip_refid]) z
--where {{{filters}}} ex:[Trip] = 0456 and [Date] = '2013-06-01'
group by [Name], [Order], [Rider]

------------------------------------Results displayed as pivot table------------------------------------
select [Name],[CHILD],[DIS],[ELD],[EMP],[PCA],[RF],[STP],[TCA],[VET]
,(isnull([CHILD],0)+isnull([DIS],0)+isnull([ELD],0)+isnull([EMP],0)+isnull([PCA],0)+isnull([RF],0)+isnull([STP],0)+isnull([TCA],0)+isnull([VET],0)) as [TOTAL]
from
(select [Name], [Order], [Rider], sum([Cnt]) as [Cnt]
from (select a.[pbs_id], a.[route_refid] as [Route], a.[shift_refid], c.[shift_name] as [Shift], a.[trip_refid]
, a.route_refid + '  ('+isnull(substring(cast(d.trip_startdeparttime as varchar),1,5), '')+ ')' as [Trip]
, [stop_refid] as [Name], [stop_sequence] as [Order], cast([stopdate] as date) as [Date]
, datepart(weekday,a.[stopdate]) as [Day], b.[passType_refid] as [Rider], b.passenger_on_count as [Cnt] , a.[PassengersOff]
from [STRoute].[dbo].[passengers_bystop] a
left join [STRoute].[dbo].[passengers_bystopdetails] b
on a.pbs_id = b.pbs_id
left join [STRoute].[dbo].[shifts] c
on a.[shift_refid] = c.[shift_refid]
left join [STRoute].[dbo].[trips] d
on a.[trip_refid] = d.[trip_refid]) z
--where {{{filters}}} ex:[Trip] = 0456 and [Date] = '2013-06-01'
group by [Name], [Order], [Rider]
) as magicTable
pivot
(SUM([Cnt]) for [Rider] in ([CHILD],[DIS],[ELD],[EMP],[PCA],[RF],[STP],[TCA],[VET],[TOTAL])) as pvt
order by [Order]