'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Todo } from '@/lib/drizzle';
import React, { useState, useEffect } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Fetching todos from the server
const getData = async () => {
  try {
    const res = await fetch('/api/todo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache', // Ensures fresh data is fetched
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const result = await res.json();
    return result;
  } catch (error) {
    console.log('Error fetching todos:', error);
    return { data: [] }; // Return an empty array on error
  }
};

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch data when component mounts
  useEffect(() => {
    const fetchTodos = async () => {
      const result = await getData();
      setTodos(result.data);
      setLoading(false); // Data has been fetched, stop loading
    };
    fetchTodos();
  }, []);

  // Function to handle delete
  const handleDeleteTodo = async (id: number) => {
    try {
      const res = await fetch('/api/todo', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        // Remove the deleted todo from state
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      } else {
        console.error('Failed to delete todo');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Limit todos to a maximum of 5
  const displayedTodos = todos.slice(0, 5);

  return (
    <>
      {loading ? (
        // Render skeleton loader while loading
        <div className="space-y-4 mb-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className='px-4 py-4 rounded-lg bg-gray-200 flex items-center gap-x-3 my-4'>
              <Skeleton height={20} width={400} />
            </div>
          ))}
        </div>
      ) : (
        <>
        {/* If todos exceeds more than 5 tasks then render this message that it can desplay only 5 tasks */}
          {todos.length > 5 && (
            <p className="text-red-500 mb-4">Cannot add more tasks. Displaying first 5 tasks only.</p>
          )}
          {displayedTodos.map((item) => (
            <div
              key={item.id}
              className='px-4 py-4 rounded-lg bg-gray-200 flex items-center justify-between gap-x-3 my-4'
            >
              <div className="flex items-center gap-x-3">
                {/* Circle */}
                <div className=' bg-slate-800 h-3 w-3 rounded-full'></div>
                {/* Task Title */}
                <p className=" font-medium text-lg">{item.task}</p>
              </div>
              {/* Delete Confirmation Dialog */}
              <AlertDialog>
                <AlertDialogTrigger>
                  <RiDeleteBin6Line className='text-red-600 cursor-pointer h-6 w-6 ml-auto' />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your task.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction onClick={() => handleDeleteTodo(item.id)}>
                      Yes
                    </AlertDialogAction>
                    <AlertDialogCancel>No</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default TodoList;
