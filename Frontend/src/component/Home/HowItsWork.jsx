import "../../styles/Home_Styles/Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faUtensils,
  faCreditCard,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" color="#FFA500" />,
      title: "Select location",
      description: "Choose the location where your food will be delivered.",
    },
    {
      id: 2,
      icon: <FontAwesomeIcon icon={faUtensils} size="2x" color="#FFA500" />,
      title: "Choose order",
      description: "Check over hundreds of menus to pick your favorite food.",
    },
    {
      id: 3,
      icon: <FontAwesomeIcon icon={faCreditCard} size="2x" color="#FFA500" />,
      title: "Pay advanced",
      description:
        "It's quick, safe, and simple. Select several methods of payment.",
    },
    {
      id: 4,
      icon: <FontAwesomeIcon icon={faSmile} size="2x" color="#FFA500" />,
      title: "Enjoy meals",
      description: "Food is made and delivered directly to your home.",
    },
  ];

  return (
    <div className="how-it-works">
      <h2 className="how-title">How does it work</h2>
      <div className="steps-container">
        {steps.map((step) => (
          <div key={step.id} className="step">
            <div className="icon-wrapper">{step.icon}</div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-description">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
