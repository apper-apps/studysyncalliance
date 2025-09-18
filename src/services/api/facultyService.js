import { toast } from "react-toastify";
import React from "react";
export const facultyService = {
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
          { field: { Name: "faculty_name_c" } },
          { field: { Name: "residential_address_c" } },
          { field: { Name: "years_of_experience_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "subjects_taught_c" } },
          { field: { Name: "weekly_teaching_hours_c" } },
          { field: { Name: "date_of_joining_c" } },
          { field: { Name: "number_of_publications_c" } },
          { field: { Name: "is_tenured_c" } },
          { field: { Name: "official_email_c" } },
          { field: { Name: "last_promotion_date_c" } },
          { field: { Name: "research_interests_c" } },
          { field: { Name: "reporting_manager_c" } },
          { field: { Name: "monthly_salary_c" } },
          { field: { Name: "background_verified_c" } },
          { field: { Name: "employment_status_c" } },
          { field: { Name: "contact_phone_c" } },
          { field: { Name: "faculty_website_c" } },
          { field: { Name: "faculty_rating_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('faculty_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching faculty:", error?.response?.data?.message);
        toast.error("Failed to fetch faculty");
      } else {
        console.error(error);
        toast.error("Failed to fetch faculty");
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
          { field: { Name: "faculty_name_c" } },
          { field: { Name: "residential_address_c" } },
          { field: { Name: "years_of_experience_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "subjects_taught_c" } },
          { field: { Name: "weekly_teaching_hours_c" } },
          { field: { Name: "date_of_joining_c" } },
          { field: { Name: "number_of_publications_c" } },
          { field: { Name: "is_tenured_c" } },
          { field: { Name: "official_email_c" } },
          { field: { Name: "last_promotion_date_c" } },
          { field: { Name: "research_interests_c" } },
          { field: { Name: "reporting_manager_c" } },
          { field: { Name: "monthly_salary_c" } },
          { field: { Name: "background_verified_c" } },
          { field: { Name: "employment_status_c" } },
          { field: { Name: "contact_phone_c" } },
          { field: { Name: "faculty_website_c" } },
          { field: { Name: "faculty_rating_c" } }
        ]
      };

      const response = await apperClient.getRecordById('faculty_c', id, params);
      return response.data || null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching faculty with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async create(facultyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: facultyData.Name || facultyData.faculty_name_c,
          faculty_name_c: facultyData.faculty_name_c,
          residential_address_c: facultyData.residential_address_c,
          years_of_experience_c: parseFloat(facultyData.years_of_experience_c),
          department_c: facultyData.department_c,
          subjects_taught_c: facultyData.subjects_taught_c,
          weekly_teaching_hours_c: parseInt(facultyData.weekly_teaching_hours_c),
          date_of_joining_c: facultyData.date_of_joining_c,
          number_of_publications_c: parseInt(facultyData.number_of_publications_c),
          is_tenured_c: facultyData.is_tenured_c,
          official_email_c: facultyData.official_email_c,
          last_promotion_date_c: facultyData.last_promotion_date_c,
          research_interests_c: facultyData.research_interests_c,
          reporting_manager_c: facultyData.reporting_manager_c,
          monthly_salary_c: parseFloat(facultyData.monthly_salary_c),
          background_verified_c: facultyData.background_verified_c,
          employment_status_c: facultyData.employment_status_c,
          contact_phone_c: facultyData.contact_phone_c,
          faculty_website_c: facultyData.faculty_website_c,
          faculty_rating_c: parseInt(facultyData.faculty_rating_c)
        }]
      };

      const response = await apperClient.createRecord('faculty_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} faculty records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Faculty member created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating faculty:", error?.response?.data?.message);
        toast.error("Failed to create faculty member");
      } else {
        console.error(error);
        toast.error("Failed to create faculty member");
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
          Name: updateData.Name || updateData.faculty_name_c,
          faculty_name_c: updateData.faculty_name_c,
          residential_address_c: updateData.residential_address_c,
          years_of_experience_c: parseFloat(updateData.years_of_experience_c),
          department_c: updateData.department_c,
          subjects_taught_c: updateData.subjects_taught_c,
          weekly_teaching_hours_c: parseInt(updateData.weekly_teaching_hours_c),
          date_of_joining_c: updateData.date_of_joining_c,
          number_of_publications_c: parseInt(updateData.number_of_publications_c),
          is_tenured_c: updateData.is_tenured_c,
          official_email_c: updateData.official_email_c,
          last_promotion_date_c: updateData.last_promotion_date_c,
          research_interests_c: updateData.research_interests_c,
          reporting_manager_c: updateData.reporting_manager_c,
          monthly_salary_c: parseFloat(updateData.monthly_salary_c),
          background_verified_c: updateData.background_verified_c,
          employment_status_c: updateData.employment_status_c,
          contact_phone_c: updateData.contact_phone_c,
          faculty_website_c: updateData.faculty_website_c,
          faculty_rating_c: parseInt(updateData.faculty_rating_c)
        }]
      };

      const response = await apperClient.updateRecord('faculty_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} faculty records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Faculty member updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating faculty:", error?.response?.data?.message);
        toast.error("Failed to update faculty member");
      } else {
        console.error(error);
        toast.error("Failed to update faculty member");
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

      const response = await apperClient.deleteRecord('faculty_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} faculty records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Faculty member deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting faculty:", error?.response?.data?.message);
        toast.error("Failed to delete faculty member");
      } else {
        console.error(error);
        toast.error("Failed to delete faculty member");
      }
      return false;
    }
  },

  async getByDepartment(department) {
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
          { field: { Name: "faculty_name_c" } },
          { field: { Name: "department_c" } }
        ],
        where: [
          {
            FieldName: "department_c",
            Operator: "EqualTo",
            Values: [department]
          }
        ]
      };

      const response = await apperClient.fetchRecords('faculty_c', params);
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching faculty by department:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getByEmploymentStatus(status) {
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
          { field: { Name: "faculty_name_c" } },
          { field: { Name: "employment_status_c" } }
        ],
        where: [
          {
            FieldName: "employment_status_c",
            Operator: "EqualTo",
            Values: [status]
          }
        ]
      };

      const response = await apperClient.fetchRecords('faculty_c', params);
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching faculty by employment status:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },
async updateSalary(id, salary) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          monthly_salary_c: parseFloat(salary)
        }]
      };

      const response = await apperClient.updateRecord('faculty_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        
        if (successfulUpdates.length > 0) {
          toast.success("Faculty salary updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating faculty salary:", error?.response?.data?.message);
        toast.error("Failed to update faculty salary");
      } else {
        console.error(error);
        toast.error("Failed to update faculty salary");
      }
      return null;
}
  }
};