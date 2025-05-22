import AxiosService from "./AxiosService";

const ENDPOINT = "/api/addresses";

class FormService {
  async addPerson(personData) {
    try {
      const response = await AxiosService.post(ENDPOINT, personData);
      return response;
    } 
    
    catch (error) {
      console.error("Error adding person details:", error);
      throw error;
    }
  }

  async getPersons() {
    try {
      const response = await AxiosService.get(ENDPOINT);
      return response;
    } catch (error) {
      console.error("Error getting person details:", error);
      throw error;
    }
  }

  async getPersonById(id){
   try{
      const response = await AxiosService.get(`${ENDPOINT}/${id}`);
      return response;
   }
   catch(error){
      console.error("Error getting person details by id:", error);
      throw error;
   }
  }

  async updatePerson(id, personData) {
      try {
        const response = await AxiosService.put(`${ENDPOINT}/${id}`, personData);
        return response;
      } catch (error) {
        console.error('Error updating person details:', error);
        throw error;
      }
    }
  
    async deletePerson(id) {
      try {
        const response = await AxiosService.delete(`${ENDPOINT}/${id}`);
        return response;
      } catch (error) {
        console.error('Error deleting person details:', error);
        throw error;
      }
    }
  
    async createPerson(personData) {
      return this.addPerson(personData);
    }
}
export default new FormService();
