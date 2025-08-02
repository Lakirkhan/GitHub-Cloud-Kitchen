import "../styles/Home_Styles/Home.css";
import HeroSection from "../component/Home/HeroSection";
import HowItWorks from "../component/Home/HowItsWork";
import PopularItems from "../component/Home/PopularItem";
import SearchByFood from "../component/Home/SearchByFood";
import Vendors from "../component/menu/Vendors";

const Home = () => {


  return (
    <div className="home-container-main">
      <div className="home-conatainer-wrap">
        <HeroSection />
        <Vendors/>
        <PopularItems/>
        <SearchByFood/>
        <HowItWorks/>
        
      </div>

    </div>
  );
};

export default Home;
