import { useState, useEffect } from "react";
import { Form, Button, Container,Alert } from "react-bootstrap"
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AiFillCloseCircle } from "react-icons/ai"
import  "./commentOnResult.css"



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
        <Container className='head'
         position={{ lat: lat, lng: lng }} onCloseClick={onCloseClick} >

            <div>
                <AiFillCloseCircle onClick={onCloseClick} style={{ position: "absolute", left: "1px" }} />
                <h3 className="h3">תגובות</h3>
                {listCommentApi ?
                    (listCommentApi.map((post, index) => {
                        return (
                            <div key={index} className="listComment">
                                <button type="btn" style={{ width: "250px" }} className="btn btn-info" onClick={() => setEdit(edit => edit === index ? null : index)}>

                                    <img className="imgComment"
                                        src={`http://localhost:3003/uploads/${post.image}`} />{post.name + "..."}{edit === index && <p style={{ fontWeight: "bold" }}>{post.comment}</p>}</button>
                            </div>

                        )
                    })
                    ) : null}
                {
                    !listCommentApi.length && <Alert className="noYetComment">על עיר זו לא נכתבו תגובות</Alert>
                }

                <div style={{ display: "flex", }} >
                    <Form onSubmit={handelOnSubmit}>
                        <Form.Group >
                            <img className="imgOfUser"  
                            src={`http://localhost:3003/uploads/${token['img']}`} />
                            <Form.Control className="inputComment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="תגובה..."
                             as="textarea" rows="3" />
                        </Form.Group>
                        <Button className="sendComment" id="submit-button" variant="light" type="submit">שלח</Button>
                    </Form>
                </div>

            </div>
        </Container>
    )
}