import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  //const [url, setUrl] = useState("");
  console.log(state);
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then((res) => res.json())
      .then((result) => {
        setPics(result.mypost);
      });
  }, []);
  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "celebration");
      data.append("cloud_name", "celebrate");
      fetch("https://api.cloudinary.com/v1_1/celebrate/image/upload", {
        method: "post",
        body: data
      })
        .then((res) => res.json())
        .then((data) => {
          //setUrl(data.url);

          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ pic: data.url })
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
            });
          //window.location.reload();
        })

        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);
  const updatephoto = (file) => {
    setImage(file);
  };

  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          margin: "18px 0px",
          borderBottom: "1px solid grey"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around"
          }}
        >
          <div>
            <img
              style={{ width: "160px", height: "160px", borderRadius: "80px" }}
              src={state ? state.pic : "loading"}
            />
          </div>
          <div>
            <h4>{state ? state.name : "loading"}</h4>
            <h5>{state ? state.email : "loading"}</h5>
            <div
              style={{
                display: "flex",
                width: "108%",
                justifyContent: "space-between"
              }}
            >
              <h5>{mypics.length} posts</h5>
              <h5>{state ? state.followers.length : "0"} followers</h5>
              <h5>{state ? state.following.length : "0"} following</h5>
            </div>
          </div>
        </div>

        <div
          className="file-field input-field"
          style={{ margin: "10px 0px 10 px 30px" }}
        >
          <div className="btn">
            <span>Upload profile image</span>
            <input
              type="file"
              onChange={(e) => updatephoto(e.target.files[0])}
            />
          </div>
          <div class="file-path-wrapper">
            <input class="file-path validate" type="text" />
          </div>
        </div>
      </div>
      <div classname="gallery">
        {mypics.map((item) => {
          return (
            <img
              key={item._id}
              className="item"
              src={item.photo}
              alt={item.title}
            />
          );
        })}
      </div>
    </div>
  );
};
export default Profile;