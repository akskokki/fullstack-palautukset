import { createSlice } from '@reduxjs/toolkit'

import blogService from '../services/blogs'
import { notify } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    removeBlog(state, action) {
      const id = action.payload
      return state.filter((b) => b.id !== id)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map((b) => (b.id !== updatedBlog.id ? b : updatedBlog))
    },
  },
})

const { setBlogs, appendBlog, removeBlog, updateBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (title, author, url) => {
  return async (dispatch) => {
    try {
      const blogObject = {
        title,
        author,
        url,
        likes: 0,
      }
      const returnedBlog = await blogService.create(blogObject)
      dispatch(appendBlog(returnedBlog))
      dispatch(
        notify(
          `blog ${returnedBlog.title} by ${returnedBlog.author} added!`,
          'success'
        )
      )
    } catch {
      dispatch(notify('blog creation failed', 'error'))
    }
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch(removeBlog(id))
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }
    const returnedBlog = await blogService.update(updatedBlog)
    dispatch(updateBlog(returnedBlog))
  }
}

export const commentBlog = (blog, comment) => {
  return async (dispatch) => {
    const updatedBlog = {
      ...blog,
      comments: blog.comments.concat(comment),
      user: blog.user.id,
    }
    const returnedBlog = await blogService.update(updatedBlog)
    dispatch(updateBlog(returnedBlog))
  }
}

export default blogSlice.reducer
