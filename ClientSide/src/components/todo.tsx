import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu, Button, Input } from "antd";

const { Header, Sider, Content} = Layout;

type Todo = {
  todoId: string;
  title: string;
  username: string;
  done: boolean;
};

export function Todo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [updatedTaskTitle, setUpdatedTaskTitle] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [editModeId, setEditModeId] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState<boolean>(false);
  const location = useLocation();
  const username = location.state.username;
  const [collapsed, setCollapsed] = useState(false);


  useEffect(() => {
    fetchTodos();
  }, [fetchTrigger]);

  const fetchTodos = async () => {
    try {
      // Make API call to fetch todos for the signed-in user
      const response = await axios.get(
        `https://xr2tx2mgwj.us-east-1.awsapprunner.com/todos?username=${username}`
      );
      console.log(response.data);
      if (response.data) {
        setTodos(response.data);
      } else {
        setTodos([]);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleTaskAdd = async () => {
    try {
      // Make API call to add a new task
      const response = await axios.post(
        `https://xr2tx2mgwj.us-east-1.awsapprunner.com/todos`,
        {
          title: newTaskTitle,
          username: username,
          done: false,
        }
      );
      console.log(response.data);
      setNewTaskTitle("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
    setFetchTrigger(!fetchTrigger);
  };

  const handleDeleteTask = async (todoId: string) => {
    try {
      // Make API call to delete a task
      const response = await axios.post(
        `https://xr2tx2mgwj.us-east-1.awsapprunner.com/delete?todoId=${todoId}`
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
    setFetchTrigger(!fetchTrigger);
  };

  const handleMarkDone = async (todoId: string) => {
    try {
      // Make API call to mark a task as done
      const response = await axios.post(
        `https://xr2tx2mgwj.us-east-1.awsapprunner.com/markdone?todoId=${todoId}`
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error marking task as done:", error);
    }
    setFetchTrigger(!fetchTrigger);
  };
  const handleMarkUndone = async (todoId: string) => {
    try {
      // Make API call to mark a task as undone
      const response = await axios.post(
        `https://xr2tx2mgwj.us-east-1.awsapprunner.com/markUndone?todoId=${todoId}`
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error marking task as undone:", error);
    }
    setFetchTrigger(!fetchTrigger);
  };

  const handleUpdateTask = async (todoId: string, updatedTaskTitle: string) => {
    try {
      // Make API call to update the title of a task
      const response = await axios.post(
        `https://xr2tx2mgwj.us-east-1.awsapprunner.com/update`,
        {
          todoId: todoId,
          title: updatedTaskTitle,
        }
      );
      console.log(response.data);
      setEditModeId(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
    setFetchTrigger(!fetchTrigger);
  };
  const handleMenuSelect = ({ key }: { key: string }) => {
    setFilter(key); // Update filter state based on menu selection
  };
  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") {
      return true; // Show all todos
    } else if (filter === "done") {
      return todo.done; // Show only completed todos
    } else {
      return !todo.done; // Show only incomplete todos
    }
  });

  return (
    <>
      <Layout>
        <Sider collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onSelect={handleMenuSelect} >
            <Menu.Item key="all">All Tasks</Menu.Item>
            <Menu.Item key="done">Completed Tasks</Menu.Item>
            <Menu.Item key="undone">Incompleted Tasks</Menu.Item>
          </Menu>
        </Sider>
        

        <Layout className="main-layout">
          <Header className="main-header">
          <Button
              className="collapse-button"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
          />
          </Header>
          <Content className="main-content">
            
            <div className="container">
              <h1>Todo List</h1>

              <Input
                className="add-input"
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Title" />
              <Button className="add-button" onClick={handleTaskAdd}>
                Add
              </Button>

              {filteredTodos.length === 0 ? (
                <p>No todos found</p>
              ) : (
                <>
                  {/* Display filtered todos */}
                  <div className="todo">
                    {filteredTodos.map((todo: Todo) => (
                      <div className="card" key={todo.todoId}>
                        {editModeId === todo.todoId ? (
                          <>
                            <Input
                              type="text"
                              className="edit-input"
                              placeholder={todo.title}
                              value={updatedTaskTitle}
                              onChange={(e) => setUpdatedTaskTitle(e.target.value)} />
                            <p>Assignee: {todo.username}</p>
                            <p>Status: {todo.done ? "Done" : "Not Done"}</p>
                            <Button className="list-btn" onClick={() => setEditModeId(null)}>Cancel</Button>
                            <Button className="list-btn"
                              onClick={() => handleUpdateTask(todo.todoId, updatedTaskTitle)}
                            >
                              Save
                            </Button>
                          </>
                        ) : (
                          <>
                            <h3>{todo.title}</h3>
                            <p>Assignee: {todo.username}</p>
                            <p>Status: {todo.done ? "Done" : "Not Done"}</p>
                            <Button className="list-btn" onClick={() => handleDeleteTask(todo.todoId)}>
                              Delete
                            </Button>
                            {!todo.done && (
                              <Button className="list-btn" onClick={() => handleMarkDone(todo.todoId)}>
                                Mark as done
                              </Button>
                            )}
                            {todo.done && (
                              <Button className="list-btn" onClick={() => handleMarkUndone(todo.todoId)}>
                                Mark as undone
                              </Button>
                            )}
                            <Button className="list-btn" onClick={() => setEditModeId(todo.todoId)}>
                              Edit
                            </Button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>


          </Content>
        </Layout>
      </Layout>
    </>
  );
}
