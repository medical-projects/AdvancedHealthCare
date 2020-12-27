import React, { useState, useEffect } from "react";
import "./AdminPosts.css";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import DeleteIcon from "@material-ui/icons/Delete";

function AdminPosts() {
  const [posts, setPosts] = useState(null);
  console.log(posts);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => {
            const data = doc.data();
            data.id = doc.id;
            return data;
          })
        );
      });
  }, []);

  const handlePostDelete = (id) => {
    db.collection("posts")
      .doc(id)
      .delete()
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
  };

  return (
    <div className="adminPost">
      {posts?.map((post) => (
        <div className="adminPost__container">
          <div className="adminPost__header">
            <div className="adminPost__userDetails">
              <Link to={`/profile/${post.authorEmail}`}>
                <Avatar src={post.authorPic} />
              </Link>
              <p>{post.authorName}</p>
            </div>
            <div
              className="adminPost__date"
              title={post.timestamp.toDate().toUTCString()}
            >
              {post.timestamp.toDate().toLocaleDateString()}
            </div>
          </div>
          <h2 className="adminPost__heading">{post.title}</h2>
          <p className="adminPost__message">{post.message}</p>
          <div className="adminPost__imgContainer">
            <img src={post.imgUrl} alt="northern lights" />
          </div>
          <div
            className="adminPost__deleteContainer"
            onClick={() => handlePostDelete(post.id)}
          >
            <DeleteIcon /> <p>Delete Post</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminPosts;