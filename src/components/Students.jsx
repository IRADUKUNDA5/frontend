import { useState, useEffect } from "react";
import { studentsAPI } from "./Apiservices";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStudent, setNewStudent] = useState({
    names: "",
    sex: "",
    trade: "",
  });
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching students...");
        const data = await studentsAPI.fetchStudents();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to fetch students.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingStudent) {
      setEditingStudent((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewStudent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newEntry = await studentsAPI.addStudent(newStudent);
      setStudents((prev) => [...prev, newEntry]);
      setNewStudent({ names: "", sex: "", trade: "" });
      setError(null);
    } catch (error) {
      console.error("Error submitting student:", error);
      setError("Failed to add student. Please try again.");
    }
  };
  const handleUpdate = async () => {
    if (!editingStudent) return;

    try {
      await studentsAPI.updateStudent(editingStudent.id, editingStudent);
      setStudents((prev) =>
        prev.map((student) =>
          student.id === editingStudent.id ? editingStudent : student
        )
      );
      setEditingStudent(null);
      setError(null);
    } catch (error) {
      console.error("Error updating student:", error);
      setError("Failed to update student. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await studentsAPI.deleteStudent(id);
      setStudents((prev) => prev.filter((student) => student.id !== id));
      setError(null);
    } catch (error) {
      console.error("Error deleting student:", error);
      setError("Failed to delete student. Please try again.");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-6 h-6 border-4 border-t-4 border-gray-200 border-t-blue-700 rounded-full  animate-spin"></div>
      <span className="text-gray-700 text-lg"></span>
    </div>
  );
  
  return (
    <div className="px-5">
      <div className="m-3 p-3 background">
        <h2 className="text-xl font-bold mb-4 text-center">Students List</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={editingStudent ? handleUpdate : handleSubmit} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            {editingStudent ? "Edit Student" : "Add New Student"}
          </h3>
          <div className="mb-4">
            <label htmlFor="names" className="block text-sm font-medium mb-1">
              Names
            </label>
            <input
              type="text"
              id="names"
              name="names"
              value={editingStudent ? editingStudent.names : newStudent.names}
              onChange={handleInputChange}
              className="border border-gray-300 px-4 py-2 w-full rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="sex" className="block text-sm font-medium mb-1">
              Sex
            </label>
            <input
              type="text"
              id="sex"
              name="sex"
              value={editingStudent ? editingStudent.sex : newStudent.sex}
              onChange={handleInputChange}
              className="border border-gray-300 px-4 py-2 w-full rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="trade" className="block text-sm font-medium mb-1">
              Trade
            </label>
            <input
              type="text"
              id="trade"
              name="trade"
              value={editingStudent ? editingStudent.trade : newStudent.trade}
              onChange={handleInputChange}
              className="border border-gray-300 px-4 py-2 w-full rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="bg text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            {editingStudent ? "Update Student" : "Add Student"}
          </button>
          {editingStudent && (
            <button
              type="button"
              onClick={() => setEditingStudent(null)}
              className="ml-2 bg text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
          )}
        </form>


        <table className="table-auto w-full border-collapse border border-gray-300 mt-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Names</th>
              <th className="border px-4 py-2">Sex</th>
              <th className="border px-4 py-2">Trade</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student,index) => (
              <tr key={student.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{index+1}</td>
                <td className="border px-4 py-2">{student.names}</td>
                <td className="border px-4 py-2">{student.sex}</td>
                <td className="border px-4 py-2">{student.trade}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => setEditingStudent(student)}
                    className="bg text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="ml-2 bg text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                   Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Students;
