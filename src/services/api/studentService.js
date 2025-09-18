import { toast } from "react-toastify";
import React from "react";

export const studentService = {
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
          { field: { Name: "student_name_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "cgpa_c" } },
          { field: { Name: "grade_level_c" } },
          { field: { Name: "subjects_enrolled_c" } },
          { field: { Name: "attendance_percentage_c" } },
          { field: { Name: "date_of_birth_c" } },
          { field: { Name: "completed_credits_c" } },
          { field: { Name: "is_enrolled_c" } },
          { field: { Name: "student_email_c" } },
          { field: { Name: "last_login_c" } },
          { field: { Name: "student_interests_c" } },
          { field: { Name: "assigned_counselor_c" } },
          { field: { Name: "scholarship_amount_c" } },
          { field: { Name: "parental_consent_received_c" } },
          { field: { Name: "enrollment_status_c" } },
          { field: { Name: "emergency_contact_c" } },
          { field: { Name: "student_portfolio_website_c" } },
          { field: { Name: "student_satisfaction_rating_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching students:", error?.response?.data?.message);
        toast.error("Failed to fetch students");
      } else {
        console.error(error);
        toast.error("Failed to fetch students");
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
          { field: { Name: "student_name_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "cgpa_c" } },
          { field: { Name: "grade_level_c" } },
          { field: { Name: "subjects_enrolled_c" } },
          { field: { Name: "attendance_percentage_c" } },
          { field: { Name: "date_of_birth_c" } },
          { field: { Name: "completed_credits_c" } },
          { field: { Name: "is_enrolled_c" } },
          { field: { Name: "student_email_c" } },
          { field: { Name: "last_login_c" } },
          { field: { Name: "student_interests_c" } },
          { field: { Name: "assigned_counselor_c" } },
          { field: { Name: "scholarship_amount_c" } },
          { field: { Name: "parental_consent_received_c" } },
          { field: { Name: "enrollment_status_c" } },
          { field: { Name: "emergency_contact_c" } },
          { field: { Name: "student_portfolio_website_c" } },
          { field: { Name: "student_satisfaction_rating_c" } }
        ]
      };

      const response = await apperClient.getRecordById('student_c', id, params);
      return response.data || null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching student with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async create(studentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: studentData.Name || studentData.student_name_c,
          student_name_c: studentData.student_name_c,
          address_c: studentData.address_c,
          cgpa_c: parseFloat(studentData.cgpa_c),
          grade_level_c: studentData.grade_level_c,
          subjects_enrolled_c: studentData.subjects_enrolled_c,
          attendance_percentage_c: parseInt(studentData.attendance_percentage_c),
          date_of_birth_c: studentData.date_of_birth_c,
          completed_credits_c: parseInt(studentData.completed_credits_c),
          is_enrolled_c: studentData.is_enrolled_c,
          student_email_c: studentData.student_email_c,
          last_login_c: studentData.last_login_c,
          student_interests_c: studentData.student_interests_c,
          assigned_counselor_c: studentData.assigned_counselor_c,
          scholarship_amount_c: parseFloat(studentData.scholarship_amount_c),
          parental_consent_received_c: studentData.parental_consent_received_c,
          enrollment_status_c: studentData.enrollment_status_c,
          emergency_contact_c: studentData.emergency_contact_c,
          student_portfolio_website_c: studentData.student_portfolio_website_c,
          student_satisfaction_rating_c: parseInt(studentData.student_satisfaction_rating_c)
        }]
      };

      const response = await apperClient.createRecord('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} student records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Student created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating student:", error?.response?.data?.message);
        toast.error("Failed to create student");
      } else {
        console.error(error);
        toast.error("Failed to create student");
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
          Name: updateData.Name || updateData.student_name_c,
          student_name_c: updateData.student_name_c,
          address_c: updateData.address_c,
          cgpa_c: parseFloat(updateData.cgpa_c),
          grade_level_c: updateData.grade_level_c,
          subjects_enrolled_c: updateData.subjects_enrolled_c,
          attendance_percentage_c: parseInt(updateData.attendance_percentage_c),
          date_of_birth_c: updateData.date_of_birth_c,
          completed_credits_c: parseInt(updateData.completed_credits_c),
          is_enrolled_c: updateData.is_enrolled_c,
          student_email_c: updateData.student_email_c,
          last_login_c: updateData.last_login_c,
          student_interests_c: updateData.student_interests_c,
          assigned_counselor_c: updateData.assigned_counselor_c,
          scholarship_amount_c: parseFloat(updateData.scholarship_amount_c),
          parental_consent_received_c: updateData.parental_consent_received_c,
          enrollment_status_c: updateData.enrollment_status_c,
          emergency_contact_c: updateData.emergency_contact_c,
          student_portfolio_website_c: updateData.student_portfolio_website_c,
          student_satisfaction_rating_c: parseInt(updateData.student_satisfaction_rating_c)
        }]
      };

      const response = await apperClient.updateRecord('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} student records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Student updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating student:", error?.response?.data?.message);
        toast.error("Failed to update student");
      } else {
        console.error(error);
        toast.error("Failed to update student");
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

      const response = await apperClient.deleteRecord('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} student records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Student deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting student:", error?.response?.data?.message);
        toast.error("Failed to delete student");
      } else {
        console.error(error);
        toast.error("Failed to delete student");
      }
      return false;
    }
  },

  async getByGradeLevel(gradeLevel) {
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
          { field: { Name: "student_name_c" } },
          { field: { Name: "grade_level_c" } }
        ],
        where: [
          {
            FieldName: "grade_level_c",
            Operator: "EqualTo",
            Values: [gradeLevel]
          }
        ]
      };

      const response = await apperClient.fetchRecords('student_c', params);
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching students by grade level:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getByEnrollmentStatus(status) {
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
          { field: { Name: "student_name_c" } },
          { field: { Name: "enrollment_status_c" } }
        ],
        where: [
          {
            FieldName: "enrollment_status_c",
            Operator: "EqualTo",
            Values: [status]
          }
        ]
      };

      const response = await apperClient.fetchRecords('student_c', params);
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching students by enrollment status:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async updateAttendance(id, attendance) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          attendance_percentage_c: parseInt(attendance)
        }]
      };

      const response = await apperClient.updateRecord('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        
        if (successfulUpdates.length > 0) {
          toast.success("Student attendance updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating student attendance:", error?.response?.data?.message);
        toast.error("Failed to update student attendance");
      } else {
        console.error(error);
        toast.error("Failed to update student attendance");
      }
      return null;
    }
    }
  }