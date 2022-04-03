import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap"
import { InfoWindow } from "@react-google-maps/api"
import { TextareaAutosize } from "@mui/material";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AiFillCloseCircle } from "react-icons/ai"

// import ListCommentFromApi from "./listComment";
// import React, { useState } from "react";
// import "../App.css";



export default function Comment({ city, lat, lng, onCloseClick }) {
    const token = JSON.parse(localStorage.getItem("loginToken"))
    const history = useHistory()
    const [comment, setComment] = useState("")
    const [listCommentApi, setListCommentApi] = useState([])
    const [isClick, setIsClick] = useState(false)
    const [url, setUrl] = useState('')



    useEffect(() => {
        async function getResults() {
            try {

                if (token) {
                    const results = await axios.get(`http://localhost:3003/users/getPostComment/${city}`,
                        { headers: { "Authorization": `Bearer ${token['token']}` } })
                    console.log(results.data);
                    setListCommentApi(results.data.comments)
                    setUrl(`http://localhost:3003/uploads/${token['token']}`)

                } else history.push("login")

            } catch (error) {
                console.log(error);
            }
        }
        getResults()
    }, [isClick])

    console.log(listCommentApi);
    const handelOnSubmit = (e) => {

        e.preventDefault()
        // const token = JSON.parse(localStorage.getItem("loginToken"))
        console.log({ comment, city })
        token ? (
            axios.post(`http://localhost:3003/users/postComment`,
                { comment, city },
                { headers: { "Authorization": `Bearer ${token['token']}` } })
                .then(res => {
                    console.log(res);
                    setComment("")
                    setIsClick(true)
                }).catch(function (error) {
                    console.log(error);
                })

        ) : history.push("login")
    }


    const [edit, setEdit] = useState(null)


    return (
        <Container style={{ backgroundColor: 'rgb(172, 202, 228)', position: "absolute", display: "flex", left: '3%', top: '3%', minHeight: "300px" }} position={{ lat: lat, lng: lng }} onCloseClick={onCloseClick} >

            <div>
                <AiFillCloseCircle onClick={onCloseClick} style={{ position: "absolute", left: "1px" }} />
                <h3 style={{ marginInline: "80px", color: "goldenrod" }}>תגובות</h3>
                {listCommentApi ?
                    (listCommentApi.map((post, index) => {
                        return (
                            <div key={index}
                                style={{ color: 'cornflowerblue', fontWeight: '300', margin: "3px" }}>
                                <button type="btn" style={{ width: "250px" }} className="btn btn-info" onClick={() => setEdit(edit => edit === index ? null : index)}>

                                    <img style={{ width: '25px', borderRadius: '20px', marginInlineEnd: '40px' }}
                                        src={`http://localhost:3003/uploads/${post.image}`} />{post.name + "..."}{edit === index && <p style={{ fontWeight: "bold" }}>{post.comment}</p>}</button>
                            </div>

                        )
                    })
                    ) : null}
                {
                    !listCommentApi.length && <div
                        style={{ color: "goldenrod", fontWeight: 'bold', margin: "30px" }}>על עיר זו לא נכתבו תגובות</div>
                }

                <div style={{ display: "flex", }} >
                    <Form onSubmit={handelOnSubmit}>
                        <Form.Group >
                            <img style={{ width: "25px", borderRadius: '25px', position: 'absolute', left: '335px', top: '-143px' }} 
                            src={`http://localhost:3003/uploads/${token['img']}`} />
                            <Form.Control value={comment} onChange={(e) => setComment(e.target.value)} placeholder="תגובה..."
                             style={{ position: "absolute", width: '200px', top: '-119px', left: '335px' }} as="textarea" rows="3" />
                        </Form.Group>
                        <Button style={{ position: "absolute", top: "-22px", left: '335px', color: "goldenrod" }} id="submit-button" variant="light" type="submit">שלח</Button>
                    </Form>
                </div>

            </div>
        </Container>
    )
}