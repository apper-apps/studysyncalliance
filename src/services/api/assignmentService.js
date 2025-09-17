import assignmentData from "@/services/mockData/assignments.json";

let assignments = [...assignmentData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const assignmentService = {
  async getAll() {
    await delay();
    return [...assignments];
  },

  async getById(id) {
    await delay();
    const assignment = assignments.find(assignment => assignment.Id === parseInt(id));
    return assignment ? { ...assignment } : null;
  },

  async getByCourseId(courseId) {
    await delay();
    return assignments.filter(assignment => assignment.courseId === parseInt(courseId));
  },

  async getUpcoming(days = 7) {
    await delay();
    const now = new Date();
    const future = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
    
    return assignments.filter(assignment => {
      const dueDate = new Date(assignment.dueDate);
      return dueDate >= now && dueDate <= future && assignment.status !== "completed";
    });
  },

  async getTodaysTasks() {
    await delay();
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    return assignments.filter(assignment => {
      const dueDate = new Date(assignment.dueDate);
      return dueDate >= today && dueDate < tomorrow && assignment.status !== "completed";
    });
  },

  async create(assignmentData) {
    await delay();
    const maxId = Math.max(...assignments.map(a => a.Id), 0);
    const newAssignment = {
      ...assignmentData,
      Id: maxId + 1
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, updateData) {
    await delay();
    const index = assignments.findIndex(assignment => assignment.Id === parseInt(id));
    if (index !== -1) {
      assignments[index] = { ...assignments[index], ...updateData };
      return { ...assignments[index] };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = assignments.findIndex(assignment => assignment.Id === parseInt(id));
    if (index !== -1) {
      const deleted = assignments.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  },

  async updateStatus(id, status) {
    await delay();
    const index = assignments.findIndex(assignment => assignment.Id === parseInt(id));
    if (index !== -1) {
      assignments[index].status = status;
      return { ...assignments[index] };
    }
    return null;
  }
};