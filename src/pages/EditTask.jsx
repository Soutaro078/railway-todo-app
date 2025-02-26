import React, { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { url } from '../const'
import { useNavigate, useParams } from 'react-router-dom'
import './editTask.scss'

export const EditTask = () => {
  const navigate = useNavigate()
  const { listId, taskId } = useParams()
  const [cookies] = useCookies()
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [limit, setLimit] = useState('')//期限を保管する変数の追加
  const [isDone, setIsDone] = useState()
  const [errorMessage, setErrorMessage] = useState('')
  const handleTitleChange = (e) => setTitle(e.target.value)
  const handleDetailChange = (e) => setDetail(e.target.value)
  const handleIsDoneChange = (e) => setIsDone(e.target.value === 'done')
  const handleLimitChange = (e) => {
    console.log("ユーザーが選択した日時:", e.target.value); // デバッグ用
    setLimit(e.target.value); // そのまま保存（変換しない）
  };
  
  const onUpdateTask = () => {

    const localDate = new Date(limit); // 入力値を Date オブジェクトに変換

    // `YYYY-MM-DDTHH:MM:SSZ` 形式に変換
    const formattedLimit = localDate.toISOString().slice(0, 19) + "Z";
    
    console.log("送信データ:", {
      title,
      detail,
      done: isDone,
      limit: formattedLimit,
    });

    const data = {
      title: title,
      detail: detail,
      done: isDone,
      limit: formattedLimit, // PUTリクエスト用に変換
    };

    axios
      .put(`${url}/lists/${listId}/tasks/${taskId}`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        console.log(res.data)
        navigate('/')
      })
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。${err}`)
      })
  }

  const onDeleteTask = () => {
    axios
      .delete(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/')
      })
      .catch((err) => {
        setErrorMessage(`削除に失敗しました。${err}`)
      })
  }

  useEffect(() => {
    axios
      .get(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        const task = res.data
        setTitle(task.title)
        setDetail(task.detail)
        setIsDone(task.done)

        // limitが "YYYY-MM-DDTHH:MM:SSZ" なので "YYYY-MM-DDTHH:MM" に変換
        if (task.limit) {
          const utcDate = new Date(task.limit); // 取得した limit を UTC の Date オブジェクトに変換
          utcDate.setHours(utcDate.getHours() + 9); // 9時間足して日本時間に変換
          const formattedLimit = utcDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM" に変換
          setLimit(formattedLimit);
        } else {
          setLimit("");
        }
  
      })
      .catch((err) => {
        setErrorMessage(`タスク情報の取得に失敗しました。${err}`)
      })
  }, [])

  return (
    <div>
      <Header />
      <main className="edit-task">
        <h2>タスク編集</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-task-form">
          <label>タイトル</label>
          <br />
          <input
            type="text"
            onChange={handleTitleChange}
            className="edit-task-title"
            value={title}
          />
          <br />
          <label>詳細</label>
          <br />
          <textarea
            type="text"
            onChange={handleDetailChange}
            className="edit-task-detail"
            value={detail}
          />
          <br />
          <label>期限日時</label>
          <br />
          <input
            type="datetime-local"
            onChange={handleLimitChange}
            className="edit-task-limit"
            value={limit}
          />
          <div>
            <input
              type="radio"
              id="todo"
              name="status"
              value="todo"
              onChange={handleIsDoneChange}
              checked={isDone === false ? 'checked' : ''}
            />
            未完了
            <input
              type="radio"
              id="done"
              name="status"
              value="done"
              onChange={handleIsDoneChange}
              checked={isDone === true ? 'checked' : ''}
            />
            完了
          </div>
          <button
            type="button"
            className="delete-task-button"
            onClick={onDeleteTask}
          >
            削除
          </button>
          <button
            type="button"
            className="edit-task-button"
            onClick={onUpdateTask}
          >
            更新
          </button>
        </form>
      </main>
    </div>
  )
}
