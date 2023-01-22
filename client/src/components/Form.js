import { useEffect, useState } from "react";
import Axios from "axios"
import { Schedule } from "./Schedule";
import {PageHeader} from "./PageHeader"
import {Button,TextField, styled, CircularProgress} from "@mui/material"
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import SendIcon from '@mui/icons-material/Send';




const Container = styled("main")({
    marginTop:50,
    display:"grid",
    justifyItems:"center",
    
   
})
const Div = styled("div")({
    display: "flex",
    gap:50
})
const FormContainer = styled("form")({
    border:"none",
    width:"100%",
    height:"100%",
    margin:"auto",
    display:"grid",
    justifyItems:"center",
    gap:50
    
})


function Form() {

    const [formData, setFormData] =useState({startTime:"",endTime:""})
    const [file, setFile] = useState("");
    const [data,setData] = useState("");
    const [newValue, setValue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState(null);
    
    
    function handleChange(event) {
        setFormData(previousFormData =>{
            return{
                ...previousFormData, 
                [event.target.name]:event.target.value
            }
        })
    }

    function handleClick(event) {
        
        setLoading(true)
        event.preventDefault();
        setTimeout(() =>{
        const postFormData = new FormData();
        postFormData.append("startTime",formData.startTime);
        postFormData.append("endTime",formData.endTime);
        postFormData.append("date",newValue);
        postFormData.append("file",file);
            
        Axios.post("http://localhost:3001/aip",postFormData,{
                headers: {
                    'Access-Control-Allow-Origin': 'cors',
                },
                }).then((res) => setData(res.data))
                .then(setError(null))
                .then(setLoading(false))
                .catch((error) => setError(error.response.data))},2000 )
    }

    
    console.log(data.timeSlots)
 
    return(
    <>
        <PageHeader />
        <Container>
            <FormContainer onSubmit={handleClick} encType="multipart/form-data">
            <Div class="timeInput">
                <TextField  label="From"  name="startTime" variant="outlined" placeholder="9:00" onChange={handleChange} value={formData.startTime} required />
                <TextField label="To"  name="endTime" variant="outlined" placeholder="9:30" onChange={handleChange} value={formData.endTime} required />
            </Div>
           <div class="dateInput">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker 
                value={newValue}
                label="Choose Date"
                onChange={(newValue) => setValue(newValue)}
                renderInput={(params) => <TextField {...params} />}
            />
            </LocalizationProvider>
            </div>
            <Div >
            <Button sx={{gap:2}} variant="contained" component="label">
                Upload Schedule
                <input hidden accept=".xlsx" multiple type="file" onChange={event =>{
                    const file = event.target.files[0];
                    setFile(file)
                }}/>
                <FileUploadIcon />
            </Button>
            <Button sx={{gap:2}} variant="contained" component="label">
                Search
                <input hidden type="submit"  />
                <SendIcon />
            </Button>
            </Div>
            {!error ? "" : <h1 style={{color:"red"}}>{error}</h1>}
        </FormContainer>
        </Container> 
         {!error ? loading ? <CircularProgress sx={{alignItems:"center"}}/> : <Schedule data={data}/> : ""}
         
    </>
    
   
    )
    
}


export default Form;