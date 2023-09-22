import Bground from '../components/Bground'
import '../assets/about.css'
const About = ()=> {
	return(
		<>
		<Bground />
		<div className="about">
			<p>
        	&copy; {new Date().getFullYear()} <a href="https://eg.linkedin.com/in/ahmedhsin">Ahmed Mubarak</a>. All rights reserved.
	      	</p>
	     	<p>UI &amp; UX by <a href="https://eg.linkedin.com/in/yusuf-salah">Yusuf Salah</a></p>              
		</div>
		</>
		)
}
export default About;