import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Input } from 'antd';
import { db } from "./firebase/firebase"
import { collection, addDoc, onSnapshot, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import './App.scss';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
function App() {
  const { TextArea } = Input;
  // collect input
  const [title, setTitle] = useState();
  const [decpriction, setDecpriction] = useState();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [todos, setTodos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState('');

  const handleOk = async (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    if (title !== "" && decpriction !== "") {
      if (isEditing) {
        try {
          await updateDoc(doc(db, "todos", editId), { title, decpriction });
        } catch (error) {
          console.error("Error updating document: ", error);
        }
      } else {
        const todo = {
          title,
          decpriction,
          id: Math.random().toString(36).substr(2, 9), // Generate random ID
          createdAt: serverTimestamp() // Add current timestamp
        };
        await addDoc(collection(db, "todos"), todo);
      }
      setTitle('');
      setDecpriction('');
      setEditId('');
      setIsEditing(false);
    }
  };
  const handleEdit = (todo) => {
    showModal(true);
    setIsEditing(true);
    setTitle(todo.title);
    setDecpriction(todo.decpriction);
    setEditId(todo.id);
  };

  // output
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
      const todoList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setTodos(todoList);
    });
    return () => unsubscribe();
  }, []);
  // delet
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setTitle('');
    setDecpriction('');
    setEditId('');
  };

  return (
    <>
      <main>
        <div>
          <div className="col">
            <div className="row">
              <div className="todoApp">
                <h6 className='mt-2'>{formatDate(currentDateTime)} ( {currentDateTime.toLocaleTimeString()} )</h6>
                <h2 className='mt-4'>TO-DO LIST</h2>
                <button className='btn btn-primary mb-2' onClick={showModal}>ADD TODO</button>
                <div className="todos">
                  {todos.map((todo, index) => (
                    <div className='todo' key={index}>
                      <div className="todo-card">
                        <h2>{todo.title}
                          <hr /></h2>
                        <p>{todo.decpriction}</p>
                      </div>
                      <div className="buttons">
                        <button onClick={() => handleDelete(todo.id)}><DeleteFilled style={{ fontSize: '24px', color: 'red' }} /></button>
                        <button onClick={() => handleEdit(todo)}><EditFilled style={{ fontSize: '24px', color: 'blue' }} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Modal title={isEditing ? "Edit Todo" : "Add Todo"} visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <form action="">
          <Input value={title} onChange={(e) => { setTitle(e.target.value) }} size="large" placeholder="TITLE" />
          <TextArea value={decpriction} onChange={(e) => { setDecpriction(e.target.value) }} id='textAreae' margin-top="10px" rows={4} placeholder="DECRIPTION" />
        </form>
      </Modal>
    </>
  );
}

export default App;
