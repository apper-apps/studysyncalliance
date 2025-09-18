import { toast } from 'react-toastify';

export const gradeService = {
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
          { field: { Name: "course_id_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "title_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('grade_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades:", error?.response?.data?.message);
        toast.error("Failed to fetch grades");
      } else {
        console.error(error);
        toast.error("Failed to fetch grades");
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
          { field: { Name: "course_id_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "title_c" } }
        ]
      };

      const response = await apperClient.getRecordById('grade_c', id, params);
      return response.data || null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message);
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
          { field: { Name: "course_id_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "title_c" } }
        ],
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('grade_c', params);
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades by course ID:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async create(gradeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: gradeData.Name || gradeData.title_c,
          course_id_c: parseInt(gradeData.course_id_c),
          category_c: gradeData.category_c,
          score_c: parseInt(gradeData.score_c),
          weight_c: parseInt(gradeData.weight_c),
          date_c: gradeData.date_c || new Date().toISOString(),
          title_c: gradeData.title_c
        }]
      };

      const response = await apperClient.createRecord('grade_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} grade records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Grade created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grade:", error?.response?.data?.message);
        toast.error("Failed to create grade");
      } else {
        console.error(error);
        toast.error("Failed to create grade");
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
          course_id_c: parseInt(updateData.course_id_c),
          category_c: updateData.category_c,
          score_c: parseInt(updateData.score_c),
          weight_c: parseInt(updateData.weight_c),
          date_c: updateData.date_c,
          title_c: updateData.title_c
        }]
      };

      const response = await apperClient.updateRecord('grade_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} grade records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Grade updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade:", error?.response?.data?.message);
        toast.error("Failed to update grade");
      } else {
        console.error(error);
        toast.error("Failed to update grade");
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

      const response = await apperClient.deleteRecord('grade_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} grade records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Grade deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message);
        toast.error("Failed to delete grade");
      } else {
        console.error(error);
        toast.error("Failed to delete grade");
      }
      return false;
    }
  },

  async calculateCourseGrade(courseId, gradeCategories) {
    try {
      const courseGrades = await this.getByCourseId(courseId);
      
      if (courseGrades.length === 0) return 0;

      let totalWeightedScore = 0;
      let totalWeight = 0;

      gradeCategories.forEach(category => {
        const categoryGrades = courseGrades.filter(grade => grade.category_c === category.name);
        if (categoryGrades.length > 0) {
          const averageScore = categoryGrades.reduce((sum, grade) => sum + grade.score_c, 0) / categoryGrades.length;
          totalWeightedScore += averageScore * (category.weight / 100);
          totalWeight += category.weight / 100;
        }
      });

      return totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error calculating course grade:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return 0;
    }
  }
};