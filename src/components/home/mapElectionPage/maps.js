
import React, { useState, useEffect, useRef } from "react";
import MandatByParties from "./mandatByParties";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import Search from "./Search"
import TableElection from "../tableElection/tableElectionResult";
import Comment from "../comment/commentOnResult";
import CommentOrMap from "../comment/CommentOrMap";
import axios from "axios";
import { useHistory, useLocation, } from "react-router-dom"
const token = JSON.parse(localStorage.getItem("loginToken"))

function Maps() {
    const location = useLocation()
    const history = useHistory()
    const [center, setCenter] = useState({
        lat: 31.769976259220588,
        lng: 35.21176437257244,

    })
    const mapRef = useRef(null);
    const [showDiv, setShowDiv] = useState(false)
    const [clickedComment, setClickedComment] = useState(false)
    const [clickedMap, setClickedMap] = useState(false)
    const [zoom, setZoom] = useState(10)
    const [activeMarker, setActiveMarker] = useState(null);
    const [posts, setPosts] = useState(null)





    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyCUrY424hTes0fcYES8JRw3eAde8yhcYkk" // ,

    })
    const handleOnSubmit = (nameOfCity) => {

        const obj = posts?.find((city) => city['properties']["City"] == nameOfCity)
        console.log(obj);
        !obj ? (alert("עיר זו לא קיימת במאגר")) :
            handleActiveMarker(obj)
    }

    const coalitionOrOpposition = () => {
        posts?.forEach(city => {
            const sumCoalition = [city['properties']["yamina"], city['properties']["New Hope"], city['properties']["meretz"], city['properties']["labor party"], city['properties']["Blue and White"], city['properties']["Yisrael beiteinu"], city['properties']["United Arab List"], city['properties']["yesh atid"]]
            const sumOpposition = [city['properties']["likud"], city['properties']["Shas"], city['properties']["Religious Zionist Party"], city['properties']["joint list"], city['properties']["United Torah"]]
            const result1 = sumCoalition.reduce((total, currentValue) => total = total + currentValue, 0);
            const result2 = sumOpposition.reduce((total, currentValue) => total = total + currentValue, 0);
            result2 > result1 ? city.color = 'blue' : city.color = 'red'
        })

    }


   
      
    function getResults() {
      console.log(token);
        token &&
            axios.get(`users/getMapElectionGeoJson`,
                ).then(res => {
                    setPosts(res.data?.features)
                    console.log(res);

                }).catch( function (error) {
                
                    console.log(error.response);

                })
    }



    useEffect(() => {
      
        getResults()
        coalitionOrOpposition()
     
    }, [])




    const handleActiveMarker = (marker) => {
      
        posts?.forEach(city => {
            const sumCoalition = [city['properties']["yamina"], city['properties']["New Hope"], city['properties']["meretz"], city['properties']["labor party"], city['properties']["Blue and White"], city['properties']["Yisrael beiteinu"], city['properties']["United Arab List"], city['properties']["yesh atid"]]
            const sumOpposition = [city['properties']["likud"], city['properties']["Shas"], city['properties']["Religious Zionist Party"], city['properties']["joint list"], city['properties']["United Torah"]]
            const result1 = sumCoalition.reduce((total, currentValue) => total = total + currentValue, 0);
            const result2 = sumOpposition.reduce((total, currentValue) => total = total + currentValue, 0);
            result2 > result1 ? city.color = 'blue' : city.color = 'red'
        })


        setActiveMarker(marker);
        setShowDiv(true)
        setCenter({ lat: marker.geometry.coordinates[1], lng: marker.geometry.coordinates[0] })
        zoom < 13 && setZoom(13)

    };



    function handleZoomChanged(newZoom) {
        setZoom(newZoom);
    }

    const handleOnLoad = (map) => {

        mapRef.current = map;
        console.log(mapRef.current.zoom);
        console.log(mapRef.current.center);
        const newPos = mapRef.current.getCenter().toJSON();
        setCenter(newPos)

        const bounds = new window.google.maps.LatLngBounds();
        posts && posts.map(city => {
            bounds.extend({ lat: city.geometry.coordinates[1], lng: city.geometry.coordinates[0] })
        })

        map.fitBounds(bounds);


    };
    const clickedMaping = () => {
        setClickedMap(false)
    
    }
    const clickedOnComment = () => {
        setClickedComment(false)
    }
    const mapCenter = () => {
        console.log(mapRef?.current.center);

        if (!mapRef.current) return;
        const newPos = mapRef.current.getCenter().toJSON();
        console.log(newPos);
        setCenter(newPos);


    }

    const renderMap = () => {
        return (
            <>

                <GoogleMap
                    onCenterChanged={() => mapCenter}
                    onZoomChanged={() => handleZoomChanged(zoom)}
                    center={{ lat: center.lat, lng: center.lng }}
                    zoom={zoom}
                    onLoad={handleOnLoad}
                    mapContainerStyle={{ height: "100vh" }}>

                    <MandatByParties />

                    <Search onSearch={handleOnSubmit} />



                    {posts && posts.length ? (posts.map((city, i) => (

                        <Marker
                            key={i}
                            position={{ lat: city.geometry.coordinates[1], lng: city.geometry.coordinates[0] }}
                            onClick={() => handleActiveMarker(city)}
                            icon={{
                                url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
                                size: new window.google.maps.Size(20, 32),
                                anchor: new window.google.maps.Point(0, 32),
                                scaledSize: new window.google.maps.Size(15, 15)

                            }}
                        />
                    ))
                    ) : null}

                    {activeMarker ? !clickedMap && !clickedComment && (

                        <div style={{ width: "400px", margin: "auto", marginTop: '20px' }}   >
                            {showDiv ? (<CommentOrMap activeMarker={activeMarker} setShowDiv={() => setShowDiv(false)} 
                            setClickedMap={() => setClickedMap(true)} setClickedComment={() => setClickedComment(true)} />) : null}
                        </div>
                    ) : null}
                    {clickedMap ? (<TableElection activeMarker={activeMarker} closeclick={clickedMaping} />) : null}

                    {
                        clickedComment ? !clickedMap && (<Comment city={activeMarker.properties.City} lat={activeMarker.geometry.coordinates[1]} lng={activeMarker.geometry.coordinates[0]} 
                            closeclick={clickedOnComment} />) : null
                    }
 

                </GoogleMap>


            </>
        );
    }
    return isLoaded ? renderMap() : null
}


export default Maps;
