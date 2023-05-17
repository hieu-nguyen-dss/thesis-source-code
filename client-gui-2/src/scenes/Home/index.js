import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./index.module.css";
import { GiCompass } from "react-icons/gi";
import { FaLowVision, FaHistory } from "react-icons/fa";

const key = "productsRoot";
const Home = () => {
  return (
    <div>
      <div className={`container ${classes.home}`}>
        <div className="row">
          <div className="col-6">
            <div className={classes.bigTitle}>Let's learn proactively</div>
            <div className={classes.description}>
              When it comes to eLearning, content means everything. If eLearning
              content is not masterfully designed, all the rest will just go
              down the drain.
            </div>
          </div>
          <div className={`col-6 ${classes.imgContainer} `}>
            <img
              className={classes.bg1}
              src="https://img.freepik.com/premium-vector/e-learning-education-vector-banner-background-e-learning-text-smart-phone-mobile_572293-957.jpg"
              alt="background"
            />
            <img
              className={classes.bg2}
              src="https://t3.ftcdn.net/jpg/02/39/39/92/360_F_239399223_tthRTvt26El5ccmyQIck9ySsHKgX5YBo.jpg"
              alt="background"
            />
          </div>
        </div>
      </div>
      <div className={classes.featuredProducts}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 style={{ fontSize: "45px" }}>Featured Course</h1>
              <div className={classes.underline}></div>
            </div>
          </div>
          <div className="row" style={{ marginTop: "30px" }}>
            {false ? (
              <div className="col-12">Loading ...</div>
            ) : (
              [].map((item) => (
                <div className="col-4" key={item._id}>
                  <div
                    className={`card ${classes.item}`}
                    style={{ width: "18rem" }}
                  >
                    <img
                      src={item.thumbnail}
                      className="card-img-top"
                      alt="..."
                    />
                    <div className="card-body">
                      <h4 className="card-text" style={{ fontSize: "20px" }}>
                        {item.course_name}
                      </h4>
                      <p style={{ color: "#ab7a5f" }}>{item.category}</p>
                      <p style={{ color: "#ab7a5f" }}>
                        {item.start_date} {item.end_date}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <NavLink
            type="button"
            className={`btn ${classes.allProds}`}
            to="/products"
          >
            All products
          </NavLink>
        </div>
      </div>
      <div className={classes.mission}>
        <div className="container">
          <div className="row">
            <div className="col-3">
              <h3>Custom Furniture Built Only For You </h3>
            </div>
            <div className="col-3"></div>
            <div className="col-6">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
                dolorum debitis consectetur reprehenderit non aliquam voluptates
                dolore aut vero consequuntur.
              </p>
            </div>
          </div>
          <div className="row" style={{ marginTop: "50px" }}>
            <div className="col-4">
              <div className={classes.eachMission}>
                <div className={classes.iconMission}>
                  <GiCompass />
                </div>
                <h3>Mission</h3>
                <p className={classes.abc}>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Voluptates, ea. Perferendis corrupti reiciendis nesciunt rerum
                  velit autem unde numquam nisi
                </p>
              </div>
            </div>
            <div className="col-4">
              <div className={classes.eachMission}>
                <div className={classes.iconMission}>
                  <FaLowVision />
                </div>
                <h3>Vision</h3>
                <p className={classes.abc}>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Voluptates, ea. Perferendis corrupti reiciendis nesciunt rerum
                  velit autem unde numquam nisi
                </p>
              </div>
            </div>
            <div className="col-4">
              <div className={classes.eachMission}>
                <div className={classes.iconMission}>
                  <FaHistory />
                </div>
                <h3>History</h3>
                <p className={classes.abc}>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Voluptates, ea. Perferendis corrupti reiciendis nesciunt rerum
                  velit autem unde numquam nisi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`container ${classes.discount}`}>
        <div className="row">
          <div className="col-7">
            <h1 style={{ fontSize: "27px", letterSpacing: "2px" }}>
              Join our newsletter and get 20% off
            </h1>
            <p style={{ color: "#617d98", width: "80%", marginTop: "20px" }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
              sint unde quaerat ratione soluta veniam provident adipisci cumque
              eveniet tempore?
            </p>
          </div>
          <div className="col-5">
            <form className={classes.subscribe} action="">
              <input type="text" name="email" placeholder="Enter Email" />
              <button className="btn">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
