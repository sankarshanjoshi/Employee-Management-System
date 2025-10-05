import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { employeeApi } from '@/lib/mockApi'
import { useAuth } from '@/contexts/AuthContext'
import { Search, Plus, Edit, Trash2, Users, DollarSign, Building2, Eye } from 'lucide-react'
import { format } from 'date-fns'
import EmployeeForm from './EmployeeForm'
import EmployeeDetails from './EmployeeDetails'

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [deleteEmployee, setDeleteEmployee] = useState(null)
  const { isAdmin, user } = useAuth()

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      const data = await employeeApi.getAll()
      setEmployees(data)
    } catch (error) {
      console.error('Failed to load employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEmployee = async (employeeData) => {
    try {
      const newEmployee = await employeeApi.create(employeeData)
      setEmployees(prev => [...prev, newEmployee])
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create employee:', error)
      throw error
    }
  }

  const handleUpdateEmployee = async (employeeData) => {
    try {
      const updatedEmployee = await employeeApi.update(selectedEmployee.id, employeeData)
      setEmployees(prev => 
        prev.map(emp => emp.id === selectedEmployee.id ? updatedEmployee : emp)
      )
      setShowEditForm(false)
      setSelectedEmployee(null)
    } catch (error) {
      console.error('Failed to update employee:', error)
      throw error
    }
  }

  const handleDeleteEmployee = async () => {
    try {
      await employeeApi.delete(deleteEmployee.id)
      setEmployees(prev => prev.filter(emp => emp.id !== deleteEmployee.id))
      setDeleteEmployee(null)
    } catch (error) {
      console.error('Failed to delete employee:', error)
    }
  }

  const filteredEmployees = employees.filter(employee => {
    const searchLower = searchTerm.toLowerCase()
    return (
      employee.name.toLowerCase().includes(searchLower) ||
      employee.email.toLowerCase().includes(searchLower) ||
      employee.position.toLowerCase().includes(searchLower) ||
      employee.department.toLowerCase().includes(searchLower)
    )
  })

  // Calculate statistics
  const totalEmployees = employees.length
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0)
  const departments = [...new Set(employees.map(emp => emp.department))].length

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your organization's workforce</p>
        </div>
        {isAdmin() && (
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Fill in the employee information to add them to the system.
                </DialogDescription>
              </DialogHeader>
              <EmployeeForm
                onSubmit={handleCreateEmployee}
                onCancel={() => setShowCreateForm(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalSalary.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search employees by name, email, position, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
          <CardDescription>
            {filteredEmployees.length} of {totalEmployees} employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Hire Date</TableHead>
                  {isAdmin() && <TableHead>Salary</TableHead>}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={isAdmin() ? 7 : 6} 
                      className="text-center py-8 text-gray-500"
                    >
                      No employees found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        {format(new Date(employee.hireDate), 'MMM dd, yyyy')}
                      </TableCell>
                      {isAdmin() && (
                        <TableCell>${employee.salary.toLocaleString()}</TableCell>
                      )}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedEmployee(employee)
                              setShowDetails(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {isAdmin() && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedEmployee(employee)
                                  setShowEditForm(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteEmployee(employee)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Employee Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update the employee information below.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <EmployeeForm
              employee={selectedEmployee}
              onSubmit={handleUpdateEmployee}
              onCancel={() => {
                setShowEditForm(false)
                setSelectedEmployee(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Employee Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <EmployeeDetails 
              employee={selectedEmployee} 
              onClose={() => {
                setShowDetails(false)
                setSelectedEmployee(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteEmployee} onOpenChange={() => setDeleteEmployee(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteEmployee?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteEmployee(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteEmployee}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EmployeeDashboard