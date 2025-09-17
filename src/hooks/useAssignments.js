import { useState, useEffect } from "react";
import { assignmentService } from "@/services/api/assignmentService";

export const useAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await assignmentService.getAll();
      setAssignments(data);
    } catch (err) {
      setError("Failed to load assignments");
      console.error("Error loading assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  const addAssignment = async (assignmentData) => {
    try {
      setError("");
      const newAssignment = await assignmentService.create(assignmentData);
      setAssignments(prev => [...prev, newAssignment]);
      return newAssignment;
    } catch (err) {
      setError("Failed to add assignment");
      throw err;
    }
  };

  const updateAssignment = async (id, updateData) => {
    try {
      setError("");
      const updatedAssignment = await assignmentService.update(id, updateData);
      if (updatedAssignment) {
        setAssignments(prev => prev.map(assignment => 
          assignment.Id === parseInt(id) ? updatedAssignment : assignment
        ));
        return updatedAssignment;
      }
    } catch (err) {
      setError("Failed to update assignment");
      throw err;
    }
  };

  const deleteAssignment = async (id) => {
    try {
      setError("");
      await assignmentService.delete(id);
      setAssignments(prev => prev.filter(assignment => assignment.Id !== parseInt(id)));
    } catch (err) {
      setError("Failed to delete assignment");
      throw err;
    }
  };

  const updateAssignmentStatus = async (id, status) => {
    try {
      setError("");
      const updatedAssignment = await assignmentService.updateStatus(id, status);
      if (updatedAssignment) {
        setAssignments(prev => prev.map(assignment => 
          assignment.Id === parseInt(id) ? updatedAssignment : assignment
        ));
        return updatedAssignment;
      }
    } catch (err) {
      setError("Failed to update assignment status");
      throw err;
    }
  };

  const getUpcomingAssignments = async (days = 7) => {
    try {
      const upcoming = await assignmentService.getUpcoming(days);
      return upcoming;
    } catch (err) {
      console.error("Error getting upcoming assignments:", err);
      return [];
    }
  };

  const getTodaysTasks = async () => {
    try {
      const todaysTasks = await assignmentService.getTodaysTasks();
      return todaysTasks;
    } catch (err) {
      console.error("Error getting today's tasks:", err);
      return [];
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  return {
    assignments,
    loading,
    error,
    loadAssignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    updateAssignmentStatus,
    getUpcomingAssignments,
    getTodaysTasks
  };
};