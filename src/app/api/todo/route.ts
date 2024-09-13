 
import { NextRequest, NextResponse } from "next/server";
import {  todoTable, db } from '@/lib/drizzle'
import {sql} from '@vercel/postgres'
import { eq } from 'drizzle-orm';

export async function GET(request:NextRequest){

    try {
        await sql`CREATE TABLE IF NOT EXISTS Todos(id serial, Task varchar(255))`
        const res = await db.select().from(todoTable).orderBy(todoTable.id);
        console.log(res)
        return NextResponse.json({data:res})
    } 
    catch (error) {
        console.log((error as {message:string}).message)
        return NextResponse.json({message:"Something went wrong"})
    }
}
export async function POST(request: NextRequest){
 
    const req= await request.json();
    try {
        if(req.task){
            const res= db.insert(todoTable).values({
                task: req.task
            }).execute();
            console.log(res)
            return NextResponse.json({message:"Data added successfully"})
        }
        else{
            throw new Error("Task field is required")
        }
    } 
    catch (error) { 
        return NextResponse.json({message:(error as {message:string}).message})
    }
}

export async function PUT(request:NextRequest){
    const req= await request.json();

    try {
        if(req.id){
            const updateTask= await db.update(todoTable)
            .set({task:req.task})
            .where(eq(req.id,todoTable.id))
            .execute({task:todoTable.task, id:todoTable.id})

            return NextResponse.json({taskUpdate:updateTask})
        }
        else{
            throw new Error("Task is not updated")
        }
    } 
    catch (error) {
        return NextResponse.json({message:(error as {message:string}).message})
    }
}

export async function DELETE(request: NextRequest) {
    const req = await request.json();
  
    try {
      if (req.id) {
        // Execute the delete operation
        const deleteResult = await db
          .delete(todoTable)
          .where(eq(todoTable.id, req.id))
          .returning(); // Use returning() to get information about the deleted rows
  
        // Check if any rows were deleted
        if (deleteResult.length === 0) {
          return NextResponse.json({ message: "No task found with the given ID" });
        }
        return NextResponse.json({ message: "Id deleted successfully" });
      }
       else {
        throw new Error("Id required");
      }
    } 
    catch (error) {
      return NextResponse.json({ message: (error as { message: string }).message });
    }
  }
  