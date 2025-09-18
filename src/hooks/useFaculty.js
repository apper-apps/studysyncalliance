import { useState, useEffect } from "react";
import { facultyService } from "@/services/api/facultyService";

export const useFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFaculty = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await facultyService.getAll();
      setFaculty(data);
    } catch (err) {
      setError("Failed to load faculty");
      console.error("Error loading faculty:", err);
    } finally {
      setLoading(false);
    }
  };

  const addFaculty = async (facultyData) => {
    try {
      const newFaculty = await facultyService.create(facultyData);
      setFaculty(prev => [newFaculty, ...prev]);
      return newFaculty;
    } catch (err) {
      console.error("Error adding faculty:", err);
      throw err;
    }
  };

  const updateFaculty = async (id, facultyData) => {
    try {
      const updatedFaculty = await facultyService.update(id, facultyData);
      if (updatedFaculty) {
        setFaculty(prev => prev.map(member => 
          member.Id === id ? updatedFaculty : member
        ));
        return updatedFaculty;
      }
    } catch (err) {
      console.error("Error updating faculty:", err);
      throw err;
    }
  };

  const deleteFaculty = async (id) => {
    try {
      const deleted = await facultyService.delete(id);
      if (deleted) {
        setFaculty(prev => prev.filter(member => member.Id !== id));
        return deleted;
      }
    } catch (err) {
      console.error("Error deleting faculty:", err);
      throw err;
    }
  };

  const getFacultyById = (id) => {
    return faculty.find(member => member.Id === parseInt(id));
  };

  useEffect(() => {
    loadFaculty();
  }, []);

  return {
    faculty,
    loading,
    error,
    addFaculty,
    updateFaculty,
    deleteFaculty,
    getFacultyById,
    loadFaculty
  };
};