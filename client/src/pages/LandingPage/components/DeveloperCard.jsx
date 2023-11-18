import React from "react";
import styles from "./DeveloperCard.module.css";
import { Link } from "react-router-dom";
import LinkedinIcon from "../../../assets/img/linkedin.png"

const DeveloperCard = ({ img, name, msg,linkedin }) => {
  return (
    <div className={styles.developerCard}>
      {/* <p className={styles.messege}>"{msg}"</p> */}
      <div className={styles.developerImg}>
        <img src={img} alt="" />
      </div>
      <h2 className={styles.name}>{name}</h2>
      <div className={styles.proffesion}>Full Stack Web Developer</div>
      <Link to={linkedin}><img style={{height: "3rem"}} src={LinkedinIcon} alt="linkedin Icon" /></Link>
    </div>
  );
};

export default DeveloperCard;
