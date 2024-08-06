import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../store/appContext';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    image: '',
    message: '',
    location: '',
    status: 'published',
    author_id: 1  // Asignar un author_id fijo para pruebas
  });

  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await actions.createPost(formData);
    navigate('/posts');  // Redirigir a la lista de posts después de crear el post
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Create a New Post</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-white">
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            value={formData.image}
            id="image"
            name="image"
            placeholder="Enter image URL"
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">Message</label>
          <textarea
            className="form-control"
            value={formData.message}
            id="message"
            name="message"
            placeholder="Enter message"
            rows="3"
            required
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Location</label>
          <input
            type="text"
            className="form-control"
            value={formData.location}
            id="location"
            name="location"
            placeholder="Enter location"
            required
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <input
            type="text"
            className="form-control"
            value={formData.status}
            id="status"
            name="status"
            placeholder="Status"
            required
            onChange={handleChange}
          />
        </div>
        <input type="hidden" name="author_id" value={formData.author_id} />  {/* Campo oculto para author_id */}
        <button type="submit" className="btn btn-primary">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
