import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Mail, Phone, MapPin, DollarSign, Briefcase, Building2 } from 'lucide-react'
import { format } from 'date-fns'

const EmployeeDetails = ({ employee, onClose }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{employee.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={employee.role === 'admin' ? 'default' : 'secondary'}>
              {employee.role === 'admin' ? 'Administrator' : 'Employee'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Basic Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium ml-2">Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employee.position}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium ml-2">Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employee.department}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium ml-2">Annual Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(employee.salary)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium ml-2">Hire Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(new Date(employee.hireDate), 'MMM dd, yyyy')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{employee.email}</p>
            </div>
          </div>

          {employee.phone && (
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{employee.phone}</p>
              </div>
            </div>
          )}

          {employee.address && (
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-muted-foreground">{employee.address}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Employment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Employee ID</p>
              <p className="text-sm text-muted-foreground">EMP-{employee.id.padStart(4, '0')}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium">Employment Status</p>
              <Badge variant="secondary">Active</Badge>
            </div>

            <div>
              <p className="text-sm font-medium">Years of Service</p>
              <p className="text-sm text-muted-foreground">
                {Math.floor((new Date() - new Date(employee.hireDate)) / (365.25 * 24 * 60 * 60 * 1000))} years
              </p>
            </div>

            <div>
              <p className="text-sm font-medium">Monthly Salary</p>
              <p className="text-sm text-muted-foreground">{formatCurrency(employee.salary / 12)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </div>
  )
}

export default EmployeeDetails