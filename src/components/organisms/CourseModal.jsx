import React, { useState, useEffect } from "react";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { toast } from "react-toastify";

const CourseModal = ({ isOpen, onClose, onSave, editCourse = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    instructor: "",
    credits: 3,
    color: "#4F46E5",
    schedule: []
  });

  const [scheduleInput, setScheduleInput] = useState("");

  useEffect(() => {
    if (editCourse) {
      setFormData({
        ...editCourse,
        schedule: editCourse.schedule || []
      });
      setScheduleInput(editCourse.schedule?.join(", ") || "");
    } else {
      setFormData({
        name: "",
        code: "",
        instructor: "",
        credits: 3,
        color: "#4F46E5",
        schedule: []
      });
      setScheduleInput("");
    }
  }, [editCourse, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.code.trim() || !formData.instructor.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const schedule = scheduleInput
      .split(",")
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const courseData = {
      ...formData,
      schedule,
      credits: Number(formData.credits)
    };

    onSave(courseData);
    onClose();
    toast.success(editCourse ? "Course updated successfully" : "Course added successfully");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const colorOptions = [
    { value: "#4F46E5", label: "Indigo" },
    { value: "#7C3AED", label: "Purple" },
    { value: "#F59E0B", label: "Amber" },
    { value: "#EF4444", label: "Red" },
    { value: "#10B981", label: "Green" },
    { value: "#3B82F6", label: "Blue" },
    { value: "#F97316", label: "Orange" },
    { value: "#8B5CF6", label: "Violet" }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editCourse ? "Edit Course" : "Add New Course"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Course Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Introduction to Computer Science"
          required
        />

        <FormField
          label="Course Code"
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="CS 101"
          required
        />

        <FormField
          label="Instructor"
          type="text"
          name="instructor"
          value={formData.instructor}
          onChange={handleChange}
          placeholder="Dr. Smith"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Credits"
            type="number"
            name="credits"
            value={formData.credits}
            onChange={handleChange}
            min="1"
            max="6"
            required
          />

          <FormField label="Color">
            <select
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {colorOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField
          label="Schedule"
          type="text"
          value={scheduleInput}
          onChange={(e) => setScheduleInput(e.target.value)}
          placeholder="Mon/Wed/Fri 9:00-10:00, Tue 2:00-3:30"
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {editCourse ? "Update Course" : "Add Course"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CourseModal;