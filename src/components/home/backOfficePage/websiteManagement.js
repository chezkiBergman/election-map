import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import { useCallback, useState, useMemo, useEffect } from 'react';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import EditUser from '../usersLogin/editUser/editUser';
import HistoryOfDonations from '../payment/historyOfDonations';




export default function WebsiteManagement() {
    const [selectedRows, setSelectedRows] = useState([])
    const [toggleCleared, setToggleCleared] = useState(false);
    const[userName,setUserName]=useState("")
    const [show, setShow] = useState(true)
    const [data, setData] = useState('')
   const[ showDonationHistory,setShowDonationHistory]=useState(false)
   const [donations, setDonations] = useState(null)
    
   const token = JSON.parse(localStorage.getItem("loginToken"))
    const[editWindow,setEditWindow]=useState(false)
    const history = useHistory()

    const columns = [
        {
            name: 'משתמש',
            selector: row => row.name,
        },
        {
            name: "תמונה",
            selector: row => 
           <img width={35} src={`http://localhost:3003/uploads/${row.image}`}/>
        },
        {
            name: 'פעילות חשבון',
            selector: row => row.activateUserByMail,
        },
        {
            name: "הרשאות",
            selector: row => row.permissions,
        },
        {
            name: "אימייל",
            selector: row => row.email,
        },
        {
            name: "סיסמה",
            selector: row => row.pass,
        }, {
            name: "תרומות",
            selector: row => <Button size="sm" variant="secondary" onClick={()=>setUserName(row.email)} onMouseDownCapture={donationHistory}>{row.sumDonationHistory}</Button>,
        },
    
    ];
    
    const donationHistory=()=>{
        setShowDonationHistory(!showDonationHistory)
        console.log(userName);
        axios.get(`http://localhost:3003/users/checkDonationAmount/${userName}`, { headers: { "Authorization": `Bearer ${token['token']}` } })
      .then(res => {
        let lastElement = res.data.findUser[res.data.findUser.length - 1];
        console.log(lastElement);
          const dateDonations = res.data 
          && res.data.findUser?.map(i=>{
            return{
              donationAmount: i.donationAmount,
              donationDate: i.date,
            }
             })
         setDonations({dateDonations, sumDonationHistory: lastElement.sumDonationHistory.toFixed(2)})
        
      }).catch(function (error) {
          if (error.response) {
              console.log({ data: error.response.data, status: error.response.status, headers: error.response.headers });
          }
      })
      console.log(donations);
    }
    
    useEffect(() => {
       
        token ? (
            axios.get(`http://localhost:3003/users/getAllUsers`, { headers: { "Authorization": `Bearer ${token['token']}` } })
                .then(res => {
                    res.data.msg === "אין לך הרשאה לנתונים אלו" && history.push("/mapsElection")
                    const list =
                        res.data.users &&
                        res.data.users.map((m) => {
                            return {
                                name: m.name,
                                permissions: m.permissions,
                                image: m.image,
                                activateUserByMail: m.activateUserByMail,
                                email: m.email,
                                pass: m.pass,
                                sumDonationHistory: m.sumDonationHistory
                            };
                        });

                    setData(list)
                    console.log(res.data);
                }).catch(function (error) {
                    if (error.response) {
                        console.log({ data: error.response.data, status: error.response.status, headers: error.response.headers });
                    }
                })

        ) : history.push("/login")
    }, [selectedRows])



    const handleRowSelected = useCallback(state => {
        setSelectedRows(state.selectedRows);
        console.log(state.selectedRows);
    }, []);

    const cancel =()=>{
        // setShow(!show)
        setEditWindow(!editWindow)

     }
    const contextActions = useMemo(() => {
        const handleDelete = () => {
            if (window.confirm(`אתה בטוח שברצונך למחוק את?:\r ${selectedRows.map(r => r.name)}?`)) {
                setToggleCleared(!toggleCleared);
                let newData;
                for (let i = 0; i < selectedRows.length; i++) {
                    const element = selectedRows[i].name;
                     newData = data.filter(item => item.name !== element)
                }
                console.log(newData);
                setData(newData);
            }
        };
        
         
        
     
        return (

            <>
                <Button key="cancel" onClick={()=>cancel()} style={{ backgroundColor: 'blue' }} icon>
                    בטל
                </Button>
                <Button key="delete" onClick={handleDelete} style={{ backgroundColor: 'red' }} icon>
                    מחק
                </Button>
                <Button key="edit" onClick={()=>setEditWindow(!editWindow)} style={{ backgroundColor: 'green' }} icon>
                    ערוך
                </Button>


            </>

        );
        
    }, [data, selectedRows, toggleCleared]);

   
    return (
        <div>
{
   editWindow  ? ( <div> <EditUser/><Button style={{position:"absolute"}} onClick={()=>cancel() }>ביטול</Button></div>
   ):
            <DataTable
                title= { "ניהול דפי משתמשים"}
                columns={columns}
                data={data}
                contextActions={show && contextActions}
                selectableRows
                clearSelectedRows={toggleCleared}
                onSelectedRowsChange={handleRowSelected}
                pagination
            />
   
}
{donations && showDonationHistory ?( <HistoryOfDonations donations={donations} />):null}
</div>

    )
}

