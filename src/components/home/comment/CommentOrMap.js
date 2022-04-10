import { Button } from "react-bootstrap"


export default function CommentOrMap({ activeMarker, setShowDiv, setClickedMap, setClickedComment }) {
    return (
        <div style={{ backgroundColor: activeMarker.color, opacity: 0.65, padding: 12 }}>
            <Button variant="danger" onClick={setShowDiv}>x</Button>
            <span style={{
                color: 'aliceblue',
                display: 'block',
                textAlign: 'center',
                fontSize: 'larger',
                fontWeight: 'bold',
                marginBottom: "15px"
            }}>{activeMarker['properties']["City"]}</span>
            {activeMarker.color === 'red' ? (<p style={{ color: "white", textAlign: 'center' }}>בעיר זו זכתה הקואליציה במירב הקולות</p>)
                : <p style={{ color: "white", textAlign: 'center' }}>בעיר זו זכתה האופוזיציה במירב הקולות</p>}
            < div style={{ display: 'flex', justifyContent: 'space-around' }}>

                <Button variant="outline-info" style={{ fontWeight: 'bolder', color: 'white' }} onClick={setClickedMap}>
                    מפת הבחירות
                </Button>
                <Button variant="outline-success" style={{ fontWeight: 'bolder', color: 'white' }} onClick={setClickedComment}>
                    תגובות
                </Button>
            </div>

        </div>
    )

}