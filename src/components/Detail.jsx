import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const Detail = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});

  const fetchPost = async () => {
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
      const data = await res.json();
      setPost(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchPost();
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold">Post No: {post.id}</span>
      </div>
      <div className="flex justify-center items-center mb-4">
        <img src={`https://picsum.photos/id/${post.id}/400/300`} alt={post.title} className="object-cover h-48 w-full md:h-64 lg:w-1/2 lg:h-auto rounded-md" />
      </div>
        <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
      <p className="text-lg leading-relaxed mb-4">{post.body}</p>
      <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Go to Home
      </Link>
    </div>
  );
};

export default Detail;
