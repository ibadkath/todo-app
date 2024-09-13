'use client'
import React, { useState, useEffect } from "react";
import TodoList from "./components/TodoList";
import AddTodo from "./components/AddTodo";
export default function Home() {

  // Simulate data fetching or other async operations for the app
  return (
    <main className="bg-slate-800 h-screen flex justify-center items-center">
      <div className="px-3 py-4 bg-slate-400 w-full max-w-md rounded-xl">
      
            <TodoList />            
            <AddTodo />
      </div>
    </main>
  );
}
