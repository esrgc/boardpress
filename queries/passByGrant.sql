--REQUEST ST: Breakout by Funding Source – basically a total of passengers on and off and for a period of time by funding source usually a month.
select [Name], sum(c.passengerOn) as [On], sum(c.passengersOff) as [Off]
from (
  select cast(a.stopdate as date) as [Date], datepart(weekday,a.stopdate) as [Day], a.shift_refid, b.passengerOn, a.passengersOff
  from [STRoute].[dbo].[passengers_bystop] a
  left join 
  (select pbs_id, sum(passenger_on_count) passengerOn
  from [STRoute].[dbo].[passengers_bystopdetails]
  group by pbs_id) b
  on a.pbs_id = b.pbs_id
  ) c
  left join 
  (select a.shift_refid, b.[BucketName] as [Name]
  from [STRoute].[dbo].[shifts] a
  join [STRoute].[dbo].[info_fares_BucketInfo] b
  on a.BucketInfo_ID = b.BucketInfo_ID
  ) d
  on c.shift_refid = d.shift_refid
--where {{{filters}}} ex:[Day] = 1 or [Date] between X and Y
  group by [Name]
  order by [Name]