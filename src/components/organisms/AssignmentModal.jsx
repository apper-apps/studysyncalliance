import React, { useState, useEffect } from "react";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { format } from "date-fns";
import { toast } from "react-toastify";

const AssignmentModal = ({ isOpen, onClose, onSave, editAssignment = null, courses = [] }) => {
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
    grade: "",
    notes: ""
  });

  useEffect(() => {
    if (editAssignment) {
      setFormData({
        ...editAssignment,
        dueDate: format(new Date(editAssignment.dueDate), "yyyy-MM-dd"),
        grade: editAssignment.grade || "",
        courseId: String(editAssignment.courseId)
      });
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      setFormData({
        title: "",
        courseId: courses.length > 0 ? String(courses[0].Id) : "",
        dueDate: format(tomorrow, "yyyy-MM-dd"),
        priority: "medium",
        status: "pending",
        grade: "",
        notes: ""
      });
    }
  }, [editAssignment, isOpen, courses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.courseId || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const assignmentData = {
      ...formData,
      courseId: Number(formData.courseId),
      grade: formData.grade ? Number(formData.grade) : null,
      dueDate: new Date(formData.dueDate).toISOString()
    };

    onSave(assignmentData);
    onClose();
    toast.success(editAssignment ? "Assignment updated successfully" : "Assignment added successfully");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editAssignment ? "Edit Assignment" : "Add New Assignment"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Assignment Title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Midterm Exam"
          required
        />

        <FormField label="Course" required>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.Id} value={course.Id}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Due Date"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />

          <FormField label="Priority">
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Status">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </FormField>

          <FormField
            label="Grade (%)"
            type="number"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            placeholder="85"
            min="0"
            max="100"
          />
        </div>

        <FormField
          label="Notes"
          type="textarea"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes about this assignment..."
          rows="3"
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {editAssignment ? "Update Assignment" : "Add Assignment"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignmentModal;