import React, { useEffect, useState, Fragment } from "react";
import Detail from "./components/Detail";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import LoginForm from "./components/Loginform";

const App = () => {
  const navigate = useNavigate();
  const [myData, setMyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(6);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const fetchData = async () => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data = await res.json();
      setMyData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
    navigate("/");
  };

  // this is for generating the image from the picsum
  const getImageUrl = (id) => `https://picsum.photos/id/${id}/400/400`;

  // Render the posts for the current page
  const renderPosts = myData
    .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
    .map((data) => {
      return (
        <Fragment key={data.id}>
        <Link to={isLoggedIn ? `/detail/${data.id}` : "/login"} >
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-2">{data.id}</h3>
            <div className="flex items-center justify-center mb-2">
              <img
                className="object-cover w-full h-full rounded-md"
                src={getImageUrl(data.id)}
                alt={`Post ${data.id}`}
              />
            </div>
            <h2 className="text-xl font-bold mb-2">{data.title}</h2>
            <p className="text-gray-700">{data.body.slice(0, 100)}...</p>
            <div className="flex items-center mt-4">
              <img
                className="w-10 h-10 rounded-full mr-2"
                src="../src/assets/hero.jpg"
                alt={`Avatar of user ${data.userId}`}
              />
              <div>
                <span className="text-gray-500 text-sm mr-0 sm:mr-40">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <button className=" text-blue-800 px-4">
                Read more
              </button>
            </div>
          </div>
          </Link>
      </Fragment>
      );
    });

  // Calculate the total number of pages
  const totalPages = Math.ceil(myData.length / postsPerPage);

  // Generate an array of page numbers to display in the pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle clicking on a page number in the pagination
  const handleClick = (event, pageNumber) => {
    event.preventDefault();
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route
          path="/"
          element={
            <div className="container mx-auto p-4">
              <h1 className="text-3xl font-bold mb-4">Blog</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderPosts}
              </div>

              {/* Here for showing the login and logout button below the posts and above the page numbers */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-3 rounded"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-3 rounded"
                >
                  Login
                </button>
              )}
              <div className="flex justify-center mt-4">
                <div className="pagination">
                  {currentPage !== 1 && (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(currentPage - 1);
                      }}
                      className="px-2 py-1 rounded-md text-gray-600"
                    >
                      Prev
                    </a>
                  )}

                  {pageNumbers.map((pageNumber) => {
                    return (
                      <a
                        href="#"
                        key={pageNumber}
                        onClick={(event) => handleClick(event, pageNumber)}
                        className={`px-2 py-1 rounded-md ${
                          currentPage === pageNumber
                            ? "bg-blue-500 text-white"
                            : " text-gray-600"
                        }`}
                      >
                        {pageNumber}
                      </a>
                    );
                  })}

                  {currentPage !== totalPages && (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(currentPage + 1);
                      }}
                      className="px-2 py-1 rounded-md text-gray-600"
                    >
                      Next
                    </a>
                  )}
                </div>
              </div>
            </div>
          }
        />
        <Route path="/data/:id" element={<Detail data={myData} />} />
      </Routes>
    </>
  );
};

export default App;
