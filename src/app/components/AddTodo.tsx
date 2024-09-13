'use client';
import { NewTodo } from '@/lib/drizzle';
import { useRouter } from 'next/navigation';
import React, { FormEventHandler, useState } from 'react'
import { BiSend } from "react-icons/bi";


const AddTodo = () => {

   // type NewTodo is used to insert data
    const[todo ,setTodo]= useState<NewTodo | null>(null)
    const router= useRouter()
    const handleSubmit:FormEventHandler<HTMLFormElement> =async(e)=>{

         try {
          if(todo){
             const res= await fetch("/api/todo",{
              method: "POST",
              headers:{
              'Content-Type': 'application/json'
              },
              body: JSON.stringify({task:todo.task})
             }
             )
             e.preventDefault();
            router.refresh()
          }
         } catch (error) {
           console.log((error as{message:string}).message)
         }
    }
  return (
    <div >
      <form onSubmit={handleSubmit} className=' w-full flex gap-x-2'>
        <input
        onChange={(e)=> setTodo({task:e.target.value})}
        type="text" placeholder='Add a new task'
         className=' w-full px-3 py-3 rounded-full focus:outline-secondary border'
        />
        <button 
        type='submit' title='send' className=' text-slate-800'>
         <BiSend className=' h-10 w-9'/>  
        </button>
      </form>
    </div>
  )
}

export default AddTodo