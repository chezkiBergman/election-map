import {Table,Button} from "react-bootstrap"
// import { InfoWindow } from "@react-google-maps/api"
import  {AiFillCloseCircle} from "react-icons/ai"



export default function TableElection({activeMarker,closeClick}){

   


return(
 <div style={{position:"absolute",display:"flex",left:"3%",top:"3%",}}
                    position={{ lat: activeMarker.geometry.coordinates[1], lng: activeMarker.geometry.coordinates[0] }} >
                    <div  style={{background: '#accae4'}}>
                    <AiFillCloseCircle onClick={closeClick} style={{position:"absolute"}} />
                    <Table   striped bordered hover size="sm" style={{ background: "hsl(31 57 97 / 25%)" }}>
                        <thead>
                            <tr style={{fontWeight:"bold", textAlign:"center"}}>
                                <th style={{ textAlign: 'center' }} colSpan={15}>{activeMarker['properties']["City"]}</th>
                            </tr>
                            <tr >
                                {/* <th>*</th> */}
                                <th>*</th>
                                <th>ימינה</th>
                                <th>ליכוד</th>
                                <th>יש עתיד</th>
                                <th>העבודה</th>
                                <th>שס</th>
                                <th>כחול לבן</th>
                                <th>יהדות התורה</th>
                                <th>ישראל ביתנו</th>
                                <th>הרשימה המשותפת</th>
                                <th>מרצ</th>
                                <th>תקווה חדשה</th>
                                <th>הציונות הדתית </th>
                                <th>רעמ</th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr  style={{fontWeight:"bold",textAlign:"center"}}>
                                <th>קולות למפלגה</th>
                                {/* <td></td> */}
                                <td>{activeMarker['properties']["yamina"]}</td>
                                <td>{activeMarker['properties']['likud']}</td>
                                <td>{activeMarker['properties']['yesh atid']}</td>
                                <td>{activeMarker['properties']['labor party']}</td>
                                <td>{activeMarker['properties']['Shas']}</td>
                                <td>{activeMarker['properties']['Blue and White']}</td>
                                <td>{activeMarker['properties']['United Torah']}</td>
                                <td>{activeMarker['properties']['Yisrael beiteinu']}</td>
                                <td>{activeMarker['properties']['joint list']}</td>
                                <td>{activeMarker['properties']['meretz']}</td>
                                <td>{activeMarker['properties']['New Hope']}</td>
                                <td>{activeMarker['properties']['Religious Zionist Party']}</td>
                                <td>{activeMarker['properties']['United Arab List']}</td>
                            </tr>
                            <tr  style={{fontWeight:"bold"}}>
                                <th>מצביעים</th>
                                <td style={{ textAlign: "center" }} colSpan={15}>{activeMarker['properties']["vote"]}</td>
                            </tr>
                            <tr  style={{fontWeight:"bold"}}>
                                <th>קולות פסולים</th>
                                <td style={{ textAlign: "center" }} colSpan={15}>{activeMarker['properties']["invalid"]}</td>
                            </tr>
                            <tr  style={{fontWeight:"bold"}}>
                                <th>קולות כשרים</th>
                                <td style={{ textAlign: "center" }} colSpan={15}>{activeMarker['properties']["valid"]}</td>
                            </tr>
                        </tbody>
                      
                    </Table>
                    </div>
                </div>
)}
               