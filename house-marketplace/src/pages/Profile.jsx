import {getAuth, updateProfile} from 'firebase/auth'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify';
import {useState } from 'react'
import { useNavigate, Link} from 'react-router-dom'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

const Profile = () => {

  const auth = getAuth()

  const [changeDetails, setChangeDetails] = useState(false) 

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const {name, email} = formData;

  const navigate = useNavigate()

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  const onSubmit = async () => {

    try {
      if(auth.currentUser.displayName !== name){

        // Update displayName in firebase
        await updateProfile(auth.currentUser, {
          displayName: name
        })

        //Update in firestore

        //Take the reference of the user document
        const userRef = doc(db, 'users', auth.currentUser.uid)
        //Update it on the firestore
        await updateDoc(userRef, {name})

      }
    } catch (error) {
      console.log(error);
      toast.error('Could not update profile details')
    }
  }

  const onChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.id] : e.target.value,
    }))
  }

  return (

     
      <div className='profile'>

        {/* Header */}
        <header className="profileHeader">

          <p className="pageHeader">
            My Profile
          </p>

          <button type='button' className="logOut" onClick={onLogout}>
            Logout
          </button>

        </header>

      {/* Form Toggle*/}
      <main>
        <div className="profileDetailsHeader">

          <p className="profileDetailsText">Personal Details</p>

          <p className="changePersonalDetails" onClick={() => {
            changeDetails && onSubmit()
            setChangeDetails(prevState => !prevState)
          }}>

            {changeDetails ? 'done' : 'change'}
        
          </p>

        </div>
          {/* Form */}
          <div className="profileCard">
            <form>

              {/* Name */}
              <input type="text" id="name" className={!changeDetails ? 'profileName'
               : 'profileNameActive'} disabled={!changeDetails} 
               value={name}
               onChange={onChange}
               />

               {/* Email */}
               <input type="text" id="email" className={!changeDetails ? 'profileEmail'
               : 'profileEmailActive'} disabled={!changeDetails} 
               value={email}
               onChange={onChange}
               />

            </form>
          </div>

          {/* Create Listings */}
          <Link to='create-listing' className='createListing' >
            <img src={homeIcon} alt="home" />
            <p>Sell or rent your home</p>
            <img src={arrowRight} alt="arrow right" />
          </Link>

      </main>  

      </div>

  )
}
export default Profile