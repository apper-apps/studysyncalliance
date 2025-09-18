import { toast } from 'react-toastify';

export const assignmentService = {
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
          { field: { Name: "title_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "course_id_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error?.response?.data?.message);
        toast.error("Failed to fetch assignments");
      } else {
        console.error(error);
        toast.error("Failed to fetch assignments");
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
          { field: { Name: "title_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "course_id_c" } }
        ]
      };

      const response = await apperClient.getRecordById('assignment_c', id, params);
      return response.data || null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async getByCourseId(courseId) {
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
          { field: { Name: "title_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "course_id_c" } }
        ],
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('assignment_c', params);
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments by course ID:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getUpcoming(days = 7) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const future = new Date();
      future.setDate(future.getDate() + days);

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "course_id_c" } }
        ],
        where: [
          {
            FieldName: "due_date_c",
            Operator: "LessThanOrEqualTo",
            Values: [future.toISOString()]
          },
          {
            FieldName: "status_c",
            Operator: "NotEqualTo",
            Values: ["completed"]
          }
        ]
      };

      const response = await apperClient.fetchRecords('assignment_c', params);
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching upcoming assignments:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getTodaysTasks() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "course_id_c" } }
        ],
        where: [
          {
            FieldName: "due_date_c",
            Operator: "GreaterThanOrEqualTo",
            Values: [today.toISOString().split('T')[0]]
          },
          {
            FieldName: "due_date_c",
            Operator: "LessThan",
            Values: [tomorrow.toISOString().split('T')[0]]
          },
          {
            FieldName: "status_c",
            Operator: "NotEqualTo",
            Values: ["completed"]
          }
        ]
      };

      const response = await apperClient.fetchRecords('assignment_c', params);
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching today's tasks:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async create(assignmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: assignmentData.Name || assignmentData.title_c,
          title_c: assignmentData.title_c,
          due_date_c: assignmentData.due_date_c,
          priority_c: assignmentData.priority_c,
          status_c: assignmentData.status_c,
          grade_c: assignmentData.grade_c ? parseInt(assignmentData.grade_c) : null,
          notes_c: assignmentData.notes_c,
          course_id_c: parseInt(assignmentData.course_id_c)
        }]
      };

      const response = await apperClient.createRecord('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} assignment records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Assignment created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error?.response?.data?.message);
        toast.error("Failed to create assignment");
      } else {
        console.error(error);
        toast.error("Failed to create assignment");
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
          Name: updateData.Name || updateData.title_c,
          title_c: updateData.title_c,
          due_date_c: updateData.due_date_c,
          priority_c: updateData.priority_c,
          status_c: updateData.status_c,
          grade_c: updateData.grade_c ? parseInt(updateData.grade_c) : null,
          notes_c: updateData.notes_c,
          course_id_c: parseInt(updateData.course_id_c)
        }]
      };

      const response = await apperClient.updateRecord('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} assignment records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Assignment updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error?.response?.data?.message);
        toast.error("Failed to update assignment");
      } else {
        console.error(error);
        toast.error("Failed to update assignment");
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

      const response = await apperClient.deleteRecord('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} assignment records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Assignment deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting assignment:", error?.response?.data?.message);
        toast.error("Failed to delete assignment");
      } else {
        console.error(error);
        toast.error("Failed to delete assignment");
      }
      return false;
    }
  },

  async updateStatus(id, status) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          status_c: status
        }]
      };

      const response = await apperClient.updateRecord('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        
        if (successfulUpdates.length > 0) {
          toast.success("Assignment status updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment status:", error?.response?.data?.message);
        toast.error("Failed to update assignment status");
      } else {
        console.error(error);
        toast.error("Failed to update assignment status");
      }
      return null;
    }
  }
};