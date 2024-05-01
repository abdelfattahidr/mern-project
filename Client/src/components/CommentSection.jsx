import { Alert, Button, Textarea } from 'flowbite-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
export default function CommentSection({ postId }) {
     const { currentUser } = useSelector(state => state.user)
     const [comment, setComment] = useState('')
     const [commentError, setCommentError] = useState(null)
     const handleSubmit = async (e) => {
          e.preventDefault()
          if (comment.length > 200) {
               return
          }
          try {
               const res = await fetch('/api/comment/create', {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content: comment, postId, userId: currentUser._id })
               })
               const data = await res.json()
               if (res.ok) {
                    setComment('')
                    setCommentError(null)
               }
          } catch (error) {
               setCommentError(error.message)
          }
     }
     return (
          <div className='max-w-2xl mx-auto w-full p-3'>
               {currentUser ?
                    (
                         <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                              <p>Signed in as :</p>
                              <img className='w-5 h-5 object-cover rounded-full' src={currentUser.profilePicture} alt={currentUser.username} />
                              <Link to='/dashboard?tab=profile' className='text-sx text-cyan-600 hover:underline'>
                                   @{currentUser.username}
                              </Link>
                         </div>
                    ) :
                    (
                         <div className='my-5 text-teal-500 text-sm text-center'>
                              You must be Signed in to comment
                              <Link to='/sign-in' className='text-blue-600 hover:underline ml-2 dark:text-red-600'>
                                   Sign In
                              </Link>
                         </div>
                    )}
               {currentUser && (
                    <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
                         <Textarea
                              rows="3"
                              maxLength={200}
                              id="comment"
                              placeholder="Write a comment..."
                              value={comment}
                              onChange={e => setComment(e.target.value)}
                         />
                         <div className='flex justify-between items-center mt-5'>
                              <p className='text-gray-500 text-sx'>{200 - comment.length} characters remaining</p>
                              <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                                   submit
                              </Button>
                         </div>
                         {commentError && <Alert color="failure" className='mt-5'>
                              {commentError}
                         </Alert>}
                    </form>
               )}
          </div>
     )
}