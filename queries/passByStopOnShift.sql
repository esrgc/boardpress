--REQUEST ST:  Breakout by stops on a particular trip or shift – total of each passenger type, when doing this I first filter on route name
--and then I do custom sort by shiftname & stop sequence.  Then I do subtotals at every change in stoprefid or stopname.
select b.route_refid + '  ('+isnull(substring(cast(c.trip_startdeparttime as varchar),1,5), '')+ ')' as Trip,
stop_refid as [Stop], --stop_sequence as [order], 
passType_refid as [Rider], sum(a.passenger_on_count) as [Cnt]
from [STRoute].[dbo].[passengers_bystopdetails] a
join [STRoute].[dbo].[passengers_bystop] b
on a.pbs_id = b.pbs_id
  join [STRoute].[dbo].[trips] c
  on b.trip_refid = c.[trip_refid]
where b.shift_refid = 000002
--where {{{filters}}} ex:datepart(weekday,b.stopdate) = 1 or a.stopdate between X and Y
group by b.route_refid + '  ('+isnull(substring(cast(c.trip_startdeparttime as varchar),1,5), '')+ ')', stop_refid, stop_sequence, passType_refid
order by b.route_refid + '  ('+isnull(substring(cast(c.trip_startdeparttime as varchar),1,5), '')+ ')'

------------------------------------Results displayed as pivot table------------------------------------
select [Stop],[CHILD],[DIS],[ELD],[EMP],[PCA],[RF],[STP],[TCA],[VET]
,(isnull([CHILD],0)+isnull([DIS],0)+isnull([ELD],0)+isnull([EMP],0)+isnull([PCA],0)+isnull([RF],0)+isnull([STP],0)+isnull([TCA],0)+isnull([VET],0)) as [TOTAL]
from 
(select b.route_refid + '  ('+isnull(substring(cast(c.trip_startdeparttime as varchar),1,5), '')+ ')' as Trip,
stop_refid as [Stop], --stop_sequence as [order], 
passType_refid as [Rider], sum(a.passenger_on_count) as [Cnt]
from [STRoute].[dbo].[passengers_bystopdetails] a
join [STRoute].[dbo].[passengers_bystop] b
on a.pbs_id = b.pbs_id
  join [STRoute].[dbo].[trips] c
  on b.trip_refid = c.[trip_refid]
--where b.shift_refid = 000002
--where {{{filters}}} ex:datepart(weekday,b.stopdate) = 1 or a.stopdate between X and Y
group by b.route_refid + '  ('+isnull(substring(cast(c.trip_startdeparttime as varchar),1,5), '')+ ')', stop_refid, stop_sequence, passType_refid
--order by b.route_refid + '  ('+isnull(substring(cast(c.trip_startdeparttime as varchar),1,5), '')+ ')'
) as magicTable
pivot
(SUM([Cnt]) for [Rider] in ([CHILD],[DIS],[ELD],[EMP],[PCA],[RF],[STP],[TCA],[VET],[TOTAL])) as pvt
order by [Stop]