const { Lesson, Comment, Roadmap, LearningPath } = require('../models')

const commentLesson = async (lessonId, userId, content, parent = '') => {
  let newComment = new Comment({ userId, content })
  if (parent !== '') {
    newComment = new Comment({ userId, content, parent })
  }
  const createdComment = await newComment.save()
  await Lesson.findByIdAndUpdate(lessonId, { $addToSet: { comments: createdComment._id } })
  return createdComment
}

const commentRoadmap = async (roadmapId, userId, content, parent = '') => {
  let newComment = new Comment({ userId, content })
  if (parent !== '') {
    newComment = new Comment({ userId, content, parent })
  }
  const createdComment = await newComment.save()
  await Roadmap.findOneAndUpdate({ id: roadmapId }, { $addToSet: { comments: createdComment._id } })
  return createdComment
}

const commentCourse = async (courseId, userId, content, parent = '') => {
  let newComment = new Comment({ userId, content })
  if (parent !== '') {
    newComment = new Comment({ userId, content, parent })
  }
  const createdComment = await newComment.save()
  await LearningPath.findOneAndUpdate(
    { id: courseId },
    { $addToSet: { comments: createdComment._id } }
  )
  return createdComment
}

const editComment = async (commentId, content) => {
  return await Comment.findByIdAndUpdate(commentId, { content }, { new: true })
}

const deleteComment = async (lessonId, commentId) => {
  await Promise.all([
    Comment.findByIdAndDelete(commentId),
    Lesson.findByIdAndUpdate(lessonId, { $pull: { comments: commentId } })
  ])
}

const getComments = async (commentIds) => {
  if (!commentIds || commentIds.length === 0) return []
  const comments = await Comment.find({ _id: { $in: commentIds } })
    .populate('parent')
    .populate({
      path: 'userId',
      select: '_id name avatar'
    })
  return comments
}

module.exports = {
  commentLesson,
  commentRoadmap,
  commentCourse,
  editComment,
  deleteComment,
  getComments
}
