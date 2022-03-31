
import { Button, Container } from "react-bootstrap"
import { useState } from "react"
import * as styles from "./map.module.css"




export default function MandatByParties() {
    const [show, setShow] = useState(false)


    return (
        <Container>
            <Button style={{ position: "absolute", left: "20%" }} onClick={() => setShow(!show)}>חלוקת המנדטים</Button>
            {show &&
                <div className="container" style={{ justifyContent: "flex-end" }}>
                    <div className={styles.div1}><img src="http://localhost:3000/Netanyahu_official_portrait_(cropped).jpg" style={{width:"25px"}}/><span className={styles.span}> 30 הליכוד</span></div>
                    <div className={styles.div2}><img src="http://localhost:3000/Yair_Lapid_2021_(cropped).jpg" style={{width:"25px"}}/><span className={styles.span}>17 יש עתיד</span></div>
                    <div className={styles.div3}><img src="http://localhost:3000/אריה_דרעי_2.jpg" style={{width:"25px"}}/><span className={styles.span}>9 ש"ס</span></div>
                    <div className={styles.div4}><img src="http://localhost:3000/Benny_Gantz_2019_(cropped).jpg" style={{width:"25px"}}/><span className={styles.span}>8 כחול לבן</span></div>
                    <div className={styles.div5}><img src="http://localhost:3000/Gafni_(cropped).png" style={{width:"25px"}}/><span className={styles.span}>7 יהדות התורה </span></div>
                    <div className={styles.div6}><img src="http://localhost:3000/Avigdor_Lieberman_2017.jpg" style={{width:"25px"}}/><span className={styles.span}>ישראל ביתנו 7</span></div>
                    <div className={styles.div7}><img src="http://localhost:3000/הורדה.jpg" style={{width:"25px"}}/><span className={styles.span}>ימינה 7</span></div>
                    <div className={styles.div8}><img src="http://localhost:3000/Merav_Michaeli_by_Ron_Kedmi.jpg" style={{width:"25px"}}/><span className={styles.span}>7 העבודה</span></div>
                    <div className={styles.div9}><img src="http://localhost:3000/הורדה (2).jpg" style={{width:"25px"}}/><span className={styles.span}>הציונות הדתית 6</span></div>
                    <div className={styles.div10}><img src="http://localhost:3000/הורדה (4).jpg" style={{width:"25px"}}/><span className={styles.span}>מרצ 6</span></div>
                    <div className={styles.div11}><img src="http://localhost:3000/הורדה (1).jpg" style={{width:"25px"}}/><span className={styles.span}>6 המשותפת </span></div>
                    <div className={styles.div12}><img src="http://localhost:3000/הורדה (3).jpg" style={{width:"25px"}}/><span className={styles.span}> תקווה חדשה 5</span></div>
                    <div className={styles.div13}> <img src="http://localhost:3000/20210329142112!מנסור_עבאס.jpg" style={{width:"25px"}}/><span className={styles.span}>רע"מ 4</span></div>


                </div>
            }


        </Container>
    )
}