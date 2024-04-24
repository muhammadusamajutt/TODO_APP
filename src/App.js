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
  const [editingTodo, setEditingTodo] = useState(null);

  const handleOk = async (e) => {
    e.preventDefault();
    if (title !== "" && decpriction !== "") {
      const todo = {
        title,
        decpriction,
        id: Math.random().toString(36).substr(2, 9), // Generate random ID
        createdAt: serverTimestamp() // Add current timestamp
      };
      await addDoc(collection(db, "todos"), todo);
      setTitle("");
      setDecpriction("");
      setIsModalOpen(false);
    }
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
  // edit
  const handleEdit = (todo) => {
    setIsModalOpen(true);
    setTitle(todo.title);
    setDecpriction(todo.decpriction);
    setEditingTodo(todo);
    showModal();
  };

  const updateTodo = async () => {
    try {
      const todoRef = doc(db, "todos", editingTodo.id);
      await updateDoc(todoRef, {
        title,
        decpriction
      });
      setEditingTodo(null); // Reset editingTodo state
    } catch (error) {
      console.error("Error updating document: ", error);
    }
    setIsModalOpen(false);
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
  };

  return (
    <>
      {/* <div>
      <h1>Date: {formatDate(currentDateTime)}</h1>
      <h2>Day: {currentDateTime.toLocaleDateString('en-US', { weekday: 'long' })}</h2>
      <h2>Month: {currentDateTime.toLocaleDateString('en-US', { month: 'long' })}</h2>
      <h2>Year: {currentDateTime.getFullYear()}</h2>
      <h2>Time: {currentDateTime.toLocaleTimeString()}</h2>
    </div> */}
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
                        <button><EditFilled onClick={() => handleEdit(todo)} style={{ fontSize: '24px', color: 'blue' }} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Input value={title} onChange={(e) => { setTitle(e.target.value) }} size="large" placeholder="TITLE" />
        <TextArea value={decpriction} onChange={(e) => { setDecpriction(e.target.value) }} id='textAreae' margin-top="10px" rows={4} placeholder="DECRIPTION" />
      </Modal>
      <Modal title="Basic Modal" open={isModalOpen} onOk={updateTodo} onCancel={handleCancel}>
        <Input value={title} onChange={(e) => { setTitle(e.target.value) }} size="large" placeholder="TITLE" />
        <TextArea value={decpriction} onChange={(e) => { setDecpriction(e.target.value) }} id='textAreae' margin-top="10px" rows={4} placeholder="DECRIPTION" />
      </Modal>
    </>
  );
}

export default App;
