import React from "react";

const HomePage = () => {
  const featuredCourses = [
    {
      title: "Web Development",
      img: "course 1.jpg",
      category: "technical",
      desc: "Learn HTML, CSS, JavaScript and more!",
    },
    {
      title: "Programming",
      img: "course 5.jpg",
      category: "technical",
      desc: "Master programming languages from beginner to advanced level.",
    },
    {
      title: "Data Science",
      img: "course 10.jpg",
      category: "technical",
      desc: "Get started with data analysis and machine learning.",
    },
    {
      title: "UI/UX Design",
      img: "course 7.png",
      category: "design",
      desc: "Design modern and engaging user experiences.",
    },
  ];

  const testimonials = [
    {
      quote: "EduSphere helped me get my first job as a web developer!",
      author: "Priya S.",
    },
    {
      quote:
        "The Python course was very beginner friendly and well-structured.",
      author: "Arjun R.",
    },
    {
      quote:
        "Excellent content and very responsive mentors. Highly recommended.",
      author: "Sneha M.",
    },
    {
      quote: "The UI/UX design course gave me the confidence to freelance!",
      author: "Rahul T.",
    },
    {
      quote: "Great support from instructors and a very practical curriculum.",
      author: "Neha D.",
    },
    {
      quote: "The data science track was intense but totally worth it!",
      author: "Kunal M.",
    },
  ];

  return (
    <div className="font-roboto">
      {/* Hero Section */}
      <section
        className="h-[490px] flex flex-col items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('./assets/images/bg.jpg')",
        }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mt-20 drop-shadow-lg">
          Welcome to Edu<span className="italic text-[#b087cf]">Sphere</span>
        </h1>
        <p className="text-lg md:text-2xl font-semibold text-white drop-shadow-md mt-3">
          Creating Opportunities • Discovering You
        </p>
      </section>

      {/* Featured Courses */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Featured Courses</h2>
        <div className="mt-10 flex flex-wrap justify-center gap-8">
          {featuredCourses.map((course, i) => (
            <a
              key={i}
              href={`/courses?category=${course.category}`}
              className="group"
            >
              <div className="w-64 h-[320px] bg-white rounded-xl shadow-md overflow-hidden transition transform group-hover:-translate-y-2 group-hover:shadow-xl">
                <img
                  src={`/assets/images/${course.img}`}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-purple-600">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">{course.desc}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800">
          What Our Learners Say
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="w-80 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <p className="text-gray-700 italic">"{t.quote}"</p>
              <h4 className="mt-4 font-semibold text-purple-600">
                — {t.author}
              </h4>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
