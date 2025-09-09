import React, { useEffect, useState } from "react";
import axios from "axios";

const TopRated = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/v1/courses/top-rated"
        );
        setCourses(res.data); // backend already filters rating > 3
      } catch (err) {
        console.error("Error fetching top-rated courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRated();
  }, []);

  if (loading) return <p>Loading top-rated courses...</p>;

  return (
    <div className="p-5 ">
      {/* Heading */}
      <h2 className="text-3xl font-bold mb-5 text-center text-[#B087CF]">
        Top Rated<span className=" text-black px-3  rounded-lg">Courses</span>
      </h2>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.length === 0 ? (
          <p className="text-center text-gray-500">No top-rated courses yet.</p>
        ) : (
          courses.map((course) => (
            <div
              key={course._id}
              className="rounded-2xl bg-white/90 backdrop-blur-lg border border-gray-200 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col"
            >
              {/* Image */}
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-40 object-cover rounded-xl mb-3"
              />

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-800">
                {course.title}
              </h3>
              <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                {course.description}
              </p>

              {/* Details */}
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {course.category}
                </p>
                <p>
                  <span className="font-semibold">Rating:</span> ⭐{" "}
                  {course.rating.toFixed(1)}
                </p>
                <p>
                  <span className="font-semibold">Instructor:</span>{" "}
                  {course.instructor?.name || "Unknown"} (
                  {course.instructor?.email || "No email"})
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopRated;
