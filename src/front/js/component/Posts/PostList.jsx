import React, { useState, useEffect, useContext } from 'react';
import PostItem from '../Posts/PostItem.jsx';
import { Context } from '../../store/appContext';

const PostList = () => {
  const { store, actions } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      await actions.fetchPosts();
      setLoading(false);
    };

    fetchPosts();
  }, [actions]);

  return (
    <div className="post-list container mt-5">
      {loading ? (
        <p>Loading...</p>
      ) : (
        store.posts?.length > 0 ? (
          store.posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))
        ) : (
          <p>No posts available</p>
        )
      )}
    </div>
  );
};

export default PostList;
