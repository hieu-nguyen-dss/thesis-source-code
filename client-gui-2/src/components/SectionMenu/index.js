import React from 'react'
import {NavLink} from 'react-router-dom'
import classes from './index.module.css'
const SectionMenu = (props) => {
    return (
        <div className = {classes.sectionMenu}>
            <div className = {`container ${classes.content}`}>
                <NavLink className = {classes.abc}  to = "/" >Home </NavLink>
                <span> / {props.menuCurrent} </span>
            </div>
        </div>
    )
}

export default SectionMenu
