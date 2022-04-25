import DataTable from 'react-data-table-component';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import { useCallback, useState, useMemo, useEffect } from 'react';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import EditUsersByAdmin from "../backOfficePage/editUsersByAdmin"
import HistoryOfDonations from '../payment/historyOfDonations';
import HistoryOfComments from "./controlOnCommentsByAdmin"
import DeleteAccountByAdmin from "./deleteUserByAdmin"
const token = JSON.parse(localStorage.getItem("loginToken"))



export default function WebsiteManagement() {
    const [selectedRows, setSelectedRows] = useState([])
    const [toggleCleared, setToggleCleared] = useState(false);
    const [showCommentsHistory, setShowCommentsHistory] = useState(false)
    const [show, setShow] = useState(true)
    const [data, setData] = useState('')
    const [showDonationHistory, setShowDonationHistory] = useState(false)
    const [donations, setDonations] = useState(null)
    const [commentByUser, setCommentByUser] = useState('')
    const [deleteAccount, setDeleteAccount] = useState("")

   
    const [editWindow, setEditWindow] = useState(false)
    const history = useHistory()

    const columns = [
        {
            name: 'מחובר',
            selector: row => <OnlinePredictionIcon style={{ color: new Date().getTime() < row.isUserOnline  ? 'green' : 'red' }} />


        },
        {
            name: 'משתמש',
            selector: row => row.name,
        },
        {
            name: "תמונה",
            selector: row =>
                <img width={35} src={`http://localhost:3003/uploads/${row.image}`} />
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
            selector: row => <Button size="sm" variant="secondary"

                onClick={() => donationHistory(row.email, 'donations')}
            >{row.sumDonationHistory.toFixed(2)}</Button>,

        }
        , {
            name: 'תגובות',
            selector: row => <Button size="sm" variant="secondary"
                onClick={() => commentsHistory(row.email, 'comments')}
            >{row.sumOfComments}</Button>,
        }

    ];



    const donationHistory = (userName, postOrDonate) => {

        setShowDonationHistory(!showDonationHistory)
        token &&
            axios.get(`admin/checkDonationAmount/${userName}/${postOrDonate}`,
               
                )
                .then(res => {
                    if (res.data.msg == '0:00') {
                        return setDonations('')
                    } else {
                        let lastElement = res.data.findUser[res.data.findUser.length - 1];
                        console.log(lastElement);
                        const dateDonations = res.data
                            && res.data.findUser?.map(i => {
                                return {
                                    donationAmount: i.donationAmount,
                                    donationDate: i.createdAt,
                                }
                            })
                        setDonations({ dateDonations, sumDonationHistory: lastElement.sumDonationHistory.toFixed(2) })
                    }

                }).catch(function (error) {
                    if (error.response) {
                        console.log(error.response);
                    }
                })

        console.log(donations);

    }


    async function checkDonationAmountAndComments(userName,postOrDonate) {
        try {
          const  response = await axios.get(`admin/checkDonationAmount/${userName}/${postOrDonate}`)

            const posts = response.data
                && response.data.postByUser?.map(i => {
                    return {
                        city: i.city,
                        comment: i.comment,
                        name: i.name,
                        image: i.image,
                        date: i.createdAt
                    }
                })
            setCommentByUser(posts)
           
        } catch (error) {
            if (error.response) {
                console.log({
                    data: error.response.data,
                    status: error.response.status,
                    headers: error.response.headers
                });
            }
        }

        console.log(commentByUser);

    }


    const commentsHistory =async (userName, postOrDonate) => {
        setShowCommentsHistory(!showCommentsHistory)
        await checkDonationAmountAndComments(userName,postOrDonate)
    }







    useEffect(() => {

        function getUsers(){
            token ? (
            axios.get(`admin/getAllUsers`,
          
            ).then(res => {
                res.data.msg === "אין לך הרשאה לנתונים אלו" && history.push("/mapsElection")

                const users =
                    res.data.users &&
                    res.data.users.map((m) => {
                        return {
                            name: m.name,
                            permissions: m.permissions,
                            image: m.image,
                            activateUserByMail: m.activateUserByMail,
                            isUserOnline: new Date(m?.timeUserConnect).getTime() + 7193000,
                            email: m.email,
                            pass: m.pass,
                            sumDonationHistory: m.sumDonationHistory,
                            sumOfComments: m.sumOfComments
                        };
                    });

                setData(users)

                console.log(users);
            }).catch(async function (error) {
                if (error.response) {

                    console.log({
                        data: error.response.data,
                        status: error.response.status,
                        headers: error.response.headers
                    });
                }
            })
            ) : history.push("/login")

        }
       
        getUsers()
    }, [selectedRows,commentByUser])

    function changeComment(comments) {
        setCommentByUser(comments)
    }


    const handleRowSelected = useCallback(state => {
        setSelectedRows(state.selectedRows);
        if (state.selectedRows.length > 1) {
            setToggleCleared(!toggleCleared)
            setSelectedRows("")
        }
    }, []);

    const cancel = () => {
        setShow(true)
        setToggleCleared(!toggleCleared);

    }
    const contextActions = useMemo(() => {
        const handleDelete = () => {
            if (window.confirm(`אתה בטוח שברצונך למחוק את?:\r
             ${selectedRows?.map(r => r.name)}?`)) {
                setToggleCleared(!toggleCleared);
                console.log(selectedRows);
                setDeleteAccount(selectedRows?.map(r => r.email))
                console.log(toggleCleared);
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
                {deleteAccount && <DeleteAccountByAdmin userName={deleteAccount} />}
                <Button key="cancel" onClick={() => cancel()} variant="outlined" icon="true">
                    בטל
                </Button>
                <Button key="delete" onClick={handleDelete} variant="outlined" icon="true"><DeleteIcon />

                </Button>
                <Button key="edit" onClick={() => setEditWindow(!editWindow)} variant="outlined"><EditIcon />

                </Button>


            </>

        );

    }, [data, selectedRows, toggleCleared]);


    return (
        <div>
            {
                editWindow ? (<div> <EditUsersByAdmin /><Button variant="contained"
                    style={{ position: "absolute" }}
                    onClick={() => setEditWindow(!editWindow)}>ביטול</Button></div>
                ) :
                    <DataTable
                        title={"ניהול דפי משתמשים"}
                        columns={columns}
                        data={data}
                        contextActions={show && contextActions}
                        selectableRows
                        clearSelectedRows={toggleCleared}
                        onSelectedRowsChange={handleRowSelected}
                        pagination
                    />

            }
            {donations && showDonationHistory ? (<HistoryOfDonations donations={donations} />) : null}
            {commentByUser && showCommentsHistory ? (<HistoryOfComments changeComment={changeComment} commentByUser={commentByUser} />) : null}
        </div>

    )
}

