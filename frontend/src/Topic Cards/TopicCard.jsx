import React from "react";
import "./TopicCard.css";

function TopicCard(props) {
  return (
    <div className="container-fluid card topic-card">
      <img src={props.topicimg} className="card-img-top mx-auto p-1" alt="..." />
      <div className="card-body">
        <h5 className="card-title fw-bold text-primary">{props.topictitle}</h5>
        <p className="card-text fw-medium">
          {props.topictext}
        </p>
        <a href={props.topiclink} className="btn btn-info border border-secondary border-3 border-opacity-50">
          Explore
        </a>
      </div>
    </div>
  );
}

export default TopicCard;
