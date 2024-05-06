import React, { useRef, useState } from 'react'
import {storage,auth,db} from '../../firebase'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { updateProfile } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'



const Setting = () => {
  const fileInputRef = useRef(null)
  
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [file,setFile] = useState(null)
  const [displayName,setDisplayName] = useState(localStorage.getItem('cName'))
  const [imageUrl,setImageUrl] = useState(localStorage.getItem('photoURL'))

  const updateComapanyName = ()=>{
    updateProfile(auth.currentUser,{
      displayName:displayName
    })
    .then(res=>{
      localStorage.setItem('cName',displayName)
      updateDoc(doc(db,"users",localStorage.getItem('uid')),{
        displayName:displayName
      })
      .then(res=>{
        window.location.reload()
      })
    })
  }

  const onSelectFile = (e)=>{
    setFile(e.target.files[0])
    setImageUrl(URL.createObjectURL(e.target.files[0]))
  }

  const updateLogo = ()=>{
    const fileRef = ref(storage,localStorage.getItem('photoURL'))
    console.log(fileRef._location.path_)
    const storageRef = ref(storage,fileRef._location.path_)
    uploadBytesResumable(storageRef,file)
    .then(result=>{
     window.location.reload();

    })
  }
  
  
  return (
    <div>
      <p>setting</p>
      <div className='setting-wrapper'>
        <div className='profile-info update-cName'>
        <img onClick={()=>{fileInputRef.current.click()}} className='pro' alt='profile-pic' src={imageUrl}/>
        <input onChange={(e)=>{onSelectFile(e)}} style={{display:'none'}}  type='file' ref={fileInputRef}/>
        {file && <button onClick={()=>{updateLogo()}} style={{width:'30%',padding:'10px',backgroundColor:'hotpink'}}>Update Profile Pic</button>}
        </div>

        <div className='update-cName'>
          <input onChange={e=>{setDisplayName(e.target.value)}} type='text' placeholder='company name' value={displayName}/>
          <button onClick={updateComapanyName}>Update Company Name</button>
        </div>

        
      </div>
    </div>
  )
}

export default Setting
