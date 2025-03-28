import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; 

const Apiservice = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const studentsAPI = {  
  fetchStudents: () => 
    Apiservice.get("/select/students")
      .then((response) => response.data) 
      .catch((error) => {
        console.error("Error fetching students:", error.message);
        throw error;
      }),
  addStudent: (studentData) =>
    Apiservice.post("/create/student", studentData)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error adding student:", error.message);
        throw error;
      }),
  updateStudent: (id, studentData) =>
    Apiservice.put(`/update/student/${id}`, studentData)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error updating student:", error.message);
        throw error;
      }),

  // Delete a student (DELETE request)
  deleteStudent: (id) =>
    Apiservice.delete(`/delete/student/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error deleting student:", error.message);
        throw error;
      }),
};

export default Apiservice;
