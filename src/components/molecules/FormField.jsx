import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import TextArea from "@/components/atoms/TextArea";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  required = false,
  className,
  children,
  ...props 
}) => {
const renderInput = () => {
    if (children) return children;
    
    switch (type) {
      case "select":
        return <Select error={error} {...props} />;
      case "textarea":
        return <TextArea error={error} {...props} />;
      case "range":
      case "rating":
      case "tags":
      case "currency":
      case "checkbox":
case "radio":
        const Radio = React.lazy(() => import("@/components/atoms/Radio"));
        return <Radio error={error} {...props} />;
      case "phone":
      case "website":
      case "datetime-local":
        return children;
      default:
        return <Input type={type} error={error} {...props} />;
    }
  };

  return (
    <div className={cn("space-y-1", className)}>
      {label && <Label required={required}>{label}</Label>}
      {renderInput()}
      {error && (
        <p className="text-sm text-error-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;