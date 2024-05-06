import React, { useRef, useState } from 'react'
import '../login/login.css'
import { Link, useNavigate } from 'react-router-dom'
import {auth,storage,db} from '../../firebase'
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore'

const Register = () => {
  const fileInputRef = useRef(null)
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [file,setFile] = useState(null)
  const [displayName,setDisplayName] = useState('')
  const [imageUrl,setImageUrl] = useState(null)
  const [isLoading,setLoading] = useState(false)

  const navigate = useNavigate()

  const onSelectFile = (e)=>{
    setFile(e.target.files[0])
    setImageUrl(URL.createObjectURL(e.target.files[0]))
  }

  const submitHandler = (e)=>{
    e.preventDefault()
    setLoading(true)
    console.log(email,password)
    
    createUserWithEmailAndPassword(auth,email,password)
    .then(newUser=>{
      console.log(newUser)
      const date = new Date().getTime()
      const storageRef = ref(storage,`${displayName + date}`)
      uploadBytesResumable(storageRef,file)
      .then(res=>{
        console.log(res)
        getDownloadURL(storageRef)
        .then(downloadedUrl=>{
          console.log(downloadedUrl)

          updateProfile(newUser.user,{
            displayName:displayName,
            photoURL:downloadedUrl
          })

          setDoc(doc(db,"users",newUser.user.uid),{
            uid:newUser.user.uid,
            displayName:displayName,
            email:email,
            photoURL:downloadedUrl
          })
          navigate('/dashboard')
          setLoading(false)
          localStorage.setItem('cName',displayName)
          localStorage.setItem('photoURL',downloadedUrl)
          localStorage.setItem('email',newUser.user.email)
          localStorage.setItem('uid',newUser.user.uid)

        })
      })
      .catch(error=>{
        console.log(error)
      })
    })
    .catch(err=>{
      setLoading(false)
      console.log(err)
    })
  }
  return (
    <div className='login-wrapper'>
        <div className='login-container'>
            <div className='login-boxes login-left'>

            </div>
            <div className='login-boxes login-right'>
                <h2 className='login-heading'>Create Your Account</h2>
                <form onSubmit={submitHandler}>
                    <input required  onChange={(e)=>{setEmail(e.target.value)}} className='login-input' type='text' placeholder='Email' />
                    <input required onChange={(e)=>{setDisplayName(e.target.value)}} className='login-input' type='text' placeholder='Company Name' />
                    <input required onChange={(e)=>{setPassword(e.target.value)}} className='login-input' type='password' placeholder='Password'/>
                    <input required onChange={(e)=>{onSelectFile(e)}}  style={{display:'none'}} className='login-input' type='file' ref={fileInputRef}/>
                    <input required className='login-input' type='button' value='select your logo' onClick={()=>{fileInputRef.current.click()}} />
                    {imageUrl != null && <img className='image-preview' src={imageUrl} alt='preview' />}
                    <button className='login-input login-btn' type='submit'>{isLoading && <i class="fa-solid fa-spinner fa-spin-pulse"></i>} submit</button>
                </form>
                <Link to='/login' className='register-link'>Login With Your Account</Link>
            </div>
        </div>
    </div>
  )
}

export default Register
