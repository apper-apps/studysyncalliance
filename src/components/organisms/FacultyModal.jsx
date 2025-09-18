import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import TextArea from "@/components/atoms/TextArea";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";

const FacultyModal = ({ isOpen, onClose, onSave, editFaculty = null }) => {
const [formData, setFormData] = useState({
    faculty_name_c: "",
    residential_address_c: "",
    years_of_experience_c: 0.0,
    department_c: "Science",
    subjects_taught_c: [],
    weekly_teaching_hours_c: 0,
    date_of_joining_c: "",
    number_of_publications_c: 0,
    is_tenured_c: false,
    official_email_c: "",
    last_promotion_date_c: "",
    research_interests_c: [],
    reporting_manager_c: "",
    monthly_salary_c: 0,
    background_verified_c: false,
    employment_status_c: "Active",
    contact_phone_c: "",
    faculty_website_c: "",
    faculty_rating_c: 5
  });

  const [tempInterest, setTempInterest] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editFaculty) {
setFormData({
        ...editFaculty,
        date_of_joining_c: editFaculty.date_of_joining_c ? editFaculty.date_of_joining_c.split('T')[0] : "",
        last_promotion_date_c: editFaculty.last_promotion_date_c ? 
          new Date(editFaculty.last_promotion_date_c).toISOString().slice(0, 16) : "",
        subjects_taught_c: editFaculty.subjects_taught_c || [],
        research_interests_c: editFaculty.research_interests_c || []
      });
    } else {
setFormData({
        faculty_name_c: "",
        residential_address_c: "",
        years_of_experience_c: 0.0,
        department_c: "Science",
        subjects_taught_c: [],
        weekly_teaching_hours_c: 0,
        date_of_joining_c: "",
        number_of_publications_c: 0,
        is_tenured_c: false,
        official_email_c: "",
        last_promotion_date_c: "",
        research_interests_c: [],
        reporting_manager_c: "",
        monthly_salary_c: 0,
        background_verified_c: false,
        employment_status_c: "Active",
        contact_phone_c: "",
        faculty_website_c: "",
        faculty_rating_c: 5
      });
    }
    setErrors({});
  }, [editFaculty, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
if (!formData.faculty_name_c?.trim()) {
      newErrors.faculty_name_c = "Faculty name is required";
    }
    
    if (formData.official_email_c && !/\S+@\S+\.\S+/.test(formData.official_email_c)) {
      newErrors.official_email_c = "Invalid email format";
    }
    
    if (formData.years_of_experience_c < 0) {
      newErrors.years_of_experience_c = "Experience cannot be negative";
    }
    
    if (formData.weekly_teaching_hours_c < 0 || formData.weekly_teaching_hours_c > 40) {
      newErrors.weekly_teaching_hours_c = "Teaching hours must be between 0 and 40";
    }
    
    if (formData.number_of_publications_c < 0) {
      newErrors.number_of_publications_c = "Publications cannot be negative";
    }

    if (formData.faculty_website_c && 
        !/^https?:\/\/.*\..+/.test(formData.faculty_website_c)) {
      newErrors.faculty_website_c = "Invalid website URL format";
    }

    if (formData.contact_phone_c && 
        !/^\+?[\d\s\-()]{10,}$/.test(formData.contact_phone_c)) {
      newErrors.contact_phone_c = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    const facultyData = {
...formData,
      years_of_experience_c: parseFloat(formData.years_of_experience_c),
      weekly_teaching_hours_c: parseInt(formData.weekly_teaching_hours_c),
      number_of_publications_c: parseInt(formData.number_of_publications_c),
      monthly_salary_c: parseFloat(formData.monthly_salary_c)
    };

    onSave(facultyData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

const handleMultiSelect = (name, value) => {
    setFormData(prev => {
      const currentValues = prev[name] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [name]: newValues };
    });
  };

const handleAddInterest = () => {
    if (tempInterest.trim() && !formData.research_interests_c.includes(tempInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        research_interests_c: [...prev.research_interests_c, tempInterest.trim()]
      }));
      setTempInterest("");
    }
  };

const handleRemoveInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      research_interests_c: prev.research_interests_c.filter(i => i !== interest)
    }));
  };

  const renderRatingStars = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
onClick={() => setFormData(prev => ({ ...prev, faculty_rating_c: star }))}
            className={`p-1 rounded transition-colors ${
              star <= formData.faculty_rating_c 
                ? "text-yellow-400 hover:text-yellow-500" 
                : "text-gray-300 hover:text-gray-400"
            }`}
          >
            <ApperIcon name="Star" size={20} className={star <= formData.faculty_rating_c ? "fill-current" : ""} />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          ({formData.faculty_rating_c}/5)
        </span>
      </div>
    );
  };

  const subjectOptions = ["Physics", "Chemistry", "Mathematics", "English", "Computer Science"];
  const managerOptions = ["Dr. Smith", "Prof. Johnson", "Ms. Williams", "Dr. Brown", "Prof. Davis"];
  const interestOptions = ["AI", "Quantum Physics", "Literature", "Economics"];

  return (
    <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={editFaculty ? "Edit Faculty Member" : "Add New Faculty Member"}
    size="lg">
    <form onSubmit={handleSubmit} className="space-y-6">
        <div className="max-h-96 overflow-y-auto space-y-6 pr-2">
            {/* Basic Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                <FormField
                    label="Faculty Name"
                    type="text"
                    name="faculty_name_c"
                    value={formData.faculty_name_c}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    error={errors.faculty_name_c}
                    required />
                <FormField
                    label="Residential Address"
                    type="textarea"
                    name="residentialAddress"
                    value={formData.residential_address_c}
                    onChange={handleChange}
                    placeholder="Enter full address"
                    rows={3} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="Years of Experience"
                        type="number"
                        name="yearsOfExperience"
                        value={formData.years_of_experience_c}
                        onChange={handleChange}
                        placeholder="0.0"
                        step="0.1"
                        min="0"
                        error={errors.years_of_experience_c} />
                    <FormField label="Department">
                        <Select name="department" value={formData.department_c} onChange={handleChange}>
                            <option value="Science">Science</option>
                            <option value="Arts">Arts</option>
                            <option value="Commerce">Commerce</option>
                            <option value="Engineering">Engineering</option>
                        </Select>
                    </FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="Official Email"
                        type="email"
                        name="officialEmail"
                        value={formData.official_email_c}
                        onChange={handleChange}
                        placeholder="faculty@example.com"
                        error={errors.official_email_c} />
                    <FormField
                        label="Contact Phone"
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        placeholder="+1-202-555-0162"
                        error={errors.contact_phone_c} />
                </div>
            </div>
            {/* Academic Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Academic Information</h3>
                <FormField label="Subjects Taught">
                    <div className="grid grid-cols-2 gap-2">
                        {subjectOptions.map(subject => <label key={subject} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={formData.subjects_taught_c.includes(subject)}
                                onChange={() => handleMultiSelect("subjects_taught_c", subject)}
                                className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                            <span className="text-sm text-gray-700">{subject}</span>
                        </label>)}
                    </div>
                </FormField>
                <FormField label="Weekly Teaching Hours">
                    <div className="space-y-2">
                        <input
                            type="range"
                            name="weekly_teaching_hours_c"
                            value={formData.weekly_teaching_hours_c}
                            onChange={handleChange}
                            min="0"
                            max="40"
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>0 hours</span>
                            <span className="font-medium">{formData.weekly_teaching_hours_c}hours</span>
                            <span>40 hours</span>
                        </div>
                    </div>
                    {errors.weeklyTeachingHours && <p className="text-sm text-error-600 mt-1">{errors.weeklyTeachingHours}</p>}
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="Date of Joining"
                        type="date"
                        name="date_of_joining_c"
                        value={formData.date_of_joining_c}
                        onChange={handleChange} />
                    <FormField
                        label="Number of Publications"
                        type="number"
                        name="numberOfPublications"
                        value={formData.number_of_publications_c}
                        onChange={handleChange}
                        placeholder="Enter count"
                        min="0"
                        error={errors.number_of_publications_c} />
                </div>
                <FormField label="Last Promotion Date">
                    <Input
                        type="datetime-local"
                        name="lastPromotionDate"
                        value={formData.last_promotion_date_c}
                        onChange={handleChange} />
                </FormField>
                <FormField label="Reporting Manager">
                    <Select
                        name="reportingManager"
                        value={formData.reporting_manager_c}
                        onChange={handleChange}>
                        <option value="">Select from faculty/staff list</option>
                        {managerOptions.map(manager => <option key={manager} value={manager}>{manager}</option>)}
                    </Select>
                </FormField>
            </div>
            {/* Employment Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Employment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Employment Status">
                        <div className="space-y-2">
                            {["Active", "On Leave", "Retired"].map(status => <label key={status} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="employmentStatus"
                                    value={status}
                                    checked={formData.employment_status_c === status}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-primary-600 focus:ring-primary-500" />
                                <span className="text-sm text-gray-700">{status}</span>
                            </label>)}
                        </div>
                    </FormField>
                    <div className="space-y-4">
                        <FormField label="Is Tenured">
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="isTenured"
                                        value="true"
                                        checked={formData.is_tenured_c === true}
                                        onChange={() => setFormData(prev => ({
                                            ...prev,
                                            is_tenured_c: true
                                        }))}
                                        className="w-4 h-4 text-primary-600 focus:ring-primary-500" />
                                    <span className="text-sm text-gray-700">True</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="isTenured"
                                        value="false"
                                        checked={formData.isTenured === false}
                                        onChange={() => setFormData(prev => ({
                                            ...prev,
                                            isTenured: false
                                        }))}
                                        className="w-4 h-4 text-primary-600 focus:ring-primary-500" />
                                    <span className="text-sm text-gray-700">False</span>
                                </label>
                            </div>
                        </FormField>
                        <FormField label="Background Verified">
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="backgroundVerified"
                                        checked={formData.background_verified_c}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                                    <span className="text-sm text-gray-700">Yes</span>
                                </label>
                            </div>
                        </FormField>
                    </div>
                </div>
                <FormField label="Monthly Salary">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                            <Input
                                type="number"
                                name="monthlySalary.amount"
                                value={formData.monthly_salary_c}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                                step="0.01" />
                        </div>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="INR">INR (₹)</option>
                    </div>
                </FormField>
            </div>
            {/* Additional Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
                <FormField label="Research Interests">
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                value={tempInterest}
                                onChange={e => setTempInterest(e.target.value)}
                                placeholder="Add a research interest"
                                onKeyPress={e => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddInterest();
                                    }
                                }} />
                            <Button type="button" onClick={handleAddInterest} variant="outline">
                                <ApperIcon name="Plus" size={14} />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {interestOptions.map(interest => <button
                                key={interest}
                                type="button"
                                onClick={() => handleMultiSelect("researchInterests", interest)}
                                className={`px-3 py-1 rounded-full text-sm border transition-colors ${formData.research_interests_c.includes(interest) ? "bg-primary-500 text-white border-primary-500" : "bg-white text-gray-700 border-gray-300 hover:border-primary-500"}`}>
                                {interest}
                            </button>)}
                        </div>
                        {formData.research_interests_c.length > 0 && <div className="flex flex-wrap gap-2">
                            {formData.research_interests_c.map((interest, index) => <div
                                key={index}
                                className="flex items-center space-x-1 bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">
                                <span>{interest}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveInterest(interest)}
                                    className="text-primary-600 hover:text-primary-800">
                                    <ApperIcon name="X" size={12} />
                                </button>
                            </div>)}
                        </div>}
                    </div>
                </FormField>
                <FormField
                    label="Faculty Website"
                    type="url"
                    name="faculty_website_c"
                    value={formData.faculty_website_c}
                    onChange={handleChange}
                    placeholder="https://facultyprofile.example.com"
                    error={errors.faculty_website_c} />
                <FormField label="Faculty Rating">
                    {renderRatingStars()}
                </FormField>
            </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>Cancel
                          </Button>
            <Button type="submit">
                {editFaculty ? "Update Faculty" : "Add Faculty"}
            </Button>
        </div>
    </form>
</Modal>
  );
};

export default FacultyModal;