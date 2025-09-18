import { useState, useEffect } from "react";
import { studentService } from "@/services/api/studentService";

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError("Failed to load students");
      console.error("Error loading students:", err);
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (studentData) => {
    try {
      const newStudent = await studentService.create(studentData);
      setStudents(prev => [newStudent, ...prev]);
      return newStudent;
    } catch (err) {
      console.error("Error adding student:", err);
      throw err;
    }
  };

  const updateStudent = async (id, studentData) => {
    try {
      const updatedStudent = await studentService.update(id, studentData);
      if (updatedStudent) {
        setStudents(prev => prev.map(student => 
          student.Id === id ? updatedStudent : student
        ));
        return updatedStudent;
      }
    } catch (err) {
      console.error("Error updating student:", err);
      throw err;
    }
  };

  const deleteStudent = async (id) => {
    try {
      const deleted = await studentService.delete(id);
      if (deleted) {
        setStudents(prev => prev.filter(student => student.Id !== id));
        return deleted;
      }
    } catch (err) {
      console.error("Error deleting student:", err);
      throw err;
    }
  };

  const getStudentById = (id) => {
    return students.find(student => student.Id === parseInt(id));
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return {
    students,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    loadStudents
  };
};