import Head from 'next/head'
import { useForm } from "@mantine/hooks";
import useTrans from './hooks/useTrans'
import { InferGetServerSidePropsType } from 'next';
import { useState } from 'react';

export interface Todo {
  id: number;
  todo: string;
  done: boolean;
}

export const ENDPOINT = "http://localhost:4000";

function App(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {res} =props
  const [data, setData] = useState(res)
  const trans = useTrans()
  const form = useForm({
    initialValues: {
      todo: "",
    },
  });

  async function createTodo(values: { todo: string }) {
    const updated = await fetch(`${ENDPOINT}/api/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((r) => r.json());

    setData(updated);
    form.reset();
  }
  async function PutTodo(id: number) {
    const updated = await fetch(`${ENDPOINT}/api/todos/${id}/done`, {
      method: "PUT",
    }).then((r) => r.json());

    setData(updated);
  }
  async function deleteTodo(id: number) {
    const updated = await fetch(`${ENDPOINT}/api/todos/${id}`, {
      method: "DELETE",
    }).then((r) => r.json());
    setData(updated);
  }
  return (
    <>
      <Head>
        <title>{trans.todo.title}</title>
      </Head>
      <main>
        <form onSubmit={form.onSubmit(createTodo)}> &emsp;
          <label>{trans.todo.body}</label> &emsp;
          <input required {...form.getInputProps("todo")} /> &emsp;
          <button type="submit">{trans.todo.bnt}</button>
        </form>

        <ul >
          {data?.map((todo: any) => {
            return (
              <li key={`todo_list__${todo.id}`}>
                <span onClick={() => PutTodo(todo.id)}>
                  {
                    todo.done ? <>{trans.todo.yes}</> : <>{trans.todo.no}</>
                  }
                </span> &emsp;
                {todo.todo}&emsp;
                <span onClick={() => deleteTodo(todo.id)} key={`todo_list__${todo.id}`}>{trans.todo.delete}
                </span>
              </li>
            )
          })}
        </ul>
      </main>
    </>
  );
}
export async function getServerSideProps() {
  const res = await fetch ("http://localhost:4000/api/todos").then((r) => r.json())
  return { props: {res } }
}
export default App;