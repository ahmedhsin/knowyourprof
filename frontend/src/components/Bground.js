import bg from '../assets/bg.jpg'

const Bground = ({dark, blur})=>{
		let classes = "";
		if (dark){
			classes += dark + " ";
		}
		if (blur){
			classes += blur + " ";
		}
		return (<img src={bg} id="Bground" className={classes}/>)
}
/*		return (<img src={bg} id="Bground" className={classes}/>)
*/
export default Bground;