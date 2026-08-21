import { 
useEffect,
useState,
useRef
} from "react";
import {
  getProfile,
  updateProfile,
} from "../../services/profileService";
import "./Profile.css";
import {
 uploadProfileImage,
 getProfileImageUrl
} from "../../api/userApi";
import Webcam from "react-webcam";

function Profile() {

const [loading, setLoading] = useState(true);

const userId =
    localStorage.getItem("userId");


const [image,setImage]=useState(
    getProfileImageUrl(userId)+"?t="+Date.now()
);

const [showCamera,setShowCamera]=useState(false);

const webcamRef = useRef(null);

const [selectedFile,setSelectedFile]=useState(null);

const [user, setUser] = useState({

    firstName: "",
  lastName: "",
  email: "",
  phone: "",
  cnic: "",
  designation: "Customer",
  address: "",
  city: "",
  postalCode: "",

  });

  const handleChange = (e) => {

    const { name, value } = e.target;

    setUser((prev) => ({

      ...prev,

      [name]: value

    }));

  };

  const handleUpload = async()=>{


    if(!selectedFile){

        alert("Select image first");

        return;
    }



    try{


        await uploadProfileImage(
            userId,
            selectedFile
        );


        alert(
            "Profile image updated"
        );



        setImage(
            getProfileImageUrl(userId)
            +
            "?t="
            +
            new Date().getTime()
        );


    }
    catch(error){

        console.log(error);

        alert(
            "Upload failed"
        );

    }


};

  const loadProfile = async () => {
  try {
    const response = await getProfile(userId);

    setUser({
      firstName: response.data.firstName || "",
      lastName: response.data.lastName || "",
      email: response.data.email || "",
      phone: response.data.phone || "",
      cnic: response.data.cnic || "",
      designation: "Customer",
      address: response.data.address || "",
      city: response.data.city || "",
      postalCode: response.data.postalCode || "",
    });
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  if (userId) {
    loadProfile();
  }
}, [userId]);

  const handleSave = async () => {
  try {
    await updateProfile(userId, user);

    alert("Profile Updated Successfully");
  } catch (error) {
    console.log(error);

    alert("Unable to update profile.");
  }
};

if (loading) {
  return <h2>Loading Profile...</h2>;
}

const capturePhoto = async()=>{


    const imageSrc =
        webcamRef.current.getScreenshot();


    const blob =
        await fetch(imageSrc)
        .then(res=>res.blob());


    const file =
        new File(
            [blob],
            "camera-profile.jpg",
            {
                type:"image/jpeg"
            }
        );


    setSelectedFile(file);


    setImage(imageSrc);


    setShowCamera(false);


};

  return (

    <div className="profile-page">

      <div className="profile-header">

        <div>

          <h1>My Profile</h1>

          <p>
            View and update your profile information.
          </p>

        </div>

        

      </div>

      <div className="profile-card">

        <div className="profile-avatar-section">


    <div className="profile-avatar">


{
image ?

<img
src={image}
alt="profile"
/>

:

<span>
{
user.firstName?.charAt(0)
}
</span>

}


</div>

<div>


<input
type="file"
accept="image/*"
id="profileUpload"
style={{display:"none"}}

onChange={(e)=>{

setSelectedFile(
e.target.files[0]
);

setImage(
URL.createObjectURL(
e.target.files[0]
)
);

}}

/>


<label
htmlFor="profileUpload"
className="upload-btn"
>
Upload Photo
</label>



<button
className="camera-btn"
onClick={()=>setShowCamera(true)}
>
Take Photo
</button>


</div>

{
showCamera &&

<div className="camera-box">


<Webcam

ref={webcamRef}

screenshotFormat="image/jpeg"

width={300}

/>


<br/>


<button
onClick={capturePhoto}
>
Capture
</button>



<button
onClick={()=>setShowCamera(false)}
>
Cancel
</button>


</div>

}



    <input
        type="file"
        accept="image/*"
        onChange={(e)=>
            setSelectedFile(
                e.target.files[0]
            )
        }
    />


    <button
        className="upload-btn"
        onClick={handleUpload}
    >
        Upload Picture
    </button>


</div>
        <div className="profile-grid">

          <div>

            <label>First Name</label>

            <input
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
            />

          </div>

          <div>

            <label>Last Name</label>

            <input
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
            />

          </div>

          <div>

            <label>Email</label>

            <input
              name="email"
              value={user.email}
              onChange={handleChange}
            />

          </div>

          <div>

            <label>Phone</label>

            <input
              name="phone"
              value={user.phone}
              onChange={handleChange}
            />

          </div>

          <div>

            <label>CNIC</label>

            <input
              name="cnic"
              value={user.cnic}
              disabled
            />

          </div>

          <div>

            <label>Role</label>

            <input
              value={user.designation}
              disabled
            />

          </div>

          <div className="full-width">

            <label>Address</label>

            <textarea
              rows="4"
              name="address"
              value={user.address}
              onChange={handleChange}
            />

          </div>

          <div>

            <label>City</label>

            <input
              name="city"
              value={user.city}
              onChange={handleChange}
            />

          </div>

          <div>

            <label>Postal Code</label>

            <input
              name="postalCode"
              value={user.postalCode}
              onChange={handleChange}
            />

          </div>

        </div>

        <div className="button-group">

          <button
            className="save-btn"
            onClick={handleSave}
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>

  );

}

export default Profile;