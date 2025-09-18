import studentData from "@/services/mockData/students.json";

let students = [...studentData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const studentService = {
  async getAll() {
    await delay();
    return [...students];
  },

  async getById(id) {
    await delay();
    const student = students.find(student => student.Id === parseInt(id));
    return student ? { ...student } : null;
  },

  async create(studentData) {
    await delay();
    const maxId = Math.max(...students.map(s => s.Id), 0);
    const newStudent = {
      ...studentData,
      Id: maxId + 1
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, updateData) {
    await delay();
    const index = students.findIndex(student => student.Id === parseInt(id));
    if (index !== -1) {
      students[index] = { ...students[index], ...updateData };
      return { ...students[index] };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = students.findIndex(student => student.Id === parseInt(id));
    if (index !== -1) {
      const deleted = students.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  },

  async getByGradeLevel(gradeLevel) {
    await delay();
    return students
      .filter(student => student.gradeLevel === gradeLevel)
      .map(student => ({ ...student }));
  },

  async getByEnrollmentStatus(status) {
    await delay();
    return students
      .filter(student => student.enrollmentStatus === status)
      .map(student => ({ ...student }));
  },

  async updateAttendance(id, attendance) {
    await delay();
    const index = students.findIndex(student => student.Id === parseInt(id));
    if (index !== -1) {
      students[index].attendancePercentage = attendance;
      return { ...students[index] };
    }
    return null;
  }
};