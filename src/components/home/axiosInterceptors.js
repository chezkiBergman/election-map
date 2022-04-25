import axios from "axios";

const newToken = JSON.parse(localStorage.getItem('loginToken'))
axios.defaults.headers.common['Authorization'] = `Bearer ${newToken?.['token']}`;
axios.defaults.baseURL = 'http://localhost:3003/';
axios.defaults.withCredentials = true

let refresh = 0;

axios.interceptors.request.use(config => {
    config.headers['Authorization'] = `Bearer ${newToken?.['token']}`
    console.log(config);
        return config;
    },
    // error => {
    //     return Promise.reject(error);
    // }
)

axios.interceptors.response.use(resp =>  resp , async error => {
    
    if (error.response.data === "jwt expired" && refresh < 2) {
        try{
            const response = await axios.get(`users/createNewToken`,)
            if (response?.data.accessToken) {
                error.config.headers['Authorization'] = `Bearer ${response.data['accessToken']}`;
                const accessToken = response.data.accessToken
                newToken['token'] = accessToken
                localStorage.setItem('loginToken', JSON.stringify(newToken))
                JSON.parse(localStorage.getItem('loginToken'))
               
                console.log(error.config);
                return axios(error.config);
            } 
        }catch(error){
            console.log(error);
            if (error.response.status === 401|| error.response.status === 403) {
                localStorage.removeItem('loginToken')
                window.location.href = '/login'
            } 
        }
            


        }
       
    refresh++;
  return Promise.reject(error);
});