import { toast } from "react-toastify";
import React from "react";
export const courseService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "code_c" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "current_grade_c" } },
          { field: { Name: "grade_categories_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('course_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courses:", error?.response?.data?.message);
        toast.error("Failed to fetch courses");
      } else {
        console.error(error);
        toast.error("Failed to fetch courses");
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "code_c" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "current_grade_c" } },
          { field: { Name: "grade_categories_c" } }
        ]
      };

      const response = await apperClient.getRecordById('course_c', id, params);
      return response.data || null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching course with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async create(courseData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: courseData.Name || courseData.name_c,
          name_c: courseData.name_c,
          code_c: courseData.code_c,
          instructor_c: courseData.instructor_c,
          credits_c: parseInt(courseData.credits_c),
          color_c: courseData.color_c,
          schedule_c: courseData.schedule_c,
          current_grade_c: parseInt(courseData.current_grade_c) || 0,
          grade_categories_c: courseData.grade_categories_c
        }]
      };

      const response = await apperClient.createRecord('course_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} course records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Course created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating course:", error?.response?.data?.message);
        toast.error("Failed to create course");
      } else {
        console.error(error);
        toast.error("Failed to create course");
      }
      return null;
    }
  },

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: updateData.Name || updateData.name_c,
          name_c: updateData.name_c,
          code_c: updateData.code_c,
          instructor_c: updateData.instructor_c,
          credits_c: parseInt(updateData.credits_c),
          color_c: updateData.color_c,
          schedule_c: updateData.schedule_c,
          current_grade_c: parseInt(updateData.current_grade_c),
          grade_categories_c: updateData.grade_categories_c
        }]
      };

      const response = await apperClient.updateRecord('course_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} course records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Course updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course:", error?.response?.data?.message);
        toast.error("Failed to update course");
      } else {
        console.error(error);
        toast.error("Failed to update course");
      }
      return null;
    }
  },
async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('course_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} course records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Course deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course:", error?.response?.data?.message);
        toast.error("Failed to delete course");
      } else {
        console.error(error);
        toast.error("Failed to delete course");
      }
return false;
    }
  },

  async updateGrade(id, grade) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          current_grade_c: parseInt(grade)
        }]
      };

      const response = await apperClient.updateRecord('course_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        
        if (successfulUpdates.length > 0) {
          toast.success("Course grade updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course grade:", error?.response?.data?.message);
        toast.error("Failed to update course grade");
      } else {
        console.error(error);
        toast.error("Failed to update course grade");
      }
      return null;
    }
  }
};