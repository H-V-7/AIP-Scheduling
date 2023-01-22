import {Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow} from "@mui/material";







export  function Schedule(prop){
    
    
    let data = prop.data
    
    console.log(data)
    
   

  
    return(
        <>

        
        {!data ? "" : 
        
            <TableContainer sx={{margin:5}}>
                <Paper elevation={8} variant={"outlined"}>
                <Table sx={{border:2,minWidth:650}} ariale-label="SLOT">      
                    <TableHead sx={{border:2}}>
                        <TableRow sx={{border:1}}>
                            <TableCell align="center" sx={{border:1,fontStyle:"italic",fontSize:20}}>Faculty Name</TableCell>
                            {data.newTimeSlots.map((result,index) => <TableCell align="center" sx={{border:1,fontSize:15}} key={index}>{result}</TableCell>)} 
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{border:1}}>
                        {data.freeSlot.map((result) => (<TableRow sx={{border:2}}><TableCell align="center" sx={{border:2,fontSize:20}}>{result.name}</TableCell>{result.status.map((res,index) => (res === "YES" ?  <TableCell align="center" sx={{backgroundColor:"green",border:2,fontSize:15}} key={index}>{res}</TableCell>: <TableCell align="center"  sx={{backgroundColor:"red",border:2}} key={index}>{res}</TableCell>))} </TableRow>))} 
                    </TableBody>
                </Table>   
                </Paper>
            </TableContainer>
            
        }
        </>
    )
    
}