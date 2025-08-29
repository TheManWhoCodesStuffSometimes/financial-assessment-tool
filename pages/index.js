import { useState } from 'react';
import Link from 'next/link';
import Dashboard from '../components/Dashboard';

export default function Home() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                IronForge
              </h1>
              <span className="ml-2 text-sm text-gray-500 font-medium">Automations</span>
            </div>
            <div className="flex space-x-2">
              <Link href="/" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                Dashboard
              </Link>
              <Link href="/calendar" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all duration-200">
                Calendar
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-16">
        <Dashboard />
      </div>
    </>
  );
}
