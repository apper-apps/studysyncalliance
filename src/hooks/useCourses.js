import { useState, useEffect } from "react";
import { courseService } from "@/services/api/courseService";

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      setError("Failed to load courses");
      console.error("Error loading courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const addCourse = async (courseData) => {
    try {
      setError("");
      const newCourse = await courseService.create(courseData);
      setCourses(prev => [...prev, newCourse]);
      return newCourse;
    } catch (err) {
      setError("Failed to add course");
      throw err;
    }
  };

  const updateCourse = async (id, updateData) => {
    try {
      setError("");
      const updatedCourse = await courseService.update(id, updateData);
      if (updatedCourse) {
        setCourses(prev => prev.map(course => 
          course.Id === parseInt(id) ? updatedCourse : course
        ));
        return updatedCourse;
      }
    } catch (err) {
      setError("Failed to update course");
      throw err;
    }
  };

  const deleteCourse = async (id) => {
    try {
      setError("");
      await courseService.delete(id);
      setCourses(prev => prev.filter(course => course.Id !== parseInt(id)));
    } catch (err) {
      setError("Failed to delete course");
      throw err;
    }
  };

  const updateCourseGrade = async (id, grade) => {
    try {
      setError("");
      const updatedCourse = await courseService.updateGrade(id, grade);
      if (updatedCourse) {
        setCourses(prev => prev.map(course => 
          course.Id === parseInt(id) ? updatedCourse : course
        ));
      }
    } catch (err) {
      setError("Failed to update course grade");
      throw err;
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    loadCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    updateCourseGrade
  };
};