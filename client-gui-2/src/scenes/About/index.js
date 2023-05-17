import React from 'react'
import SectionMenu from '../../components/SectionMenu'
import classes from './index.module.css'
const About = () => {
    return (
        <div>
            <SectionMenu menuCurrent = "About"/>
            <div className = {`container ${classes.story}`}>
                <div className="row">
                    <div className="col-6">
                        <img src = "./assets/image/about/story.jpeg" alt = "story"/>
                    </div>
                    <div className="col-6">
                        <h1>Our Story</h1>
                        <div className={classes.underline}></div>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat accusantium sapiente tempora sed dolore esse deserunt eaque excepturi, delectus error accusamus vel eligendi, omnis beatae. Quisquam, dicta. Eos quod quisquam esse recusandae vitae neque dolore, obcaecati incidunt sequi blanditiis est exercitationem molestiae delectus saepe odio eligendi modi porro eaque in libero minus unde sapiente consectetur architecto. Ullam rerum, nemo iste ex, eaque perspiciatis nisi, eum totam velit saepe sed quos similique amet. Ex, voluptate accusamus nesciunt totam vitae esse iste.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
