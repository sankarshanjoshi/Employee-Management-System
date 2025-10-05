import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { User, Mail, Phone, MapPin, Building2, Briefcase } from 'lucide-react'

const Settings = () => {
  const { employee, user } = useAuth()

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Your personal and employment information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={employee?.name || ''}
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  value={employee?.email || ''}
                  readOnly
                  className="pl-10 bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="position"
                    value={employee?.position || ''}
                    readOnly
                    className="pl-10 bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="department"
                    value={employee?.department || ''}
                    readOnly
                    className="pl-10 bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {employee?.phone && (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={employee.phone}
                    readOnly
                    className="pl-10 bg-gray-50"
                  />
                </div>
              </div>
            )}

            {employee?.address && (
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    value={employee.address}
                    readOnly
                    className="pl-10 bg-gray-50"
                  />
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                To update your profile information, please contact your administrator.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account preferences and security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Account Type</Label>
              <Input
                value={user?.role === 'admin' ? 'Administrator' : 'Employee'}
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label>Employee ID</Label>
              <Input
                value={`EMP-${employee?.id?.padStart(4, '0')}`}
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label>Member Since</Label>
              <Input
                value={employee?.hireDate ? new Date(employee.hireDate).toLocaleDateString() : 'N/A'}
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                Password changes require administrator approval.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Settings */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Customize your experience with the Employee Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive email updates about your time logs and announcements</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="font-medium">Time Zone</p>
                <p className="text-sm text-gray-600">Your local time zone for accurate time tracking</p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="font-medium">Language</p>
                <p className="text-sm text-gray-600">Choose your preferred language for the interface</p>
              </div>
              <Button variant="outline" size="sm">
                English
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Settings