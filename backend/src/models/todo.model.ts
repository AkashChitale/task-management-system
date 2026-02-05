import { Document } from "mongoose";
import mongoose from "mongoose";

interface ITodo extends Document {
  title: string;
  description?: string;
  completed: boolean;
  userId: mongoose.Schema.Types.ObjectId | string;   
}

const todoSchema = new mongoose.Schema<ITodo>({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    completed: { 
        type : Boolean, 
        default: false 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
});

const Todo = mongoose.model<ITodo>("Todo", todoSchema);

export default Todo;

export { ITodo };