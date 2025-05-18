
import AxiosService from './AxiosService';

const EMPLOYEE_API_ENDPOINT = '/api/employees';

class EmployeeService {

    async addEmployee(employeeData) {
    try {
      console.log('Adding employee:', employeeData);
      const response = await AxiosService.post(EMPLOYEE_API_ENDPOINT, employeeData);
      console.log('Employee added successfully:', response);
      return response;
    } catch (error) {
      console.error('Error adding employee:', error);
      throw error;
    }
  }

  async getAllEmployees() {
    try {
      const response = await AxiosService.get(EMPLOYEE_API_ENDPOINT);
      return response;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  async getEmployeeById(id) {
    try {
      const response = await AxiosService.get(`${EMPLOYEE_API_ENDPOINT}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  }

  async updateEmployee(id, employeeData) {
    try {
      const response = await AxiosService.put(`${EMPLOYEE_API_ENDPOINT}/${id}`, employeeData);
      return response;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  async deleteEmployee(id) {
    try {
      const response = await AxiosService.delete(`${EMPLOYEE_API_ENDPOINT}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }

  async createEmployee(employeeData) {
    return this.addEmployee(employeeData);
  }
}

export default new EmployeeService();