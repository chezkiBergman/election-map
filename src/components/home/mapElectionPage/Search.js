import React,{useState} from "react";
import PropTypes from 'prop-types';
import { Button, Table,Form } from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function Search({ onSearch }) {
  const history = useHistory()
    const [city, setCity] = useState('');
    const [resultSearch, setResultSearch] = useState([])
  
    const onFormSumbit = (e) => {
      e.preventDefault();
      // logic here on submit, can be when the button is clicked or just press Enter.
      console.log(city);
      onSearch && onSearch(city);
      setCity("")
      
    };
  const resultFromApi =async(e)=>{
      setCity(e.target.value) 
      const token = JSON.parse(localStorage.getItem("loginToken"))
    if( token ){
      const results = await axios.get(`http://localhost:3003/users/getMapElectionGeoJson`, { headers: { "Authorization": `Bearer ${token['token']}` } });
      const citys = results.data.features
      const obj = citys.filter(c => c.properties.City.includes(city))
     setResultSearch(obj)
     
    //  console.log(resultSearch);
     } else{ history.push("login")}
    }
    const clickList =(c)=>{
      setCity(c)
      setResultSearch("")
    }
   
  
    return (
        <div style={{position:"relative",top: '150px',
        right: '500px'}}>
        <Form onSubmit={onFormSumbit}>
        <Form.Group style={{position:"absolute",top:"-45px",right:"-135px"}} className="mb-3" controlId="formBasicCity">
            <Form.Label style={{fontWeight:"600"}}>חפש עיר</Form.Label>
            <input className="form-control" style={{width:"200px"}} type="city" placeholder="Enter City" value={city} onChange={(e)=>resultFromApi(e)}/>
            { resultSearch ?(resultSearch.map((cityName,i)=>{return <div  style={{opacity: 0.65,width: '200px',backgroundColor: 'white'}}
               key={i}><button style={{border:"none"}} onClick={()=>clickList(cityName.properties.City)}>{cityName.properties.City}</button></div> })):null}
          
          <Button style={{ margin: '5px' }}   variant="outline-primary" type="submit" >
            שלח
        </Button>
        </Form.Group>
    
      
        </Form>
        </div>
    );
  }
  
  Search.propTypes = {
    onSearch: PropTypes.func,
  };
  