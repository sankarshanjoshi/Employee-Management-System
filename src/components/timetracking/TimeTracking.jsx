import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { timeApi } from '@/lib/mockApi'
import { useAuth } from '@/contexts/AuthContext'
import { Clock, Play, Square, Calendar, Timer } from 'lucide-react'
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

const TimeTracking = () => {
  const [todayLog, setTodayLog] = useState(null)
  const [timeLogs, setTimeLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [clockingIn, setClockinIn] = useState(false)
  const [clockingOut, setClockingOut] = useState(false)
  const { user, employee, isAdmin } = useAuth()

  useEffect(() => {
    loadTimeData()
  }, [user])

  const loadTimeData = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Load today's log
      const today = await timeApi.getTodayLog(user.employeeId)
      setTodayLog(today)

      // Load recent time logs (last 30 days)
      const endDate = format(new Date(), 'yyyy-MM-dd')
      const startDate = format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
      
      const logs = await timeApi.getTimeLogs(
        isAdmin() ? null : user.employeeId, // Admin sees all logs, employees see only their own
        startDate,
        endDate
      )
      setTimeLogs(logs)
    } catch (error) {
      console.error('Failed to load time data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClockIn = async () => {
    try {
      setClockinIn(true)
      const log = await timeApi.clockIn(user.employeeId)
      setTodayLog(log)
      await loadTimeData() // Refresh the data
    } catch (error) {
      alert(error.message)
    } finally {
      setClockinIn(false)
    }
  }

  const handleClockOut = async () => {
    try {
      setClockingOut(true)
      const log = await timeApi.clockOut(user.employeeId)
      setTodayLog(log)
      await loadTimeData() // Refresh the data
    } catch (error) {
      alert(error.message)
    } finally {
      setClockingOut(false)
    }
  }

  const getCurrentTime = () => {
    return format(new Date(), 'HH:mm:ss')
  }

  const calculateWorkingHours = () => {
    if (!todayLog || !todayLog.clockIn) return 0
    
    if (todayLog.status === 'completed') {
      return todayLog.totalHours
    }

    // Calculate current working hours
    const clockInTime = new Date(`${todayLog.date}T${todayLog.clockIn}:00`)
    const now = new Date()
    return Math.round(((now - clockInTime) / (1000 * 60 * 60)) * 100) / 100
  }

  // Calculate statistics
  const weekLogs = timeLogs.filter(log => {
    const logDate = parseISO(log.date)
    const weekStart = startOfWeek(new Date())
    const weekEnd = endOfWeek(new Date())
    return logDate >= weekStart && logDate <= weekEnd
  })

  const monthLogs = timeLogs.filter(log => {
    const logDate = parseISO(log.date)
    const monthStart = startOfMonth(new Date())
    const monthEnd = endOfMonth(new Date())
    return logDate >= monthStart && logDate <= monthEnd
  })

  const weeklyHours = weekLogs.reduce((sum, log) => sum + (log.totalHours || 0), 0)
  const monthlyHours = monthLogs.reduce((sum, log) => sum + (log.totalHours || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Time Tracking</h1>
        <p className="text-gray-600 mt-1">
          {isAdmin() 
            ? 'Monitor employee working hours' 
            : 'Track your working hours and attendance'
          }
        </p>
      </div>

      {/* Current Time and Clock In/Out - Only for employees */}
      {!isAdmin() && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Attendance
            </CardTitle>
            <CardDescription>
              Current time: {getCurrentTime()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                {todayLog ? (
                  <div>
                    <p className="text-sm text-gray-600">
                      Clock In: {todayLog.clockIn}
                      {todayLog.clockOut && ` • Clock Out: ${todayLog.clockOut}`}
                    </p>
                    <p className="text-lg font-semibold">
                      Working Hours: {calculateWorkingHours().toFixed(2)} hours
                    </p>
                    <Badge 
                      variant={todayLog.status === 'active' ? 'default' : 'secondary'}
                    >
                      {todayLog.status === 'active' ? 'Working' : 'Completed'}
                    </Badge>
                  </div>
                ) : (
                  <p className="text-gray-600">Not clocked in today</p>
                )}
              </div>

              <div className="flex gap-2">
                {!todayLog ? (
                  <Button
                    onClick={handleClockIn}
                    disabled={clockingIn}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {clockingIn ? (
                      <>Loading...</>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Clock In
                      </>
                    )}
                  </Button>
                ) : todayLog.status === 'active' ? (
                  <Button
                    onClick={handleClockOut}
                    disabled={clockingOut}
                    variant="destructive"
                  >
                    {clockingOut ? (
                      <>Loading...</>
                    ) : (
                      <>
                        <Square className="mr-2 h-4 w-4" />
                        Clock Out
                      </>
                    )}
                  </Button>
                ) : (
                  <Badge variant="secondary">Day completed</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Hours</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayLog ? calculateWorkingHours().toFixed(1) : '0.0'}h
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyHours.toFixed(1)}h</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyHours.toFixed(1)}h</div>
          </CardContent>
        </Card>
      </div>

      {/* Time Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Time Logs</CardTitle>
          <CardDescription>
            {isAdmin() ? 'All employee time logs' : 'Your time tracking history'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  {isAdmin() && <TableHead>Employee</TableHead>}
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeLogs.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={isAdmin() ? 6 : 5} 
                      className="text-center py-8 text-gray-500"
                    >
                      No time logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  timeLogs
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {format(parseISO(log.date), 'MMM dd, yyyy')}
                        </TableCell>
                        {isAdmin() && (
                          <TableCell>
                            {log.employeeName}
                          </TableCell>
                        )}
                        <TableCell>{log.clockIn}</TableCell>
                        <TableCell>{log.clockOut || '-'}</TableCell>
                        <TableCell>
                          {log.totalHours ? `${log.totalHours.toFixed(2)}h` : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={log.status === 'active' ? 'default' : 'secondary'}
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TimeTracking