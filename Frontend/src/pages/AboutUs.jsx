import React from "react";
import "../styles/About.css";
import { motion } from "framer-motion";

const About = () => {

const testimonials = [
  { quote: "The best dining experience ever! Amazing food and great service.", name: "Loreto Jones" },
  { quote: "Highly recommend! The chefs truly know how to create delicious dishes.", name: "Samantha Lee" },
  { quote: "A top-notch restaurant with a wonderful atmosphere. Will visit again!", name: "Michael Carter" },
  { quote: "Absolutely loved it! The flavors were out of this world.", name: "Jessica Morgan" },
  { quote: "Fantastic customer service and cozy ambiance. 10/10!", name: "Daniel Smith" },
  { quote: "A hidden gem! The quality of ingredients was exceptional.", name: "Emma White" },
  { quote: "A warm and welcoming place with dishes full of flavor.", name: "Ella Robinson" },
  { quote: "The service was beyond amazing! Felt like home.", name: "Lucas Harris" },
  { quote: "Perfect place for a date night! Romantic and cozy.", name: "Emily Lewis" },
  { quote: "Their coffee and pastries are to die for! Highly recommended.", name: "Daniel Walker" },
];
  return (
    <div className="about-container capitalize">
      {/* Hero Section */}
      <section className="hero-section">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          About Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Providing an unforgettable dining experience.
        </motion.p>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-text">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            We Are Always <span className="highlight">Serving You Fresh</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Best quality food with unforgettable taste and unmatched experience.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Our chefs are dedicated to bringing you exquisite flavors crafted
            with passion and precision. We source the finest ingredients to
            ensure an unforgettable dining experience.
          </motion.p>
        </div>
        <motion.img
          src="/img8.webp"
          alt="About Us"
          className="about-image"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        />
      </section>

      {/* Values Section */}
      <section className="values-section">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Our Core Values
        </motion.h2>
        <div className="values-container">
          {[
            {
              title: "Quality Ingredients",
              description: "We believe that great food starts with the best ingredients.",
            },
            {
              title: "Exceptional Service",
              description: "We are committed to providing a world-class dining experience.",
            },
            {
              title: "Innovation",
              description: "Constantly improving and bringing unique flavors to our menu.",
            },
          ].map((value, index) => (
            <motion.div
              key={index}
              className="value-box"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: index * 0.3 }}
            >
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Why Choose Us?
        </motion.h2>
        <div className="features-container">
          {[
            {
              title: "Unforgettable Taste",
              description: "We use only the best ingredients to ensure a delicious experience.",
            },
            {
              title: "Best Quality Food",
              description: "Maintaining high hygiene standards in food preparation.",
            },
            {
              title: "Healthy Choices",
              description: "We offer a variety of nutritious meals for a balanced diet.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="feature-box"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: index * 0.3 }}
            >
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Chefs Section */}
      <section className="chefs-section">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
        <h1 style={{color: '#f1d329',fontWeight:'bold'}}>  Meet Our <span className="highlight">Expert Chefs</span> </h1>
        </motion.h2>
        <div className="chefs-container">
          {[
            {
              name: "Matthew Hong",
              image: "/ch11.jpg",
              description: "Specialized in gourmet French cuisine with 20+ years of experience.",
            },
            {
              name: "Anita Bentley",
              image: "/ch222.jpg",
              description: "Expert in pastry and desserts, bringing sweet creations to life.",
            },
            {
              name: "Daniel Smith",
              image: "/ch33.jpg",
              description: "Master of Italian dishes, creating authentic pasta and pizza.",
            },
          ].map((chef, index) => (
            <motion.div
              key={index}
              className="chef-box"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: index * 0.3 }}
            >
              <img src={chef.image} alt={chef.name} className="chef-image" />
              <h3>{chef.name}</h3>
              <p>{chef.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="testimonials-section">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          What Our Customers Say
        </motion.h2>
        <div className="testimonials-container">
          {[
            {
              quote:
                "The best dining experience ever! Amazing food and great service.",
              name: "Loreto Jones",
            },
            {
              quote:
                "Highly recommend! The chefs truly know how to create delicious dishes.",
              name: "Samantha Lee",
            },
            {
              quote:
                "A top-notch restaurant with a wonderful atmosphere. Will visit again!",
              name: "Michael Carter",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              className="testimonial-box"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: index * 0.3 }}
            >
              <p>{testimonial.quote}</p>
              <h3><b>{testimonial.name}</b></h3>
            </motion.div>
          ))}
        </div>
      </section> */}
    
    <section className="testimonials-section">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }} 
        style={{color:'#f1d329',fontSize: '2.2rem', fontWeight: 'bold'}}
      >
        What Our Customers Say!
      </motion.h1>

      <div className="testimonials-slider">
        <div className="testimonials-track">
          {testimonials.concat(testimonials).map((testimonial, index) => ( // Duplicate for infinite effect
            <motion.div
              key={index}
              className="testimonial-box"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: (index % testimonials.length) * 0.2 }}
            >
              <p>{testimonial.quote}</p>
              <h3><b>{testimonial.name}</b></h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    <section className="delivery-platforms-section">
  <motion.h2
    initial={{ opacity: 0, y: -50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
  >
    <h1 style={{ color: '#f1d329', fontWeight: 'bold' }}>
      Explore <span className="highlight">Top Food Delivery Platforms</span>
    </h1>
  </motion.h2>
  <div className="platforms-container">
    {[
      {
        name: "Zomato",
        image: "/zomato.jpeg",
        url: "https://www.zomato.com",
        description: "Your go-to platform for discovering and ordering from top restaurants.",
      },
      {
        name: "Swiggy",
        image: "/swiggy.jpg",
        url: "https://www.swiggy.com",
        description: "Fast and reliable food delivery with exclusive deals and offers.",
      },
      {
        name: "Zepto",
        image: "/zepto.jpg",
         url: "https://www.zepto.com",
        description: "Quick grocery and food delivery at your doorstep in minutes.",
      },
    ].map((platform, index) => (
      <motion.div
        key={index}
        className="platform-box"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: index * 0.3 }}
      >
        <img src={platform.image} alt={platform.name} className="platform-image" />
        <h3>{platform.name}</h3>
        <p>{platform.description}</p>
        <button
              className="visit-button"
              onClick={() => window.open(platform.url, "_blank")}
            >
              Visit {platform.name}
            </button>
      </motion.div>
    ))}
  </div>
</section>

   
    </div>
  );
};

export default About;