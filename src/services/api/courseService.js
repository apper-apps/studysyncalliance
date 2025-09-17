import courseData from "@/services/mockData/courses.json";

let courses = [...courseData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const courseService = {
  async getAll() {
    await delay();
    return [...courses];
  },

  async getById(id) {
    await delay();
    const course = courses.find(course => course.Id === parseInt(id));
    return course ? { ...course } : null;
  },

  async create(courseData) {
    await delay();
    const maxId = Math.max(...courses.map(c => c.Id), 0);
    const newCourse = {
      ...courseData,
      Id: maxId + 1,
      currentGrade: 0,
      gradeCategories: courseData.gradeCategories || [
        { name: "Exams", weight: 40 },
        { name: "Assignments", weight: 35 },
        { name: "Participation", weight: 15 },
        { name: "Projects", weight: 10 }
      ]
    };
    courses.push(newCourse);
    return { ...newCourse };
  },

  async update(id, updateData) {
    await delay();
    const index = courses.findIndex(course => course.Id === parseInt(id));
    if (index !== -1) {
      courses[index] = { ...courses[index], ...updateData };
      return { ...courses[index] };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = courses.findIndex(course => course.Id === parseInt(id));
    if (index !== -1) {
      const deleted = courses.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  },

  async updateGrade(id, grade) {
    await delay();
    const index = courses.findIndex(course => course.Id === parseInt(id));
    if (index !== -1) {
      courses[index].currentGrade = grade;
      return { ...courses[index] };
    }
    return null;
  }
};