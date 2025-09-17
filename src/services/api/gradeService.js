import gradeData from "@/services/mockData/grades.json";

let grades = [...gradeData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const gradeService = {
  async getAll() {
    await delay();
    return [...grades];
  },

  async getById(id) {
    await delay();
    const grade = grades.find(grade => grade.Id === parseInt(id));
    return grade ? { ...grade } : null;
  },

  async getByCourseId(courseId) {
    await delay();
    return grades.filter(grade => grade.courseId === parseInt(courseId));
  },

  async create(gradeData) {
    await delay();
    const maxId = Math.max(...grades.map(g => g.Id), 0);
    const newGrade = {
      ...gradeData,
      Id: maxId + 1,
      date: gradeData.date || new Date().toISOString()
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, updateData) {
    await delay();
    const index = grades.findIndex(grade => grade.Id === parseInt(id));
    if (index !== -1) {
      grades[index] = { ...grades[index], ...updateData };
      return { ...grades[index] };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = grades.findIndex(grade => grade.Id === parseInt(id));
    if (index !== -1) {
      const deleted = grades.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  },

  async calculateCourseGrade(courseId, gradeCategories) {
    await delay();
    const courseGrades = grades.filter(grade => grade.courseId === parseInt(courseId));
    
    if (courseGrades.length === 0) return 0;

    let totalWeightedScore = 0;
    let totalWeight = 0;

    gradeCategories.forEach(category => {
      const categoryGrades = courseGrades.filter(grade => grade.category === category.name);
      if (categoryGrades.length > 0) {
        const averageScore = categoryGrades.reduce((sum, grade) => sum + grade.score, 0) / categoryGrades.length;
        totalWeightedScore += averageScore * (category.weight / 100);
        totalWeight += category.weight / 100;
      }
    });

    return totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
  }
};