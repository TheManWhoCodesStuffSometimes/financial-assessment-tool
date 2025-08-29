import { useState } from 'react';
import Link from 'next/link';
import Dashboard from '../components/Dashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">IronForge Automations</h1>
              <span className="ml-2 text-sm text-gray-500">Financial Dashboard</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/calendar" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium">
                Calendar
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Dashboard />
      </main>
    </div>
  );
}
