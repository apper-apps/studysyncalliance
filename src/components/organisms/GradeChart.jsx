import React from "react";
import Chart from "react-apexcharts";
import Card from "@/components/atoms/Card";

const GradeChart = ({ courses, assignments }) => {
  const chartData = courses.map(course => {
    const courseAssignments = assignments.filter(
      assignment => assignment.courseId === course.Id && assignment.grade
    );
    
    const averageGrade = courseAssignments.length > 0
      ? courseAssignments.reduce((sum, assignment) => sum + assignment.grade, 0) / courseAssignments.length
      : 0;
    
    return {
      course: course.code,
      grade: Math.round(averageGrade),
      color: course.color
    };
  }).filter(item => item.grade > 0);

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif"
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        horizontal: false,
        columnWidth: "60%"
      }
    },
    colors: chartData.map(item => item.color),
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontWeight: 600
      },
      formatter: (val) => `${val}%`
    },
    xaxis: {
      categories: chartData.map(item => item.course),
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 500
        }
      }
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: {
          fontSize: "12px"
        },
        formatter: (val) => `${val}%`
      }
    },
    grid: {
      borderColor: "#f3f4f6",
      strokeDashArray: 3
    },
    tooltip: {
      style: {
        fontSize: "12px"
      },
      y: {
        formatter: (val) => `${val}%`
      }
    }
  };

  const series = [{
    name: "Average Grade",
    data: chartData.map(item => item.grade)
  }];

  if (chartData.length === 0) {
    return (
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">Grade Overview</h3>
        </Card.Header>
        <Card.Content>
          <div className="text-center py-8">
            <p className="text-gray-500">No grades available yet</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-semibold text-gray-900">Grade Overview</h3>
        <p className="text-sm text-gray-500">Average grades by course</p>
      </Card.Header>
      <Card.Content>
        <Chart
          options={options}
          series={series}
          type="bar"
          height={300}
        />
      </Card.Content>
    </Card>
  );
};

export default GradeChart;