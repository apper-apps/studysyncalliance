import facultyData from "@/services/mockData/faculty.json";

let faculty = [...facultyData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const facultyService = {
  async getAll() {
    await delay();
    return [...faculty];
  },

  async getById(id) {
    await delay();
    const member = faculty.find(member => member.Id === parseInt(id));
    return member ? { ...member } : null;
  },

  async create(facultyData) {
    await delay();
    const maxId = Math.max(...faculty.map(f => f.Id), 0);
    const newFaculty = {
      ...facultyData,
      Id: maxId + 1
    };
    faculty.push(newFaculty);
    return { ...newFaculty };
  },

  async update(id, updateData) {
    await delay();
    const index = faculty.findIndex(member => member.Id === parseInt(id));
    if (index !== -1) {
      faculty[index] = { ...faculty[index], ...updateData };
      return { ...faculty[index] };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = faculty.findIndex(member => member.Id === parseInt(id));
    if (index !== -1) {
      const deleted = faculty.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  },

  async getByDepartment(department) {
    await delay();
    return faculty
      .filter(member => member.department === department)
      .map(member => ({ ...member }));
  },

  async getByEmploymentStatus(status) {
    await delay();
    return faculty
      .filter(member => member.employmentStatus === status)
      .map(member => ({ ...member }));
  },

  async updateSalary(id, salary) {
    await delay();
    const index = faculty.findIndex(member => member.Id === parseInt(id));
    if (index !== -1) {
      faculty[index].monthlySalary = salary;
      return { ...faculty[index] };
    }
    return null;
  }
};