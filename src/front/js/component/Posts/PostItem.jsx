import React, { useContext } from 'react';
import { Context } from '../../store/appContext';

const PostItem = ({ post }) => {
  const { actions } = useContext(Context);

  if (!post) {
    return null; // o algún componente de carga, como <Loading />
  }

  const handleLike = async () => {
    await actions.likePost(post.id);
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header d-flex align-items-center">
        <img src={post.author.avatar} alt="Avatar" className="rounded-circle" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
        <div className="ms-3">
          <h6 className="mb-0">{post.author.username}</h6>
          <small className="text-muted">{post.location}</small>
        </div>
      </div>
      <img src={post.image} alt="Post" className="card-img-top"  />
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <button className="btn btn-outline-primary" onClick={handleLike}>
            Like
          </button>
          <span>{post.likes.length} likes</span>
        </div>
        <p className="card-text"><strong>{post.author.username}</strong> {post.message}</p>
        <small className="text-muted">{new Date(post.created_at).toLocaleString()}</small>
      </div>
    </div>
  );
};

export default PostItem;
