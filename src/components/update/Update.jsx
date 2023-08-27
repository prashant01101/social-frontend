import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Update = ({setOpenUpdate,user}) => {

    const [cover, setCover] = useState(null);
    const [profile, setProfile] = useState(null);
    const [texts, setTexts] = useState({
            // email: user.email,
            // password: user.password,
            // name: user.name,
            // city: user.city,
            // website: user.website,
            name:"",
            city:"",
            website:"",
    });
    
    const upload = async (file) => {
        // console.log(file)
        try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await makeRequest.post("/upload", formData);
        return res.data;
        } catch (err) {
        console.log(err);
        }
    };
    const handleChange = (e) => {
        setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
      (user) => {
        return makeRequest.put("/users", user);
      },
      {
        onSuccess: () => {
          // Invalidate and refetch
          queryClient.invalidateQueries(["user"]);
        },
      }
    );
    console.log(user)

    const handleClick = async (e) => {
    e.preventDefault();
        
    //     //     //TODO: find a better way to get image URL
            
    let coverUrl;
    let profileUrl;
    coverUrl = cover ? await upload(cover) : user.coverPic;;
    profileUrl = profile ? await upload(profile) : user.profilePic;
            
    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    setOpenUpdate(false);
    // // setCover(null);
    // console.log(coverUrl)
    // // setProfile(null);
    };
  return (
    <div className="update">Update
     <form>
        <input
            type="file"
            // id="cover"
            // style={{ display: "none" }}
            onChange={(e) => setCover(e.target.files[0])}

            />
        <input
              type="file"
            //   id="profile"
            //   style={{ display: "none" }}
              onChange={(e) => setProfile(e.target.files[0])}
            />
        {/* <input
            type="text"
            // value={texts.email}
            name="email"
            onChange={handleChange}
          /> */}
{/* //           <label>Password</label> */}
          {/* <input
            type="text"
            // value={texts.password}
            name="password"
//             onChange={handleChange}
          /> */}
{/* //           <label>Name</label> */}
          <input
            type="text"
            // value={texts.name}
            name="name"
            onChange={handleChange}
          />
{/* //           <label>Country / City</label> */}
          <input
            type="text"
            name="city"
            // value={texts.city}
            onChange={handleChange}
          />
          {/* <label>Website</label> */}
          <input
            type="text"
            name="website"
            // value={texts.website}
            onChange={handleChange}
          />    
          <button onClick={handleClick}>Update</button>    

    </form> 
    
    <button onClick={()=> setOpenUpdate(false)}> x</button>
    </div>
  );
};

export default Update;