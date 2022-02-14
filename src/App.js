import Header from "./Components/Header";
import Footer from "./Components/Footer";
import About from "./Components/About";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Tasks from "./Components/Tasks";
import { useState, useEffect } from 'react'
import AddTask from "./Components/AddTask";

function App() {

  const [showAddTask, setShowAddTask] = useState(false)

  const [tasks, setTasks] = useState([])

  //useEffect is a hook that is called when the page is loaded
  //we are fetching tasks from db.json file which is stored on json server 
  //json server is acting as a backend service in our case
  useEffect(() => {

    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    return data;
  }

  //fetch task for showing toggled task to server
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    return data;
  }

  //add task
  const addTask = async (task) => {
    // console.log(task);
    //an id is required to store the task since we're not using backend
    // const id = Math.floor(Math.random() * 10000) + 1
    // console.log(id);

    // const newTask = { id, ...task }
    // setTasks([...tasks, newTask])

    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    const data = await res.json();
    setTasks([...tasks, data])
  }

  //delete task
  const deleteTask = async (id) => {
    // console.log('deleted', id);

    //for deleting a particular task, we'll first fetch it from the backend i.e json server
    //and then delete method is invoked on that task id
    await fetch(`http://localhost:5000/tasks/${id}`,
      {
        method: 'DELETE'
      })


    setTasks(tasks.filter((task) => task.id !== id))
  }

  //toggle reminder
  const toggleRminder = async (id) => {

    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }
    // console.log(id);
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updTask),
    })

    const data = await res.json()

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    )
  }

  return (
    <Router>
      <div className="container">
        <Header title="Task Tracker" onAdd={() => setShowAddTask(!showAddTask)}
          showAdd={showAddTask}
        />

        <Routes>
          <Route
            path='/'
            element={
              <>
                {showAddTask && <AddTask onAdd={addTask} />}
                {tasks.length > 0 ? (
                  <Tasks
                    tasks={tasks}
                    onDelete={deleteTask}
                    onToggle={toggleRminder}
                  />
                ) : (
                  'No Tasks To Show'
                )}
              </>
            }
          />
          <Route path='/about' element={<About />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
