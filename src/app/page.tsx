"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, PlusCircle, BarChart3 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <>
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-10 pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Expense Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            The simple way to manage your personal finances
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={() => router.push("/AddTransaction")}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white text-lg font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:cursor-pointer"
            >
              <PlusCircle size={24} />
              Add Transaction
            </button>

            <button
              onClick={() => router.push("/Expenses")}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-indigo-600 border border-indigo-200 text-lg font-medium rounded-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:cursor-pointer"
            >
              <BarChart3 size={24} />
              View Expenses
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 hover:bg-white hover:shadow-lg rounded-xl transition-all">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Track Expenses
            </h3>
            <p className="text-gray-600">
              Easily record and categorize all your daily spending in one place.
            </p>
          </div>

          <div className="p-6 hover:bg-white hover:shadow-lg rounded-xl transition-all">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Analyze Spending
            </h3>
            <p className="text-gray-600">
              Get insights into your spending habits with visual reports and
              trends.
            </p>
          </div>

          <div className="p-6 hover:bg-white hover:shadow-lg rounded-xl transition-all">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Set Budgets
            </h3>
            <p className="text-gray-600">
              Create budgets for different categories and track your progress.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8 mt-12">
        <p className="text-center text-gray-500 text-sm">
          Take control of your finances and build better spending habits
        </p>
      </div>
    </>
  );
}
