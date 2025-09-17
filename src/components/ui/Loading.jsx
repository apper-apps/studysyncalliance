import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, type = "cards" }) => {
  const CardSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4 mb-2"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 mb-3"></div>
          <div className="flex space-x-4">
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
          </div>
        </div>
        <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex space-x-3">
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
          <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
        </div>
        <div className="text-right">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12 mb-1"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  const ListSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
            <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/3"></div>
          </div>
          <div className="ml-8 space-y-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
              </div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-14"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );

  const DashboardSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
            </div>
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4 mb-2"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
                </div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2 mb-4"></div>
          <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  );

  const skeletonTypes = {
    cards: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
      </div>
    ),
    list: () => (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => <ListSkeleton key={i} />)}
      </div>
    ),
    dashboard: DashboardSkeleton
  };

  return (
    <div className={cn("animate-pulse-slow", className)}>
      {skeletonTypes[type]()}
    </div>
  );
};

export default Loading;